"""API v2 routes for projects.

Design-TAG: SPEC-STUDIO-WEB-001 Framer-style workspace/project structure
Function-TAG: RESTful API for project CRUD and breakpoint management
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from studio_api.core.database import get_db
from studio_api.repositories.project import ProjectRepository
from studio_api.schemas.project import (
    LayoutBreakpointCreate,
    LayoutBreakpointResponse,
    LayoutBreakpointUpdate,
    ProjectCreate,
    ProjectListResponse,
    ProjectResponse,
    ProjectUpdate,
)

router = APIRouter(prefix="/api/v2/projects", tags=["projects"])


@router.get("", response_model=ProjectListResponse)
async def list_projects(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of items to return"),
    include_archived: bool = Query(False, description="Include archived projects"),
    db: AsyncSession = Depends(get_db),
) -> ProjectListResponse:
    """
    List all projects with optional pagination.

    Parameters:
    - skip: Number of items to skip (for pagination)
    - limit: Maximum number of items to return
    - include_archived: Whether to include archived projects
    """
    repository = ProjectRepository(db)
    items, total = await repository.list(
        skip=skip, limit=limit, include_archived=include_archived
    )

    return ProjectListResponse(items=items, total=total, skip=skip, limit=limit)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    """
    Get a single project by ID.

    Raises:
    - 404: Project not found or archived
    """
    repository = ProjectRepository(db)
    project = await repository.get_by_id(project_id)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found",
        )

    return ProjectResponse.model_validate(project)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    """
    Create a new project with default breakpoints.

    Default breakpoints:
    - Mobile: 0-389px
    - Tablet: 390-809px
    - Desktop: 810px+

    Returns:
    - The created project with generated ID, timestamps, and breakpoints
    """
    repository = ProjectRepository(db)
    project = await repository.create(project_data)

    return ProjectResponse.model_validate(project)


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
) -> ProjectResponse:
    """
    Update an existing project.

    Only provided fields will be updated.

    Raises:
    - 404: Project not found
    """
    repository = ProjectRepository(db)
    project = await repository.update(project_id, project_data)

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found",
        )

    return ProjectResponse.model_validate(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    hard_delete: bool = Query(False, description="Permanently delete the project"),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a project (soft delete by default).

    Parameters:
    - hard_delete: If True, permanently delete the project and all its data

    Raises:
    - 404: Project not found
    """
    repository = ProjectRepository(db)
    deleted = await repository.delete(project_id, hard_delete=hard_delete)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found",
        )


# --- Breakpoint Endpoints ---


@router.patch(
    "/{project_id}/breakpoints/{breakpoint_id}",
    response_model=LayoutBreakpointResponse,
)
async def update_breakpoint(
    project_id: int,
    breakpoint_id: int,
    breakpoint_data: LayoutBreakpointUpdate,
    db: AsyncSession = Depends(get_db),
) -> LayoutBreakpointResponse:
    """
    Update a breakpoint configuration.

    Use this to set layout settings (margin, columns, etc.) for each breakpoint.
    """
    repository = ProjectRepository(db)
    
    # Verify project exists
    project = await repository.get_by_id(project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found",
        )

    # Verify breakpoint belongs to project
    breakpoint = await repository.get_breakpoint(breakpoint_id)
    if not breakpoint or breakpoint.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Breakpoint with id {breakpoint_id} not found in project {project_id}",
        )

    updated = await repository.update_breakpoint(breakpoint_id, breakpoint_data)
    return LayoutBreakpointResponse.model_validate(updated)


@router.post(
    "/{project_id}/breakpoints",
    response_model=LayoutBreakpointResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_breakpoint(
    project_id: int,
    breakpoint_data: LayoutBreakpointCreate,
    db: AsyncSession = Depends(get_db),
) -> LayoutBreakpointResponse:
    """
    Add a custom breakpoint to a project.
    """
    repository = ProjectRepository(db)
    breakpoint = await repository.add_breakpoint(project_id, breakpoint_data)

    if not breakpoint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with id {project_id} not found",
        )

    return LayoutBreakpointResponse.model_validate(breakpoint)


@router.delete(
    "/{project_id}/breakpoints/{breakpoint_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_breakpoint(
    project_id: int,
    breakpoint_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a breakpoint from a project.
    """
    repository = ProjectRepository(db)
    
    # Verify breakpoint belongs to project
    breakpoint = await repository.get_breakpoint(breakpoint_id)
    if not breakpoint or breakpoint.project_id != project_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Breakpoint with id {breakpoint_id} not found in project {project_id}",
        )

    await repository.delete_breakpoint(breakpoint_id)
