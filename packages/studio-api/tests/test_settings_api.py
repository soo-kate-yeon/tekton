"""Tests for Settings API endpoints - TDD RED-GREEN-REFACTOR cycle.

TASK-003: Implement Settings API endpoints
- Design-TAG: SPEC-MCP-001 natural language screen generation Settings API
- Function-TAG: Settings router with active preset and project settings endpoints
- Test-TAG: GET/PUT active-preset, GET project settings

Endpoints under test:
- PUT /api/v2/settings/active-preset
- GET /api/v2/settings/active-preset
- GET /api/v2/settings/project
"""

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from studio_api.models.curated_theme import CuratedTheme
from studio_api.models.project_settings import ProjectSettings


class TestGetActivePreset:
    """Test GET /api/v2/settings/active-preset endpoint."""

    @pytest.mark.asyncio
    async def test_get_active_preset_with_valid_project(
        self, async_client: AsyncClient, db_session: AsyncSession
    ) -> None:
        """Test getting active preset for a project with preset set."""
        # Create a curated preset
        preset = CuratedTheme(
            name="Test Preset",
            category="website",
            config={"test": "value"},
            description="A test preset",
        )
        db_session.add(preset)
        await db_session.commit()
        await db_session.refresh(preset)

        # Create project settings with active preset
        settings = ProjectSettings(
            project_path="/test/project",
            active_preset_id=preset.id,
            framework_type="react",
        )
        db_session.add(settings)
        await db_session.commit()

        response = await async_client.get(
            "/api/v2/settings/active-preset",
            params={"project_path": "/test/project"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["active_theme"] is not None
        assert data["active_theme"]["id"] == preset.id
        assert data["active_theme"]["name"] == "Test Preset"

    @pytest.mark.asyncio
    async def test_get_active_preset_with_no_preset_set(
        self, async_client: AsyncClient, db_session: AsyncSession
    ) -> None:
        """Test getting active preset when project has no preset set."""
        # Create project settings without active preset
        settings = ProjectSettings(
            project_path="/test/no-preset",
        )
        db_session.add(settings)
        await db_session.commit()

        response = await async_client.get(
            "/api/v2/settings/active-preset",
            params={"project_path": "/test/no-preset"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["active_theme"] is None

    @pytest.mark.asyncio
    async def test_get_active_preset_with_unknown_project(
        self, async_client: AsyncClient
    ) -> None:
        """Test getting active preset for non-existent project returns null."""
        response = await async_client.get(
            "/api/v2/settings/active-preset",
            params={"project_path": "/non/existent/project"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["active_theme"] is None

    @pytest.mark.asyncio
    async def test_get_active_preset_missing_project_path(
        self, async_client: AsyncClient
    ) -> None:
        """Test getting active preset without project_path returns 422."""
        response = await async_client.get("/api/v2/settings/active-preset")

        assert response.status_code == 422


class TestPutActivePreset:
    """Test PUT /api/v2/settings/active-preset endpoint."""

    @pytest.mark.asyncio
    async def test_set_active_preset_with_valid_preset_id(
        self, async_client: AsyncClient, db_session: AsyncSession
    ) -> None:
        """Test setting active preset with valid theme_id."""
        # Create a curated preset
        preset = CuratedTheme(
            name="New Active Preset",
            category="dashboard",
            config={"theme": "dark"},
        )
        db_session.add(preset)
        await db_session.commit()
        await db_session.refresh(preset)

        response = await async_client.put(
            "/api/v2/settings/active-preset",
            json={
                "theme_id": preset.id,
                "project_path": "/test/set-preset",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["active_theme"] is not None
        assert data["active_theme"]["id"] == preset.id
        assert data["active_theme"]["name"] == "New Active Preset"

    @pytest.mark.asyncio
    async def test_set_active_preset_updates_existing_project(
        self, async_client: AsyncClient, db_session: AsyncSession
    ) -> None:
        """Test updating active preset for existing project settings."""
        # Create two curated presets
        preset1 = CuratedTheme(
            name="First Preset",
            category="website",
            config={},
        )
        preset2 = CuratedTheme(
            name="Second Preset",
            category="dashboard",
            config={},
        )
        db_session.add(preset1)
        db_session.add(preset2)
        await db_session.commit()
        await db_session.refresh(preset1)
        await db_session.refresh(preset2)

        # Create project settings with first preset
        settings = ProjectSettings(
            project_path="/test/update-preset",
            active_preset_id=preset1.id,
        )
        db_session.add(settings)
        await db_session.commit()

        # Update to second preset
        response = await async_client.put(
            "/api/v2/settings/active-preset",
            json={
                "theme_id": preset2.id,
                "project_path": "/test/update-preset",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["active_theme"]["id"] == preset2.id
        assert data["active_theme"]["name"] == "Second Preset"

    @pytest.mark.asyncio
    async def test_set_active_preset_with_invalid_preset_id(
        self, async_client: AsyncClient
    ) -> None:
        """Test setting active preset with non-existent theme_id returns error."""
        response = await async_client.put(
            "/api/v2/settings/active-preset",
            json={
                "theme_id": 99999,
                "project_path": "/test/invalid-preset",
            },
        )

        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()

    @pytest.mark.asyncio
    async def test_set_active_preset_with_inactive_preset(
        self, async_client: AsyncClient, db_session: AsyncSession
    ) -> None:
        """Test setting active preset with inactive preset returns error."""
        # Create an inactive preset
        preset = CuratedTheme(
            name="Inactive Preset",
            category="website",
            config={},
            is_active=False,
        )
        db_session.add(preset)
        await db_session.commit()
        await db_session.refresh(preset)

        response = await async_client.put(
            "/api/v2/settings/active-preset",
            json={
                "theme_id": preset.id,
                "project_path": "/test/inactive-preset",
            },
        )

        assert response.status_code == 404
        data = response.json()
        assert "not found" in data["detail"].lower()

    @pytest.mark.asyncio
    async def test_set_active_preset_missing_fields(
        self, async_client: AsyncClient
    ) -> None:
        """Test setting active preset with missing required fields returns 422."""
        # Missing project_path
        response = await async_client.put(
            "/api/v2/settings/active-preset",
            json={"theme_id": 1},
        )
        assert response.status_code == 422

        # Missing theme_id
        response = await async_client.put(
            "/api/v2/settings/active-preset",
            json={"project_path": "/test/project"},
        )
        assert response.status_code == 422


class TestGetProjectSettings:
    """Test GET /api/v2/settings/project endpoint."""

    @pytest.mark.asyncio
    async def test_get_project_settings_existing_project(
        self, async_client: AsyncClient, db_session: AsyncSession
    ) -> None:
        """Test getting project settings for existing project."""
        # Create a curated preset
        preset = CuratedTheme(
            name="Settings Test Preset",
            category="website",
            config={"color": "blue"},
        )
        db_session.add(preset)
        await db_session.commit()
        await db_session.refresh(preset)

        # Create project settings
        settings = ProjectSettings(
            project_path="/test/project-settings",
            active_preset_id=preset.id,
            framework_type="nextjs",
        )
        db_session.add(settings)
        await db_session.commit()

        response = await async_client.get(
            "/api/v2/settings/project",
            params={"project_path": "/test/project-settings"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["settings"] is not None
        assert data["settings"]["project_path"] == "/test/project-settings"
        assert data["settings"]["framework_type"] == "nextjs"
        assert data["settings"]["active_preset_id"] == preset.id
        assert data["settings"]["active_theme"] is not None
        assert data["settings"]["active_theme"]["name"] == "Settings Test Preset"

    @pytest.mark.asyncio
    async def test_get_project_settings_nonexistent_project(
        self, async_client: AsyncClient
    ) -> None:
        """Test getting project settings for non-existent project returns null settings."""
        response = await async_client.get(
            "/api/v2/settings/project",
            params={"project_path": "/non/existent/path"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["settings"] is None

    @pytest.mark.asyncio
    async def test_get_project_settings_without_preset(
        self, async_client: AsyncClient, db_session: AsyncSession
    ) -> None:
        """Test getting project settings for project without active preset."""
        # Create project settings without preset
        settings = ProjectSettings(
            project_path="/test/no-preset-settings",
            framework_type="vite",
        )
        db_session.add(settings)
        await db_session.commit()

        response = await async_client.get(
            "/api/v2/settings/project",
            params={"project_path": "/test/no-preset-settings"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["settings"] is not None
        assert data["settings"]["project_path"] == "/test/no-preset-settings"
        assert data["settings"]["framework_type"] == "vite"
        assert data["settings"]["active_preset_id"] is None
        assert data["settings"]["active_theme"] is None

    @pytest.mark.asyncio
    async def test_get_project_settings_missing_project_path(
        self, async_client: AsyncClient
    ) -> None:
        """Test getting project settings without project_path returns 422."""
        response = await async_client.get("/api/v2/settings/project")

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_get_project_settings_includes_timestamps(
        self, async_client: AsyncClient, db_session: AsyncSession
    ) -> None:
        """Test that project settings response includes timestamps."""
        settings = ProjectSettings(
            project_path="/test/timestamps",
        )
        db_session.add(settings)
        await db_session.commit()

        response = await async_client.get(
            "/api/v2/settings/project",
            params={"project_path": "/test/timestamps"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["settings"]["created_at"] is not None
        assert data["settings"]["updated_at"] is not None
