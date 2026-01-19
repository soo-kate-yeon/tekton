"""Tests for ProjectSettings repository - additional coverage.

Design-TAG: SPEC-MCP-001 natural language screen generation database infrastructure
Function-TAG: ProjectSettings repository async CRUD operations
Test-TAG: Repository methods get_or_create, set_active_preset, update_framework_type
"""

from datetime import datetime, timezone

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from studio_api.models.curated_theme import CuratedTheme
from studio_api.models.project_settings import ProjectSettings
from studio_api.repositories.project_settings import ProjectSettingsRepository


class TestProjectSettingsRepositoryGetOrCreate:
    """Test get_or_create method."""

    @pytest.mark.asyncio
    async def test_get_or_create_creates_new(self, db_session: AsyncSession) -> None:
        """Test that get_or_create creates a new entry if not exists."""
        repository = ProjectSettingsRepository(db_session)

        settings = await repository.get_or_create("/new/project/path")

        assert settings is not None
        assert settings.id is not None
        assert settings.project_path == "/new/project/path"
        assert settings.active_preset_id is None

    @pytest.mark.asyncio
    async def test_get_or_create_returns_existing(self, db_session: AsyncSession) -> None:
        """Test that get_or_create returns existing entry if exists."""
        # Create existing settings
        existing = ProjectSettings(
            project_path="/existing/project",
            framework_type="vue",
        )
        db_session.add(existing)
        await db_session.commit()
        await db_session.refresh(existing)
        existing_id = existing.id

        repository = ProjectSettingsRepository(db_session)
        settings = await repository.get_or_create("/existing/project")

        assert settings.id == existing_id
        assert settings.framework_type == "vue"


class TestProjectSettingsRepositorySetActivePreset:
    """Test set_active_preset method."""

    @pytest.mark.asyncio
    async def test_set_active_preset_creates_settings(
        self, db_session: AsyncSession
    ) -> None:
        """Test that set_active_preset creates settings if not exists."""
        # Create a preset
        preset = CuratedTheme(
            name="Test Preset",
            category="website",
            config={},
        )
        db_session.add(preset)
        await db_session.commit()
        await db_session.refresh(preset)

        repository = ProjectSettingsRepository(db_session)
        settings = await repository.set_active_preset(
            "/auto-created/project", preset.id
        )

        assert settings is not None
        assert settings.project_path == "/auto-created/project"
        assert settings.active_preset_id == preset.id
        assert settings.active_theme is not None
        assert settings.active_theme.name == "Test Preset"

    @pytest.mark.asyncio
    async def test_set_active_preset_updates_existing(
        self, db_session: AsyncSession
    ) -> None:
        """Test that set_active_preset updates existing settings."""
        # Create presets
        preset1 = CuratedTheme(name="First", category="web", config={})
        preset2 = CuratedTheme(name="Second", category="app", config={})
        db_session.add(preset1)
        db_session.add(preset2)
        await db_session.commit()
        await db_session.refresh(preset1)
        await db_session.refresh(preset2)

        # Create existing settings with preset1
        existing = ProjectSettings(
            project_path="/update/preset/project",
            active_preset_id=preset1.id,
        )
        db_session.add(existing)
        await db_session.commit()

        repository = ProjectSettingsRepository(db_session)
        settings = await repository.set_active_preset(
            "/update/preset/project", preset2.id
        )

        assert settings.active_preset_id == preset2.id
        assert settings.active_theme.name == "Second"


class TestProjectSettingsRepositoryGetActivePreset:
    """Test get_active_preset method."""

    @pytest.mark.asyncio
    async def test_get_active_preset_returns_preset(
        self, db_session: AsyncSession
    ) -> None:
        """Test getting active preset when one is set."""
        preset = CuratedTheme(
            name="Active Preset",
            category="dashboard",
            config={"theme": "dark"},
        )
        db_session.add(preset)
        await db_session.commit()
        await db_session.refresh(preset)

        settings = ProjectSettings(
            project_path="/with/active/preset",
            active_preset_id=preset.id,
        )
        db_session.add(settings)
        await db_session.commit()

        repository = ProjectSettingsRepository(db_session)
        active_theme = await repository.get_active_preset("/with/active/preset")

        assert active_theme is not None
        assert active_theme.id == preset.id
        assert active_theme.name == "Active Preset"

    @pytest.mark.asyncio
    async def test_get_active_preset_returns_none_no_settings(
        self, db_session: AsyncSession
    ) -> None:
        """Test getting active preset when no settings exist."""
        repository = ProjectSettingsRepository(db_session)
        active_theme = await repository.get_active_preset("/nonexistent/project")

        assert active_theme is None

    @pytest.mark.asyncio
    async def test_get_active_preset_returns_none_no_preset_set(
        self, db_session: AsyncSession
    ) -> None:
        """Test getting active preset when settings exist but no preset set."""
        settings = ProjectSettings(project_path="/no/preset/set")
        db_session.add(settings)
        await db_session.commit()

        repository = ProjectSettingsRepository(db_session)
        active_theme = await repository.get_active_preset("/no/preset/set")

        assert active_theme is None


class TestProjectSettingsRepositoryUpdateFrameworkType:
    """Test update_framework_type method."""

    @pytest.mark.asyncio
    async def test_update_framework_type_creates_settings(
        self, db_session: AsyncSession
    ) -> None:
        """Test that update_framework_type creates settings if not exists."""
        repository = ProjectSettingsRepository(db_session)

        settings = await repository.update_framework_type(
            "/detect/new/project", "nextjs"
        )

        assert settings is not None
        assert settings.project_path == "/detect/new/project"
        assert settings.framework_type == "nextjs"
        assert settings.detected_at is not None

    @pytest.mark.asyncio
    async def test_update_framework_type_updates_existing(
        self, db_session: AsyncSession
    ) -> None:
        """Test that update_framework_type updates existing settings."""
        # Create existing settings
        existing = ProjectSettings(
            project_path="/detect/existing/project",
            framework_type="react",
        )
        db_session.add(existing)
        await db_session.commit()

        repository = ProjectSettingsRepository(db_session)
        settings = await repository.update_framework_type(
            "/detect/existing/project", "vue"
        )

        assert settings.framework_type == "vue"
        assert settings.detected_at is not None

    @pytest.mark.asyncio
    async def test_update_framework_type_sets_detected_at(
        self, db_session: AsyncSession
    ) -> None:
        """Test that update_framework_type sets detected_at timestamp."""
        before_update = datetime.now(timezone.utc)

        repository = ProjectSettingsRepository(db_session)
        settings = await repository.update_framework_type(
            "/timestamp/test", "vite"
        )

        after_update = datetime.now(timezone.utc)

        assert settings.detected_at is not None
        # Handle timezone-naive datetime from SQLite
        detected_at = settings.detected_at
        if detected_at.tzinfo is None:
            detected_at = detected_at.replace(tzinfo=timezone.utc)

        assert before_update <= detected_at <= after_update


class TestProjectSettingsRepositoryGetByProjectPath:
    """Test get_by_project_path method."""

    @pytest.mark.asyncio
    async def test_get_by_project_path_with_preset(
        self, db_session: AsyncSession
    ) -> None:
        """Test getting settings with eager-loaded preset."""
        preset = CuratedTheme(
            name="Eager Load Preset",
            category="web",
            config={},
        )
        db_session.add(preset)
        await db_session.commit()
        await db_session.refresh(preset)

        settings = ProjectSettings(
            project_path="/eager/load/project",
            active_preset_id=preset.id,
            framework_type="react",
        )
        db_session.add(settings)
        await db_session.commit()

        repository = ProjectSettingsRepository(db_session)
        loaded = await repository.get_by_project_path("/eager/load/project")

        assert loaded is not None
        assert loaded.active_theme is not None
        assert loaded.active_theme.name == "Eager Load Preset"

    @pytest.mark.asyncio
    async def test_get_by_project_path_not_found(
        self, db_session: AsyncSession
    ) -> None:
        """Test getting settings for non-existent project."""
        repository = ProjectSettingsRepository(db_session)
        settings = await repository.get_by_project_path("/does/not/exist")

        assert settings is None
