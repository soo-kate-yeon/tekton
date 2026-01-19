"""Repository for CuratedTheme database operations."""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from studio_api.models.curated_theme import CuratedTheme
from studio_api.schemas.curated_theme import CuratedPresetCreate, CuratedPresetUpdate


class CuratedPresetRepository:
    """Repository for managing CuratedTheme database operations."""

    def __init__(self, session: AsyncSession):
        """Initialize repository with database session."""
        self.session = session

    async def get_by_id(self, theme_id: int) -> CuratedTheme | None:
        """
        Get a preset by ID (only active presets).

        Args:
            theme_id: The ID of the preset to retrieve.

        Returns:
            The preset if found and active, None otherwise.
        """
        result = await self.session.execute(
            select(CuratedTheme)
            .where(CuratedTheme.id == theme_id)
            .where(CuratedTheme.is_active == True)  # noqa: E712
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        skip: int = 0,
        limit: int = 100,
        category: str | None = None,
        tags: str | None = None,
    ) -> tuple[list[CuratedTheme], int]:
        """
        List presets with optional filtering and pagination.

        Args:
            skip: Number of items to skip for pagination.
            limit: Maximum number of items to return.
            category: Optional category filter.
            tags: Optional tag filter (single tag string).

        Returns:
            Tuple of (list of presets, total count matching filters).
        """
        # Build base query for active presets only
        query = select(CuratedTheme).where(CuratedTheme.is_active == True)  # noqa: E712

        # Apply category filter
        if category:
            query = query.where(CuratedTheme.category == category)

        # Execute query to get all matching presets
        result = await self.session.execute(query)
        all_items = list(result.scalars().all())

        # Apply tag filter in Python (database-agnostic approach)
        if tags:
            all_items = [item for item in all_items if tags in (item.tags or [])]

        # Get total count after filtering
        total = len(all_items)

        # Apply pagination in Python
        items = all_items[skip : skip + limit]

        return items, total

    async def create(self, theme_data: CuratedPresetCreate) -> CuratedTheme:
        """
        Create a new preset.

        Args:
            theme_data: The preset data to create.

        Returns:
            The created preset with generated ID and timestamps.
        """
        preset = CuratedTheme(**theme_data.model_dump())
        self.session.add(preset)
        await self.session.commit()
        await self.session.refresh(preset)
        return preset

    async def update(
        self, theme_id: int, theme_data: CuratedPresetUpdate
    ) -> CuratedTheme | None:
        """
        Update an existing preset.

        Args:
            theme_id: The ID of the preset to update.
            theme_data: The update data (only provided fields will be updated).

        Returns:
            The updated preset if found, None otherwise.
        """
        preset = await self.get_by_id(theme_id)
        if not preset:
            return None

        # Update only provided fields
        update_dict = theme_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(preset, field, value)

        await self.session.commit()
        await self.session.refresh(preset)
        return preset

    async def delete(self, theme_id: int) -> bool:
        """
        Soft delete a preset by setting is_active=False.

        Returns True if preset was found and deleted, False otherwise.
        """
        preset = await self.get_by_id(theme_id)
        if not preset:
            return False

        preset.is_active = False
        await self.session.commit()
        return True
