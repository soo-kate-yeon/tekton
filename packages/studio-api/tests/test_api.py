"""
Test suite for Curated Preset API endpoints.

This module tests the FastAPI v2 endpoints for managing curated presets.
Following TDD RED-GREEN-REFACTOR cycle for SPEC-STUDIO-002.
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from studio_api.models.curated_theme import CuratedTheme


@pytest.mark.asyncio
async def test_list_presets_empty(async_client: AsyncClient):
    """Test listing presets when database is empty."""
    response = await async_client.get("/api/v2/themes")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 0


@pytest.mark.asyncio
async def test_list_presets_with_data(async_client: AsyncClient, db_session: AsyncSession):
    """Test listing presets with existing data."""
    # Create test presets
    presets = [
        CuratedTheme(
            name="Modern Minimalist",
            category="professional",
            description="Clean and professional design",
            config={"colors": {"primary": "#000000"}},
            tags=["modern", "minimal"],
            is_active=True,
        ),
        CuratedTheme(
            name="Vintage Warm",
            category="creative",
            description="Warm vintage aesthetics",
            config={"colors": {"primary": "#8B4513"}},
            tags=["vintage", "warm"],
            is_active=True,
        ),
    ]
    for preset in presets:
        db_session.add(preset)
    await db_session.commit()

    response = await async_client.get("/api/v2/themes")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert data["total"] == 2
    assert data["items"][0]["name"] == "Modern Minimalist"
    assert data["items"][1]["name"] == "Vintage Warm"


@pytest.mark.asyncio
async def test_list_presets_filter_by_category(
    async_client: AsyncClient, db_session: AsyncSession
):
    """Test filtering presets by category."""
    presets = [
        CuratedTheme(
            name="Business Pro",
            category="professional",
            description="Professional business design",
            config={},
            is_active=True,
        ),
        CuratedTheme(
            name="Art Deco",
            category="creative",
            description="Creative artistic design",
            config={},
            is_active=True,
        ),
    ]
    for preset in presets:
        db_session.add(preset)
    await db_session.commit()

    response = await async_client.get("/api/v2/themes?category=professional")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["category"] == "professional"


@pytest.mark.asyncio
async def test_list_presets_filter_by_tags(
    async_client: AsyncClient, db_session: AsyncSession
):
    """Test filtering presets by tags."""
    presets = [
        CuratedTheme(
            name="Dark Mode",
            category="modern",
            description="Dark theme preset",
            config={},
            tags=["dark", "modern"],
            is_active=True,
        ),
        CuratedTheme(
            name="Light Mode",
            category="modern",
            description="Light theme preset",
            config={},
            tags=["light", "modern"],
            is_active=True,
        ),
    ]
    for preset in presets:
        db_session.add(preset)
    await db_session.commit()

    response = await async_client.get("/api/v2/themes?tags=dark")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert "dark" in data["items"][0]["tags"]


@pytest.mark.asyncio
async def test_list_presets_pagination(
    async_client: AsyncClient, db_session: AsyncSession
):
    """Test pagination of preset list."""
    # Create 15 presets
    for i in range(15):
        preset = CuratedTheme(
            name=f"Preset {i}",
            category="test",
            description=f"Test preset {i}",
            config={},
            is_active=True,
        )
        db_session.add(preset)
    await db_session.commit()

    # Test first page
    response = await async_client.get("/api/v2/themes?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 10
    assert data["total"] == 15

    # Test second page
    response = await async_client.get("/api/v2/themes?skip=10&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 5
    assert data["total"] == 15


@pytest.mark.asyncio
async def test_get_preset_by_id(async_client: AsyncClient, db_session: AsyncSession):
    """Test retrieving a single preset by ID."""
    preset = CuratedTheme(
        name="Test Preset",
        category="test",
        description="Test description",
        config={"colors": {"primary": "#FF0000"}},
        tags=["test"],
        is_active=True,
    )
    db_session.add(preset)
    await db_session.commit()
    await db_session.refresh(preset)

    response = await async_client.get(f"/api/v2/themes/{preset.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == preset.id
    assert data["name"] == "Test Preset"
    assert data["category"] == "test"
    assert data["config"]["colors"]["primary"] == "#FF0000"


@pytest.mark.asyncio
async def test_get_preset_not_found(async_client: AsyncClient):
    """Test retrieving non-existent preset returns 404."""
    response = await async_client.get("/api/v2/themes/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


@pytest.mark.asyncio
async def test_create_preset(async_client: AsyncClient):
    """Test creating a new preset."""
    theme_data = {
        "name": "New Preset",
        "category": "professional",
        "description": "A brand new preset",
        "config": {"colors": {"primary": "#0000FF", "secondary": "#00FF00"}},
        "tags": ["new", "blue"],
    }

    response = await async_client.post("/api/v2/themes", json=theme_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "New Preset"
    assert data["category"] == "professional"
    assert data["config"]["colors"]["primary"] == "#0000FF"
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_create_preset_validation_error(async_client: AsyncClient):
    """Test creating preset with invalid data returns 422."""
    invalid_data = {
        "name": "",  # Empty name should fail
        "category": "test",
    }

    response = await async_client.post("/api/v2/themes", json=invalid_data)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_update_preset(async_client: AsyncClient, db_session: AsyncSession):
    """Test updating an existing preset."""
    preset = CuratedTheme(
        name="Original Name",
        category="test",
        description="Original description",
        config={},
        is_active=True,
    )
    db_session.add(preset)
    await db_session.commit()
    await db_session.refresh(preset)

    update_data = {
        "name": "Updated Name",
        "description": "Updated description",
        "config": {"colors": {"primary": "#FFFFFF"}},
    }

    response = await async_client.patch(f"/api/v2/themes/{preset.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"
    assert data["description"] == "Updated description"
    assert data["config"]["colors"]["primary"] == "#FFFFFF"


@pytest.mark.asyncio
async def test_update_preset_not_found(async_client: AsyncClient):
    """Test updating non-existent preset returns 404."""
    update_data = {"name": "Updated"}

    response = await async_client.patch("/api/v2/themes/99999", json=update_data)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_preset(async_client: AsyncClient, db_session: AsyncSession):
    """Test deleting a preset (soft delete by setting is_active=False)."""
    preset = CuratedTheme(
        name="To Delete",
        category="test",
        description="Will be deleted",
        config={},
        is_active=True,
    )
    db_session.add(preset)
    await db_session.commit()
    await db_session.refresh(preset)

    response = await async_client.delete(f"/api/v2/themes/{preset.id}")
    assert response.status_code == 204

    # Verify preset is soft-deleted (is_active=False)
    response = await async_client.get(f"/api/v2/themes/{preset.id}")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_preset_not_found(async_client: AsyncClient):
    """Test deleting non-existent preset returns 404."""
    response = await async_client.delete("/api/v2/themes/99999")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_presets_excludes_inactive(
    async_client: AsyncClient, db_session: AsyncSession
):
    """Test that inactive presets are excluded from list by default."""
    presets = [
        CuratedTheme(
            name="Active Preset",
            category="test",
            description="Active",
            config={},
            is_active=True,
        ),
        CuratedTheme(
            name="Inactive Preset",
            category="test",
            description="Inactive",
            config={},
            is_active=False,
        ),
    ]
    for preset in presets:
        db_session.add(preset)
    await db_session.commit()

    response = await async_client.get("/api/v2/themes")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["name"] == "Active Preset"
