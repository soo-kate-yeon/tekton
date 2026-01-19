"""Pydantic schemas for CuratedTheme API."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class CuratedPresetBase(BaseModel):
    """Base schema for CuratedTheme with common fields."""

    name: str = Field(..., min_length=1, max_length=255, description="Preset name")
    category: str = Field(..., min_length=1, max_length=100, description="Preset category")
    description: str | None = Field(None, description="Preset description")
    config: dict[str, Any] = Field(default_factory=dict, description="Design system configuration")
    tags: list[str] = Field(default_factory=list, description="Preset tags")


class CuratedPresetCreate(CuratedPresetBase):
    """Schema for creating a new CuratedTheme."""

    # Style archetype fields
    one_line_definition: str | None = Field(None, description="One-line style definition")
    reference_style: str | None = Field(None, description="Reference style (e.g., Notion, Nike)")
    
    # AI-only fields (stored but not exposed in response)
    principles: list[str] | None = Field(None, description="Design principles for AI")
    component_rules: dict[str, Any] | None = Field(None, description="Component-specific rules")
    forbidden_patterns: list[str] | None = Field(None, description="Patterns to avoid")


class CuratedPresetUpdate(BaseModel):
    """Schema for updating an existing CuratedTheme."""

    name: str | None = Field(None, min_length=1, max_length=255)
    category: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = None
    config: dict[str, Any] | None = None
    tags: list[str] | None = None
    is_active: bool | None = None
    one_line_definition: str | None = None
    reference_style: str | None = None
    principles: list[str] | None = None
    component_rules: dict[str, Any] | None = None
    forbidden_patterns: list[str] | None = None


class CuratedPresetResponse(CuratedPresetBase):
    """Schema for CuratedTheme response.
    
    Note: principles, component_rules, forbidden_patterns are intentionally
    excluded from the response for security (AI-only data).
    """

    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    one_line_definition: str | None = None
    reference_style: str | None = None
    created_at: datetime
    updated_at: datetime


class CuratedPresetList(BaseModel):
    """Schema for paginated list of CuratedPresets."""

    items: list[CuratedPresetResponse]
    total: int
    skip: int = 0
    limit: int = 100

