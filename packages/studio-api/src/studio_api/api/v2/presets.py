"""API v2 routes for curated presets."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from studio_api.core.database import get_db
from studio_api.repositories.curated_preset import CuratedPresetRepository
from studio_api.schemas.curated_preset import (
    CuratedPresetCreate,
    CuratedPresetList,
    CuratedPresetResponse,
    CuratedPresetUpdate,
)
from studio_api.services.mcp_client import MCPClient

router = APIRouter(prefix="/api/v2/presets", tags=["presets"])


@router.get("/suggestions", response_model=list[CuratedPresetResponse])
async def get_preset_suggestions(
    context: str | None = Query(None, description="Optional context for suggestions"),
) -> list[CuratedPresetResponse]:
    """
    Get intelligent preset suggestions from MCP server.

    Falls back to default presets if MCP server unavailable.

    Parameters:
    - context: Optional context string to guide suggestions

    Returns:
    - List of suggested presets
    """
    try:
        async with MCPClient() as mcp_client:
            suggestions = await mcp_client.get_suggestions(context=context)
    except Exception:
        # Fallback to default presets on any error
        async with MCPClient() as mcp_client:
            suggestions = await mcp_client.get_default_presets()

    # Convert to response models
    return [CuratedPresetResponse.model_validate(preset) for preset in suggestions]


@router.get("", response_model=CuratedPresetList)
async def list_presets(
    skip: int = Query(0, ge=0, description="Number of items to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of items to return"),
    category: str | None = Query(None, description="Filter by category"),
    tags: str | None = Query(None, description="Filter by tag"),
    db: AsyncSession = Depends(get_db),
) -> CuratedPresetList:
    """
    List all active curated presets with optional filtering and pagination.

    Parameters:
    - skip: Number of items to skip (for pagination)
    - limit: Maximum number of items to return
    - category: Optional category filter
    - tags: Optional tag filter
    """
    repository = CuratedPresetRepository(db)
    items, total = await repository.list(
        skip=skip, limit=limit, category=category, tags=tags
    )

    return CuratedPresetList(items=items, total=total, skip=skip, limit=limit)


@router.get("/{preset_id}", response_model=CuratedPresetResponse)
async def get_preset(
    preset_id: int,
    db: AsyncSession = Depends(get_db),
) -> CuratedPresetResponse:
    """
    Get a single curated preset by ID.

    Raises:
    - 404: Preset not found or inactive
    """
    repository = CuratedPresetRepository(db)
    preset = await repository.get_by_id(preset_id)

    if not preset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Preset with id {preset_id} not found",
        )

    return CuratedPresetResponse.model_validate(preset)


@router.post("", response_model=CuratedPresetResponse, status_code=status.HTTP_201_CREATED)
async def create_preset(
    preset_data: CuratedPresetCreate,
    db: AsyncSession = Depends(get_db),
) -> CuratedPresetResponse:
    """
    Create a new curated preset.

    Parameters:
    - preset_data: Preset creation data

    Returns:
    - The created preset with generated ID and timestamps
    """
    repository = CuratedPresetRepository(db)
    preset = await repository.create(preset_data)

    return CuratedPresetResponse.model_validate(preset)


@router.patch("/{preset_id}", response_model=CuratedPresetResponse)
async def update_preset(
    preset_id: int,
    preset_data: CuratedPresetUpdate,
    db: AsyncSession = Depends(get_db),
) -> CuratedPresetResponse:
    """
    Update an existing curated preset.

    Only provided fields will be updated.

    Raises:
    - 404: Preset not found or inactive
    """
    repository = CuratedPresetRepository(db)
    preset = await repository.update(preset_id, preset_data)

    if not preset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Preset with id {preset_id} not found",
        )

    return CuratedPresetResponse.model_validate(preset)


@router.delete("/{preset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_preset(
    preset_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a curated preset (soft delete by setting is_active=False).

    Raises:
    - 404: Preset not found or already inactive
    """
    repository = CuratedPresetRepository(db)
    deleted = await repository.delete(preset_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Preset with id {preset_id} not found",
        )
