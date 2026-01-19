"""Additional API edge case tests for coverage."""

import pytest
from httpx import AsyncClient


class TestAPIEdgeCases:
    """Test API edge cases to improve coverage."""

    async def test_list_presets_with_pagination_response_structure(self, async_client: AsyncClient):
        """Test list endpoint response structure - covers line 68."""
        # Create some test data
        await async_client.post(
            "/api/v2/themes",
            json={
                "name": "Test 1",
                "category": "test",
                "description": "Test",
                "config": {},
                "tags": ["tag1"],
            },
        )
        await async_client.post(
            "/api/v2/themes",
            json={
                "name": "Test 2",
                "category": "test",
                "description": "Test",
                "config": {},
                "tags": ["tag2"],
            },
        )

        # Test with pagination parameters
        response = await async_client.get("/api/v2/themes?skip=0&limit=1")

        assert response.status_code == 200
        data = response.json()

        # Verify response structure with pagination
        assert "items" in data
        assert "total" in data
        assert "skip" in data
        assert "limit" in data
        assert data["skip"] == 0
        assert data["limit"] == 1
        assert len(data["items"]) == 1
        assert data["total"] >= 2

    async def test_get_preset_not_found_error_detail(self, async_client: AsyncClient):
        """Test get preset 404 error detail - covers lines 85-89."""
        response = await async_client.get("/api/v2/themes/99999")

        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert "99999" in data["detail"]
        assert "not found" in data["detail"].lower()

    async def test_get_preset_validation_response(self, async_client: AsyncClient):
        """Test get preset response validation - covers line 91."""
        # Create a preset
        create_response = await async_client.post(
            "/api/v2/themes",
            json={
                "name": "Validation Test",
                "category": "test",
                "description": "Test validation",
                "config": {"key": "value"},
                "tags": ["test"],
            },
        )
        theme_id = create_response.json()["id"]

        # Get the preset
        response = await async_client.get(f"/api/v2/themes/{theme_id}")

        assert response.status_code == 200
        data = response.json()

        # Verify response has all required fields (validation passed)
        assert data["id"] == theme_id
        assert data["name"] == "Validation Test"
        assert data["category"] == "test"
        assert "created_at" in data
        assert "updated_at" in data

    async def test_create_preset_response_validation(self, async_client: AsyncClient):
        """Test create preset response validation - covers line 111."""
        response = await async_client.post(
            "/api/v2/themes",
            json={
                "name": "Response Validation Test",
                "category": "business",
                "description": "Testing response validation",
                "config": {"theme": "dark"},
                "tags": ["validation", "test"],
            },
        )

        assert response.status_code == 201
        data = response.json()

        # Verify response has all required fields
        assert "id" in data
        assert "name" in data
        assert "category" in data
        assert "created_at" in data
        assert "updated_at" in data
        assert data["name"] == "Response Validation Test"

    async def test_update_preset_not_found_error_detail(self, async_client: AsyncClient):
        """Test update preset 404 error detail - covers lines 131-135."""
        response = await async_client.patch(
            "/api/v2/themes/99999",
            json={"name": "Updated Name"},
        )

        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert "99999" in data["detail"]
        assert "not found" in data["detail"].lower()

    async def test_update_preset_response_validation(self, async_client: AsyncClient):
        """Test update preset response validation - covers line 137."""
        # Create a preset first
        create_response = await async_client.post(
            "/api/v2/themes",
            json={
                "name": "Original Name",
                "category": "test",
                "description": "Original description",
                "config": {},
                "tags": ["test"],
            },
        )
        theme_id = create_response.json()["id"]

        # Update the preset
        response = await async_client.patch(
            f"/api/v2/themes/{theme_id}",
            json={
                "name": "Updated Name",
                "description": "Updated description",
            },
        )

        assert response.status_code == 200
        data = response.json()

        # Verify response validation passed with updated data
        assert data["id"] == theme_id
        assert data["name"] == "Updated Name"
        assert data["description"] == "Updated description"
        assert "created_at" in data
        assert "updated_at" in data

    async def test_delete_preset_not_found_error_detail(self, async_client: AsyncClient):
        """Test delete preset 404 error detail - covers lines 154-158."""
        response = await async_client.delete("/api/v2/themes/99999")

        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
        assert "99999" in data["detail"]
        assert "not found" in data["detail"].lower()

    async def test_delete_preset_success_no_content(self, async_client: AsyncClient):
        """Test delete preset returns 204 No Content on success."""
        # Create a preset
        create_response = await async_client.post(
            "/api/v2/themes",
            json={
                "name": "To Be Deleted",
                "category": "test",
                "description": "Will be deleted",
                "config": {},
                "tags": ["test"],
            },
        )
        theme_id = create_response.json()["id"]

        # Delete the preset
        response = await async_client.delete(f"/api/v2/themes/{theme_id}")

        assert response.status_code == 204
        assert len(response.content) == 0  # No content in response

        # Verify preset is no longer accessible
        get_response = await async_client.get(f"/api/v2/themes/{theme_id}")
        assert get_response.status_code == 404


class TestMCPClientCoverage:
    """Additional MCP client edge cases."""

    async def test_suggestions_context_parameter(self, async_client: AsyncClient):
        """Test suggestions endpoint with context parameter."""
        response = await async_client.get(
            "/api/v2/themes/suggestions?context=business+website"
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Should return fallback presets since MCP server not running
        assert len(data) >= 1

    async def test_suggestions_no_context(self, async_client: AsyncClient):
        """Test suggestions endpoint without context parameter."""
        response = await async_client.get("/api/v2/themes/suggestions")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # Should return fallback presets
        assert len(data) >= 1

        # Verify preset structure
        if data:
            preset = data[0]
            assert "id" in preset
            assert "name" in preset
            assert "category" in preset
            assert "description" in preset
