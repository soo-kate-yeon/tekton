"""Pydantic schemas for Project API.

Design-TAG: SPEC-STUDIO-WEB-001 Framer-style workspace/project structure
Function-TAG: Request/response schemas for project CRUD operations
"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from studio_api.schemas.curated_theme import CuratedPresetResponse


# --- LayoutBreakpoint Schemas ---

class LayoutBreakpointBase(BaseModel):
    """Base schema for layout breakpoint."""

    name: str = Field(..., min_length=1, max_length=50, description="Breakpoint name (mobile, tablet, desktop)")
    min_width: int = Field(..., ge=0, description="Minimum width in pixels")
    max_width: int | None = Field(None, description="Maximum width in pixels (null for largest breakpoint)")
    config: dict[str, Any] = Field(default_factory=dict, description="Layout configuration (margin, columns, etc.)")
    display_order: int = Field(0, description="Display order")


class LayoutBreakpointCreate(LayoutBreakpointBase):
    """Schema for creating a layout breakpoint."""
    pass


class LayoutBreakpointUpdate(BaseModel):
    """Schema for updating a layout breakpoint."""

    name: str | None = Field(None, min_length=1, max_length=50)
    min_width: int | None = Field(None, ge=0)
    max_width: int | None = None
    config: dict[str, Any] | None = None
    display_order: int | None = None


class LayoutBreakpointResponse(LayoutBreakpointBase):
    """Schema for layout breakpoint response."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime


# --- Project Schemas ---

class ProjectBase(BaseModel):
    """Base schema for project."""

    name: str = Field(..., min_length=1, max_length=255, description="Project name")
    description: str | None = Field(None, description="Project description")


class ProjectCreate(ProjectBase):
    """Schema for creating a new project."""

    active_template_id: int | None = Field(None, description="ID of the active template (CuratedTheme)")
    token_config: dict[str, Any] = Field(default_factory=dict, description="Token configuration")
    settings: dict[str, Any] = Field(default_factory=dict, description="Project settings")


class ProjectUpdate(BaseModel):
    """Schema for updating an existing project."""

    name: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    thumbnail_url: str | None = None
    active_template_id: int | None = None
    token_config: dict[str, Any] | None = None
    settings: dict[str, Any] | None = None
    is_archived: bool | None = None


class ProjectResponse(ProjectBase):
    """Schema for project response."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    thumbnail_url: str | None = None
    active_template_id: int | None = None
    token_config: dict[str, Any]
    settings: dict[str, Any]
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    # Nested relationships
    active_template: CuratedPresetResponse | None = None
    breakpoints: list[LayoutBreakpointResponse] = Field(default_factory=list)


class ProjectListResponse(BaseModel):
    """Schema for paginated list of projects."""

    items: list[ProjectResponse]
    total: int
    skip: int = 0
    limit: int = 100


class ProjectSummary(BaseModel):
    """Lightweight project summary for workspace grid."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None = None
    thumbnail_url: str | None = None
    is_archived: bool
    updated_at: datetime
