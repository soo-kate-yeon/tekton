"""Pydantic schemas for CuratedPreset API."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class CuratedPresetBase(BaseModel):
    """Base schema for CuratedPreset with common fields."""

    name: str = Field(..., min_length=1, max_length=255, description="Preset name")
    category: str = Field(..., min_length=1, max_length=100, description="Preset category")
    description: str | None = Field(None, description="Preset description")
    config: dict[str, Any] = Field(default_factory=dict, description="Design system configuration")
    tags: list[str] = Field(default_factory=list, description="Preset tags")


class CuratedPresetCreate(CuratedPresetBase):
    """Schema for creating a new CuratedPreset."""

    pass


class CuratedPresetUpdate(BaseModel):
    """Schema for updating an existing CuratedPreset."""

    name: str | None = Field(None, min_length=1, max_length=255)
    category: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = None
    config: dict[str, Any] | None = None
    tags: list[str] | None = None
    is_active: bool | None = None


class CuratedPresetResponse(CuratedPresetBase):
    """Schema for CuratedPreset response."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime


class CuratedPresetList(BaseModel):
    """Schema for paginated list of CuratedPresets."""

    items: list[CuratedPresetResponse]
    total: int
    skip: int = 0
    limit: int = 100
