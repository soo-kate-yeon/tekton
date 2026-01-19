"""API schemas package."""

from studio_api.schemas.curated_theme import (
    CuratedPresetBase,
    CuratedPresetCreate,
    CuratedPresetList,
    CuratedPresetResponse,
    CuratedPresetUpdate,
)
from studio_api.schemas.project import (
    LayoutBreakpointCreate,
    LayoutBreakpointResponse,
    LayoutBreakpointUpdate,
    ProjectCreate,
    ProjectListResponse,
    ProjectResponse,
    ProjectSummary,
    ProjectUpdate,
)
from studio_api.schemas.project_settings import (
    ActivePresetResponse,
    ProjectSettingsResponse,
    ProjectSettingsSuccessResponse,
    SetActivePresetRequest,
)

__all__ = [
    "CuratedPresetBase",
    "CuratedPresetCreate",
    "CuratedPresetUpdate",
    "CuratedPresetResponse",
    "CuratedPresetList",
    "LayoutBreakpointCreate",
    "LayoutBreakpointResponse",
    "LayoutBreakpointUpdate",
    "ProjectCreate",
    "ProjectListResponse",
    "ProjectResponse",
    "ProjectSummary",
    "ProjectUpdate",
    "SetActivePresetRequest",
    "ActivePresetResponse",
    "ProjectSettingsResponse",
    "ProjectSettingsSuccessResponse",
]
