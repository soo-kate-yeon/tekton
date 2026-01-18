"""Repository for Project database operations.

Design-TAG: SPEC-STUDIO-WEB-001 Framer-style workspace/project structure
Function-TAG: Repository for project CRUD operations with breakpoint management
"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from studio_api.models.project import LayoutBreakpoint, Project
from studio_api.schemas.project import (
    LayoutBreakpointCreate,
    LayoutBreakpointUpdate,
    ProjectCreate,
    ProjectUpdate,
)


# Default breakpoints configuration
DEFAULT_BREAKPOINTS = [
    {"name": "mobile", "min_width": 0, "max_width": 389, "display_order": 0},
    {"name": "tablet", "min_width": 390, "max_width": 809, "display_order": 1},
    {"name": "desktop", "min_width": 810, "max_width": None, "display_order": 2},
]


class ProjectRepository:
    """Repository for managing Project database operations."""

    def __init__(self, session: AsyncSession):
        """Initialize repository with database session."""
        self.session = session

    async def get_by_id(self, project_id: int, include_archived: bool = False) -> Project | None:
        """
        Get a project by ID with all relationships loaded.

        Args:
            project_id: The ID of the project to retrieve.
            include_archived: Whether to include archived projects.

        Returns:
            The project if found, None otherwise.
        """
        query = (
            select(Project)
            .options(
                selectinload(Project.active_template),
                selectinload(Project.breakpoints),
            )
            .where(Project.id == project_id)
        )
        
        if not include_archived:
            query = query.where(Project.is_archived == False)  # noqa: E712
        
        result = await self.session.execute(query)
        return result.scalar_one_or_none()

    async def list(
        self,
        skip: int = 0,
        limit: int = 100,
        include_archived: bool = False,
    ) -> tuple[list[Project], int]:
        """
        List projects with optional filtering and pagination.

        Args:
            skip: Number of items to skip for pagination.
            limit: Maximum number of items to return.
            include_archived: Whether to include archived projects.

        Returns:
            Tuple of (list of projects, total count).
        """
        # Build base query
        query = (
            select(Project)
            .options(
                selectinload(Project.active_template),
                selectinload(Project.breakpoints),
            )
            .order_by(Project.updated_at.desc())
        )
        
        if not include_archived:
            query = query.where(Project.is_archived == False)  # noqa: E712

        # Get all matching projects
        result = await self.session.execute(query)
        all_items = list(result.scalars().all())

        # Calculate total and apply pagination
        total = len(all_items)
        items = all_items[skip : skip + limit]

        return items, total

    async def create(self, project_data: ProjectCreate) -> Project:
        """
        Create a new project with default breakpoints.

        Args:
            project_data: The project data to create.

        Returns:
            The created project with generated ID, timestamps, and default breakpoints.
        """
        # Create project
        project = Project(**project_data.model_dump())
        self.session.add(project)
        await self.session.flush()  # Get the project ID

        # Create default breakpoints
        for bp_config in DEFAULT_BREAKPOINTS:
            breakpoint = LayoutBreakpoint(
                project_id=project.id,
                name=bp_config["name"],
                min_width=bp_config["min_width"],
                max_width=bp_config["max_width"],
                display_order=bp_config["display_order"],
                config={},
            )
            self.session.add(breakpoint)

        await self.session.commit()
        await self.session.refresh(project)
        
        # Reload with relationships
        return await self.get_by_id(project.id)  # type: ignore

    async def update(self, project_id: int, project_data: ProjectUpdate) -> Project | None:
        """
        Update an existing project.

        Args:
            project_id: The ID of the project to update.
            project_data: The update data (only provided fields will be updated).

        Returns:
            The updated project if found, None otherwise.
        """
        project = await self.get_by_id(project_id)
        if not project:
            return None

        # Update only provided fields
        update_dict = project_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(project, field, value)

        await self.session.commit()
        await self.session.refresh(project)
        return project

    async def delete(self, project_id: int, hard_delete: bool = False) -> bool:
        """
        Delete a project (soft delete by default).

        Args:
            project_id: The ID of the project to delete.
            hard_delete: If True, permanently delete the project.

        Returns:
            True if project was found and deleted, False otherwise.
        """
        project = await self.get_by_id(project_id, include_archived=True)
        if not project:
            return False

        if hard_delete:
            await self.session.delete(project)
        else:
            project.is_archived = True

        await self.session.commit()
        return True

    # --- Breakpoint Operations ---

    async def get_breakpoint(self, breakpoint_id: int) -> LayoutBreakpoint | None:
        """Get a single breakpoint by ID."""
        result = await self.session.execute(
            select(LayoutBreakpoint).where(LayoutBreakpoint.id == breakpoint_id)
        )
        return result.scalar_one_or_none()

    async def update_breakpoint(
        self, breakpoint_id: int, breakpoint_data: LayoutBreakpointUpdate
    ) -> LayoutBreakpoint | None:
        """Update a breakpoint configuration."""
        breakpoint = await self.get_breakpoint(breakpoint_id)
        if not breakpoint:
            return None

        update_dict = breakpoint_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(breakpoint, field, value)

        await self.session.commit()
        await self.session.refresh(breakpoint)
        return breakpoint

    async def add_breakpoint(
        self, project_id: int, breakpoint_data: LayoutBreakpointCreate
    ) -> LayoutBreakpoint | None:
        """Add a new breakpoint to a project."""
        project = await self.get_by_id(project_id)
        if not project:
            return None

        breakpoint = LayoutBreakpoint(
            project_id=project_id,
            **breakpoint_data.model_dump(),
        )
        self.session.add(breakpoint)
        await self.session.commit()
        await self.session.refresh(breakpoint)
        return breakpoint

    async def delete_breakpoint(self, breakpoint_id: int) -> bool:
        """Delete a breakpoint."""
        breakpoint = await self.get_breakpoint(breakpoint_id)
        if not breakpoint:
            return False

        await self.session.delete(breakpoint)
        await self.session.commit()
        return True
