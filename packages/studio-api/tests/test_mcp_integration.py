"""
Tests for MCP Integration with studio-mcp server

TAG: [SPEC-STUDIO-002][Task-2.4][MCP-Integration]
"""

import pytest
from httpx import AsyncClient
from unittest.mock import AsyncMock, patch, MagicMock


pytestmark = pytest.mark.asyncio


class TestMCPIntegration:
    """Test MCP server integration for preset suggestions"""

    async def test_suggestions_endpoint_exists(self, async_client: AsyncClient):
        """Test that suggestions endpoint is available"""
        response = await async_client.get("/api/v2/themes/suggestions")
        assert response.status_code in [200, 500, 503]  # Exists, may fail

    async def test_suggestions_returns_preset_list(self, async_client: AsyncClient):
        """Test that suggestions endpoint returns list of presets"""
        response = await async_client.get("/api/v2/themes/suggestions")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    async def test_suggestions_preset_structure(self, async_client: AsyncClient):
        """Test that suggested presets have expected structure"""
        response = await async_client.get("/api/v2/themes/suggestions")
        assert response.status_code == 200
        presets = response.json()

        first_preset = presets[0]
        assert "id" in first_preset
        assert "name" in first_preset
        assert "category" in first_preset
        assert "description" in first_preset

    @patch("studio_api.services.mcp_client.MCPClient.get_suggestions")
    async def test_suggestions_with_mcp_success(
        self, mock_mcp: AsyncMock, async_client: AsyncClient
    ):
        """Test suggestions when MCP server responds successfully"""
        from datetime import datetime, timezone

        now = datetime.now(timezone.utc)
        mock_mcp.return_value = [
            {
                "id": 999,
                "name": "SaaS Modern",
                "category": "business",
                "description": "Modern SaaS preset",
                "config": {},
                "tags": ["modern"],
                "is_active": True,
                "created_at": now,
                "updated_at": now,
            }
        ]

        response = await async_client.get("/api/v2/themes/suggestions")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["name"] == "SaaS Modern"

    @patch("studio_api.services.mcp_client.MCPClient.get_suggestions")
    async def test_suggestions_fallback_on_mcp_failure(
        self, mock_mcp: AsyncMock, async_client: AsyncClient
    ):
        """Test fallback to default presets when MCP fails"""
        mock_mcp.side_effect = Exception("MCP connection failed")

        response = await async_client.get("/api/v2/themes/suggestions")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0  # Should return default presets

    @patch("studio_api.services.mcp_client.MCPClient.get_suggestions")
    async def test_suggestions_with_context_parameter(
        self, mock_mcp: AsyncMock, async_client: AsyncClient
    ):
        """Test suggestions with optional context parameter"""
        mock_mcp.return_value = []

        response = await async_client.get(
            "/api/v2/themes/suggestions",
            params={"context": "ecommerce website"}
        )
        assert response.status_code == 200
        mock_mcp.assert_called_once()

    @patch("studio_api.services.mcp_client.MCPClient.get_suggestions")
    async def test_suggestions_timeout_handling(
        self, mock_mcp: AsyncMock, async_client: AsyncClient
    ):
        """Test handling of MCP timeout"""
        import asyncio
        mock_mcp.side_effect = asyncio.TimeoutError("MCP timeout")

        response = await async_client.get("/api/v2/themes/suggestions")
        assert response.status_code == 200  # Falls back gracefully
        data = response.json()
        assert isinstance(data, list)


class TestMCPClient:
    """Test MCP client service class"""

    def test_mcp_client_initialization(self):
        """Test MCPClient can be instantiated"""
        from studio_api.services.mcp_client import MCPClient

        client = MCPClient()
        assert client is not None

    @patch("anthropic.Anthropic")
    async def test_mcp_client_get_suggestions(self, mock_anthropic: MagicMock):
        """Test MCPClient.get_suggestions method"""
        from studio_api.services.mcp_client import MCPClient

        mock_response = MagicMock()
        mock_response.content = [
            {"type": "text", "text": '{"presets": [{"name": "Test"}]}'}
        ]
        mock_anthropic.return_value.messages.create.return_value = mock_response

        client = MCPClient()
        suggestions = await client.get_suggestions(context="test context")

        assert isinstance(suggestions, list)

    async def test_mcp_client_connection_error_handling(self):
        """Test MCPClient handles connection errors gracefully"""
        from studio_api.services.mcp_client import MCPClient

        client = MCPClient(mcp_url="http://invalid-url:9999")

        # Should not raise exception, should return default presets
        suggestions = await client.get_suggestions()
        assert isinstance(suggestions, list)
        assert len(suggestions) > 0  # Returns default presets

    async def test_mcp_client_default_fallback_presets(self):
        """Test MCPClient returns default presets on failure"""
        from studio_api.services.mcp_client import MCPClient

        client = MCPClient(mcp_url="http://invalid-url:9999")
        fallback = await client.get_default_presets()

        assert isinstance(fallback, list)
        assert len(fallback) > 0
        assert all("id" in p and "name" in p for p in fallback)
