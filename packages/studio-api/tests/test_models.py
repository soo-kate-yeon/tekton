"""Tests for database models - RED phase."""

from datetime import datetime, timezone

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from studio_api.models.curated_theme import CuratedTheme


@pytest.mark.asyncio
async def test_curated_preset_creation(db_session: AsyncSession) -> None:
    """Test creating a curated preset."""
    preset = CuratedTheme(
        name="Modern Minimalist",
        category="website",
        description="Clean and modern design with minimalist aesthetics",
        config={
            "typography": {"fontFamily": "Inter", "fontSize": 16},
            "colors": {"primary": "#000000", "secondary": "#FFFFFF"},
            "spacing": {"base": 8},
        },
        tags=["modern", "minimalist", "clean"],
        is_active=True,
    )

    db_session.add(preset)
    await db_session.commit()
    await db_session.refresh(preset)

    assert preset.id is not None
    assert preset.name == "Modern Minimalist"
    assert preset.category == "website"
    assert preset.description == "Clean and modern design with minimalist aesthetics"
    assert preset.config["typography"]["fontFamily"] == "Inter"
    assert preset.tags == ["modern", "minimalist", "clean"]
    assert preset.is_active is True
    assert isinstance(preset.created_at, datetime)
    assert isinstance(preset.updated_at, datetime)


@pytest.mark.asyncio
async def test_curated_preset_required_fields(db_session: AsyncSession) -> None:
    """Test that required fields are enforced."""
    preset = CuratedTheme(
        name="Test Preset",
        category="website",
        config={"test": "value"},
    )

    db_session.add(preset)
    await db_session.commit()
    await db_session.refresh(preset)

    # Description should be nullable
    assert preset.description is None
    # Tags should default to empty list
    assert preset.tags == []
    # is_active should default to True
    assert preset.is_active is True


@pytest.mark.asyncio
async def test_curated_preset_timestamps(db_session: AsyncSession) -> None:
    """Test that timestamps are automatically set."""
    preset = CuratedTheme(
        name="Timestamp Test",
        category="mobile-app",
        config={"test": "value"},
    )

    db_session.add(preset)
    await db_session.commit()
    await db_session.refresh(preset)

    assert preset.created_at is not None
    assert preset.updated_at is not None
    assert preset.created_at <= preset.updated_at


@pytest.mark.asyncio
async def test_curated_preset_query_by_category(db_session: AsyncSession) -> None:
    """Test querying presets by category."""
    presets = [
        CuratedTheme(name="Web 1", category="website", config={}),
        CuratedTheme(name="Web 2", category="website", config={}),
        CuratedTheme(name="Mobile 1", category="mobile-app", config={}),
    ]

    for preset in presets:
        db_session.add(preset)
    await db_session.commit()

    # Query website presets
    result = await db_session.execute(
        select(CuratedTheme).where(CuratedTheme.category == "website")
    )
    website_presets = result.scalars().all()

    assert len(website_presets) == 2
    assert all(p.category == "website" for p in website_presets)


@pytest.mark.asyncio
async def test_curated_preset_query_active_only(db_session: AsyncSession) -> None:
    """Test querying only active presets."""
    presets = [
        CuratedTheme(name="Active 1", category="website", config={}, is_active=True),
        CuratedTheme(name="Inactive", category="website", config={}, is_active=False),
        CuratedTheme(name="Active 2", category="website", config={}, is_active=True),
    ]

    for preset in presets:
        db_session.add(preset)
    await db_session.commit()

    # Query active presets only
    result = await db_session.execute(
        select(CuratedTheme).where(CuratedTheme.is_active == True)
    )
    active_presets = result.scalars().all()

    assert len(active_presets) == 2
    assert all(p.is_active for p in active_presets)


@pytest.mark.asyncio
async def test_curated_preset_name_uniqueness(db_session: AsyncSession) -> None:
    """Test that preset names should be unique per category."""
    preset1 = CuratedTheme(
        name="Duplicate Name",
        category="website",
        config={},
    )
    db_session.add(preset1)
    await db_session.commit()

    # Same name in different category should be allowed
    preset2 = CuratedTheme(
        name="Duplicate Name",
        category="mobile-app",
        config={},
    )
    db_session.add(preset2)
    await db_session.commit()

    result = await db_session.execute(select(CuratedTheme))
    all_presets = result.scalars().all()
    assert len(all_presets) == 2


@pytest.mark.asyncio
async def test_curated_preset_json_config(db_session: AsyncSession) -> None:
    """Test that complex JSON config is stored correctly."""
    complex_config = {
        "typography": {
            "fontFamily": "Roboto",
            "fontSize": 16,
            "lineHeight": 1.5,
            "weights": [400, 500, 700],
        },
        "colors": {
            "primary": "#007AFF",
            "secondary": "#5AC8FA",
            "palette": ["#007AFF", "#5AC8FA", "#34C759"],
        },
        "spacing": {"scale": [0, 4, 8, 16, 24, 32, 48, 64]},
        "breakpoints": {"sm": 640, "md": 768, "lg": 1024},
    }

    preset = CuratedTheme(
        name="Complex Config Test",
        category="website",
        config=complex_config,
    )

    db_session.add(preset)
    await db_session.commit()
    await db_session.refresh(preset)

    assert preset.config["typography"]["weights"] == [400, 500, 700]
    assert preset.config["colors"]["palette"] == ["#007AFF", "#5AC8FA", "#34C759"]
    assert preset.config["breakpoints"]["lg"] == 1024
