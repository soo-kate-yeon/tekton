"""API v2 routes for project settings.

Design-TAG: SPEC-MCP-001 natural language screen generation Settings API
Function-TAG: Settings router with active preset and project settings endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from studio_api.core.database import get_db
from studio_api.repositories.curated_theme import CuratedPresetRepository
from studio_api.repositories.project_settings import ProjectSettingsRepository
from studio_api.schemas.curated_theme import CuratedPresetResponse
from studio_api.schemas.project_settings import (
    ActivePresetResponse,
    ProjectSettingsResponse,
    ProjectSettingsSuccessResponse,
    SetActivePresetRequest,
)

router = APIRouter(prefix="/api/v2/settings", tags=["settings"])


@router.get("/active-preset", response_model=ActivePresetResponse)
async def get_active_preset(
    project_path: str = Query(..., description="Path to the project directory"),
    db: AsyncSession = Depends(get_db),
) -> ActivePresetResponse:
    """Get the currently active preset for a project.

    Returns the active preset if set, or null if no preset is configured
    for the specified project.

    Parameters:
    - project_path: Path to the project directory (required)

    Returns:
    - success: Always true for this endpoint
    - active_theme: The active preset or null
    """
    repository = ProjectSettingsRepository(db)
    preset = await repository.get_active_preset(project_path)

    if preset is None:
        return ActivePresetResponse(success=True, active_theme=None)

    return ActivePresetResponse(
        success=True,
        active_theme=CuratedPresetResponse.model_validate(preset),
    )


@router.put("/active-preset", response_model=ActivePresetResponse)
async def set_active_preset(
    request: SetActivePresetRequest,
    db: AsyncSession = Depends(get_db),
) -> ActivePresetResponse:
    """Set the active preset for a project.

    Creates project settings if they don't exist, then sets the active preset.

    Parameters:
    - theme_id: ID of the preset to set as active
    - project_path: Path to the project directory

    Returns:
    - success: True if the operation succeeded
    - active_theme: The newly active preset

    Raises:
    - 404: Preset not found or inactive
    """
    # Verify preset exists and is active
    preset_repository = CuratedPresetRepository(db)
    preset = await preset_repository.get_by_id(request.theme_id)

    if preset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Preset with id {request.theme_id} not found or inactive",
        )

    # Set the active preset
    settings_repository = ProjectSettingsRepository(db)
    await settings_repository.set_active_preset(request.project_path, request.theme_id)

    return ActivePresetResponse(
        success=True,
        active_theme=CuratedPresetResponse.model_validate(preset),
    )


@router.get("/project", response_model=ProjectSettingsSuccessResponse)
async def get_project_settings(
    project_path: str = Query(..., description="Path to the project directory"),
    db: AsyncSession = Depends(get_db),
) -> ProjectSettingsSuccessResponse:
    """Get project settings for a specific project.

    Returns the full project settings including active preset, framework type,
    and timestamps.

    Parameters:
    - project_path: Path to the project directory (required)

    Returns:
    - success: Always true for this endpoint
    - settings: The project settings or null if not found
    """
    repository = ProjectSettingsRepository(db)
    settings = await repository.get_by_project_path(project_path)

    if settings is None:
        return ProjectSettingsSuccessResponse(success=True, settings=None)

    # Build response with nested preset
    settings_response = ProjectSettingsResponse.model_validate(settings)
    if settings.active_theme:
        settings_response.active_theme = CuratedPresetResponse.model_validate(
            settings.active_theme
        )

    return ProjectSettingsSuccessResponse(success=True, settings=settings_response)
