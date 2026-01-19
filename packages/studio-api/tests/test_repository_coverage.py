"""Additional repository tests to achieve ≥85% coverage."""

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from studio_api.models.curated_theme import CuratedTheme
from studio_api.repositories.curated_theme import CuratedPresetRepository
from studio_api.schemas.curated_theme import CuratedPresetCreate, CuratedPresetUpdate


@pytest_asyncio.fixture
async def sample_preset(db_session: AsyncSession) -> CuratedTheme:
    """Create a sample preset for testing."""
    preset = CuratedTheme(
        name="Sample Preset",
        category="test",
        description="Test description",
        config={},
        tags=["tag1", "tag2"],
        is_active=True,
    )
    db_session.add(preset)
    await db_session.commit()
    await db_session.refresh(preset)
    return preset


class TestRepositoryEdgeCases:
    """Test repository edge cases and error paths for coverage."""

    async def test_get_by_id_inactive_preset(self, db_session: AsyncSession, sample_preset: CuratedTheme):
        """Test that get_by_id returns None for inactive presets."""
        repository = CuratedPresetRepository(db_session)

        # Deactivate the preset
        sample_preset.is_active = False
        await db_session.commit()

        # Should return None because preset is inactive
        result = await repository.get_by_id(sample_preset.id)
        assert result is None

    async def test_list_with_tag_filter(self, db_session: AsyncSession):
        """Test list with tag filtering - covers lines 65-66."""
        repository = CuratedPresetRepository(db_session)

        # Create presets with different tags
        preset1 = CuratedTheme(
            name="Preset 1",
            category="test",
            description="Has special tag",
            config={},
            tags=["special", "other"],
            is_active=True,
        )
        preset2 = CuratedTheme(
            name="Preset 2",
            category="test",
            description="No special tag",
            config={},
            tags=["normal"],
            is_active=True,
        )
        db_session.add_all([preset1, preset2])
        await db_session.commit()

        # Filter by "special" tag
        items, total = await repository.list(tags="special")

        assert total == 1
        assert len(items) == 1
        assert items[0].name == "Preset 1"
        assert "special" in items[0].tags

    async def test_list_with_tag_filter_empty_tags(self, db_session: AsyncSession):
        """Test list with tag filter when preset has None tags - covers line 66."""
        repository = CuratedPresetRepository(db_session)

        # Create preset with None tags
        preset = CuratedTheme(
            name="No Tags Preset",
            category="test",
            description="Has no tags",
            config={},
            tags=None,
            is_active=True,
        )
        db_session.add(preset)
        await db_session.commit()

        # Filter by any tag
        items, total = await repository.list(tags="anything")

        # Should not match preset with None tags
        assert total == 0
        assert len(items) == 0

    async def test_list_pagination(self, db_session: AsyncSession):
        """Test list pagination - covers lines 72-74."""
        repository = CuratedPresetRepository(db_session)

        # Create 5 presets
        for i in range(5):
            preset = CuratedTheme(
                name=f"Preset {i}",
                category="test",
                description=f"Description {i}",
                config={},
                tags=[f"tag{i}"],
                is_active=True,
            )
            db_session.add(preset)
        await db_session.commit()

        # Get page 2 (skip=2, limit=2)
        items, total = await repository.list(skip=2, limit=2)

        assert total == 5
        assert len(items) == 2

    async def test_create_preset(self, db_session: AsyncSession):
        """Test create preset - covers lines 86-90."""
        repository = CuratedPresetRepository(db_session)

        theme_data = CuratedPresetCreate(
            name="New Preset",
            category="business",
            description="A new preset",
            config={"key": "value"},
            tags=["new", "test"],
        )

        created = await repository.create(theme_data)

        assert created.id is not None
        assert created.name == "New Preset"
        assert created.category == "business"
        assert created.created_at is not None
        assert created.updated_at is not None

    async def test_update_preset_success(self, db_session: AsyncSession, sample_preset: CuratedTheme):
        """Test successful preset update - covers lines 105-116."""
        repository = CuratedPresetRepository(db_session)

        update_data = CuratedPresetUpdate(
            name="Updated Name",
            description="Updated description",
        )

        updated = await repository.update(sample_preset.id, update_data)

        assert updated is not None
        assert updated.id == sample_preset.id
        assert updated.name == "Updated Name"
        assert updated.description == "Updated description"
        # Category should remain unchanged
        assert updated.category == sample_preset.category

    async def test_update_preset_not_found(self, db_session: AsyncSession):
        """Test update non-existent preset - covers lines 106-107."""
        repository = CuratedPresetRepository(db_session)

        update_data = CuratedPresetUpdate(name="New Name")

        # Try to update non-existent preset
        result = await repository.update(99999, update_data)

        assert result is None

    async def test_update_partial_fields(self, db_session: AsyncSession, sample_preset: CuratedTheme):
        """Test partial update - covers lines 110-112."""
        repository = CuratedPresetRepository(db_session)

        original_name = sample_preset.name
        original_category = sample_preset.category

        # Update only description
        update_data = CuratedPresetUpdate(description="Only description changed")

        updated = await repository.update(sample_preset.id, update_data)

        assert updated is not None
        assert updated.name == original_name  # Unchanged
        assert updated.category == original_category  # Unchanged
        assert updated.description == "Only description changed"

    async def test_delete_preset_success(self, db_session: AsyncSession, sample_preset: CuratedTheme):
        """Test successful preset deletion - covers lines 124-130."""
        repository = CuratedPresetRepository(db_session)

        # Delete the preset
        result = await repository.delete(sample_preset.id)

        assert result is True

        # Verify preset is soft-deleted (is_active=False)
        deleted_preset = await db_session.get(CuratedTheme, sample_preset.id)
        assert deleted_preset is not None
        assert deleted_preset.is_active is False

        # Verify get_by_id returns None for inactive preset
        result = await repository.get_by_id(sample_preset.id)
        assert result is None

    async def test_delete_preset_not_found(self, db_session: AsyncSession):
        """Test delete non-existent preset - covers lines 125-126."""
        repository = CuratedPresetRepository(db_session)

        # Try to delete non-existent preset
        result = await repository.delete(99999)

        assert result is False
