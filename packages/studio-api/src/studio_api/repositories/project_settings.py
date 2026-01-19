"""Repository for ProjectSettings database operations.

Design-TAG: SPEC-MCP-001 natural language screen generation database infrastructure
Function-TAG: ProjectSettings repository with async CRUD operations for active preset management
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from studio_api.models.curated_theme import CuratedTheme
from studio_api.models.project_settings import ProjectSettings


class ProjectSettingsRepository:
    """Repository for managing ProjectSettings database operations."""

    def __init__(self, session: AsyncSession):
        """Initialize repository with database session."""
        self.session = session

    async def get_by_project_path(self, project_path: str) -> ProjectSettings | None:
        """Get project settings by project path.

        Args:
            project_path: The path to the project directory.

        Returns:
            The project settings if found, None otherwise.
        """
        result = await self.session.execute(
            select(ProjectSettings)
            .options(selectinload(ProjectSettings.active_theme))
            .where(ProjectSettings.project_path == project_path)
        )
        return result.scalar_one_or_none()

    async def get_or_create(self, project_path: str) -> ProjectSettings:
        """Get existing project settings or create new one.

        Args:
            project_path: The path to the project directory.

        Returns:
            The existing or newly created project settings.
        """
        settings = await self.get_by_project_path(project_path)
        if settings is None:
            settings = ProjectSettings(project_path=project_path)
            self.session.add(settings)
            await self.session.commit()
            await self.session.refresh(settings)
        return settings

    async def set_active_preset(
        self, project_path: str, theme_id: int
    ) -> ProjectSettings:
        """Set the active preset for a project.

        Args:
            project_path: The path to the project directory.
            theme_id: The ID of the preset to set as active.

        Returns:
            The updated project settings.
        """
        settings = await self.get_or_create(project_path)
        settings.active_preset_id = theme_id
        await self.session.commit()
        await self.session.refresh(settings)
        # Load the relationship
        result = await self.session.execute(
            select(ProjectSettings)
            .options(selectinload(ProjectSettings.active_theme))
            .where(ProjectSettings.id == settings.id)
        )
        return result.scalar_one()

    async def get_active_preset(self, project_path: str) -> CuratedTheme | None:
        """Get the active preset for a project.

        Args:
            project_path: The path to the project directory.

        Returns:
            The active preset if set and exists, None otherwise.
        """
        settings = await self.get_by_project_path(project_path)
        if settings is None or settings.active_preset_id is None:
            return None
        return settings.active_theme

    async def update_framework_type(
        self, project_path: str, framework_type: str
    ) -> ProjectSettings:
        """Update the detected framework type for a project.

        Args:
            project_path: The path to the project directory.
            framework_type: The detected framework type.

        Returns:
            The updated project settings.
        """
        from datetime import datetime, timezone

        settings = await self.get_or_create(project_path)
        settings.framework_type = framework_type
        settings.detected_at = datetime.now(timezone.utc)
        await self.session.commit()
        await self.session.refresh(settings)
        return settings
