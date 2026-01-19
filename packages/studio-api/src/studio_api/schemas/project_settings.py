"""Pydantic schemas for ProjectSettings API.

Design-TAG: SPEC-MCP-001 natural language screen generation Settings API
Function-TAG: Request/response schemas for active preset and project settings endpoints
"""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from studio_api.schemas.curated_theme import CuratedPresetResponse


class SetActivePresetRequest(BaseModel):
    """Request body for setting active preset.

    PUT /api/v2/settings/active-preset
    """

    theme_id: int = Field(..., description="ID of the preset to set as active")
    project_path: str = Field(
        ..., min_length=1, max_length=1024, description="Path to the project directory"
    )


class ActivePresetResponse(BaseModel):
    """Response for active preset endpoints."""

    success: bool = Field(..., description="Whether the operation succeeded")
    active_theme: CuratedPresetResponse | None = Field(
        None, description="The active preset, or null if none set"
    )


class ProjectSettingsResponse(BaseModel):
    """Response schema for project settings.

    GET /api/v2/settings/project
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    project_path: str
    active_preset_id: int | None = None
    framework_type: str | None = None
    detected_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    active_theme: CuratedPresetResponse | None = None


class ProjectSettingsSuccessResponse(BaseModel):
    """Response wrapper for project settings endpoint."""

    success: bool = Field(..., description="Whether the operation succeeded")
    settings: ProjectSettingsResponse | None = Field(
        None, description="The project settings, or null if not found"
    )
