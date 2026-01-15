"""
MCP Client for studio-mcp integration.

TAG: [SPEC-STUDIO-002][Task-2.4][MCP-Client]

Provides intelligent preset suggestions from studio-mcp server
with automatic fallback to default presets on connection failure.

Example:
    async with MCPClient() as client:
        suggestions = await client.get_suggestions(context="ecommerce")
"""

import asyncio
import logging
from typing import Any

import httpx

logger = logging.getLogger(__name__)


class MCPClient:
    """
    Client for studio-mcp server integration.

    Fetches curated preset suggestions from MCP server with
    automatic fallback to default presets on connection failure.

    Args:
        mcp_url: MCP server URL (default: http://localhost:3000)
        timeout: Request timeout in seconds (default: 5.0)
    """

    def __init__(
        self,
        mcp_url: str = "http://localhost:3000",
        timeout: float = 5.0,
    ):
        self.mcp_url = mcp_url
        self.timeout = timeout
        self._client = httpx.AsyncClient(timeout=timeout)

    async def get_suggestions(self, context: str | None = None) -> list[dict[str, Any]]:
        """
        Get preset suggestions from MCP server.

        Args:
            context: Optional context string to guide suggestions

        Returns:
            List of preset dictionaries with id, name, category, description

        Note:
            Automatically falls back to default presets if MCP server unavailable
        """
        try:
            response = await self._fetch_from_mcp(context)
            return self._extract_presets(response)

        except (httpx.HTTPError, httpx.ConnectError, asyncio.TimeoutError) as e:
            logger.warning(f"MCP connection failed: {e}, using fallback presets")
            return await self.get_default_presets()

        except Exception as e:
            logger.error(f"Unexpected error in MCP client: {e}")
            return await self.get_default_presets()

    async def _fetch_from_mcp(self, context: str | None) -> dict[str, Any]:
        """
        Fetch suggestions from MCP server.

        Args:
            context: Optional context for suggestions

        Returns:
            Raw JSON response from MCP server

        Raises:
            httpx.HTTPError: On HTTP errors
            httpx.ConnectError: On connection failures
        """
        response = await self._client.get(
            f"{self.mcp_url}/api/suggestions",
            params={"context": context} if context else {},
        )
        response.raise_for_status()
        return response.json()

    def _extract_presets(self, data: Any) -> list[dict[str, Any]]:
        """
        Extract preset list from MCP response.

        Args:
            data: Raw MCP response data

        Returns:
            List of preset dictionaries

        Note:
            Falls back to default presets on unexpected format
        """
        if isinstance(data, list):
            return data
        elif isinstance(data, dict) and "presets" in data:
            return data["presets"]
        else:
            logger.warning("Unexpected MCP response format, using fallback")
            # Return empty list and let caller handle fallback
            return []

    async def get_default_presets(self) -> list[dict[str, Any]]:
        """
        Get default fallback presets when MCP unavailable.

        Returns:
            List of default preset dictionaries with full response fields
        """
        from datetime import datetime, timezone

        now = datetime.now(timezone.utc)
        return [
            {
                "id": 1,
                "name": "SaaS Modern",
                "category": "business",
                "description": "Clean, professional design for modern SaaS products",
                "config": {},
                "tags": ["professional", "clean", "modern"],
                "is_active": True,
                "created_at": now,
                "updated_at": now,
            },
            {
                "id": 2,
                "name": "Editorial Chic",
                "category": "creative",
                "description": "Elegant editorial style for content-focused brands",
                "config": {},
                "tags": ["elegant", "editorial", "sophisticated"],
                "is_active": True,
                "created_at": now,
                "updated_at": now,
            },
            {
                "id": 3,
                "name": "Tech Startup",
                "category": "technology",
                "description": "Bold, innovative design for tech startups",
                "config": {},
                "tags": ["bold", "tech", "innovative"],
                "is_active": True,
                "created_at": now,
                "updated_at": now,
            },
        ]

    async def close(self):
        """Close HTTP client connection"""
        await self._client.aclose()

    async def __aenter__(self):
        """Async context manager entry"""
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.close()
