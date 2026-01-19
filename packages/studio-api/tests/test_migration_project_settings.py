"""Tests for Alembic migration 003_create_project_settings_table.

TASK-002: Create Alembic migration for project_settings
- Design-TAG: SPEC-MCP-001 natural language screen generation database infrastructure
- Function-TAG: Migration creates project_settings table with FK and indexes
- Test-TAG: Migration structure, upgrade/downgrade operations
"""

import pytest
from pathlib import Path


# Migration file path relative to project root
MIGRATION_PATH = Path(__file__).parent.parent / "alembic" / "versions" / "003_create_project_settings_table.py"


@pytest.fixture
def migration_content() -> str:
    """Read migration file content."""
    return MIGRATION_PATH.read_text()


class TestMigrationFileExists:
    """Test that migration file exists and has correct structure."""

    def test_migration_file_exists(self) -> None:
        """Test that migration file 003_create_project_settings_table.py exists."""
        assert MIGRATION_PATH.exists(), f"Migration file not found at {MIGRATION_PATH}"

    def test_migration_has_required_attributes(self, migration_content: str) -> None:
        """Test that migration has required revision attributes."""
        # Check revision identifiers
        assert "revision: str = '003'" in migration_content
        assert "down_revision: Union[str, None] = '002'" in migration_content

    def test_migration_has_upgrade_function(self, migration_content: str) -> None:
        """Test that migration has upgrade function."""
        assert "def upgrade()" in migration_content

    def test_migration_has_downgrade_function(self, migration_content: str) -> None:
        """Test that migration has downgrade function."""
        assert "def downgrade()" in migration_content


class TestMigrationTableDefinition:
    """Test migration creates correct table structure."""

    def test_creates_project_settings_table(self, migration_content: str) -> None:
        """Test that migration creates project_settings table."""
        # Check table creation
        assert "create_table" in migration_content
        assert "'project_settings'" in migration_content

    def test_has_id_primary_key(self, migration_content: str) -> None:
        """Test migration defines id as primary key."""
        assert "'id'" in migration_content
        assert "primary_key=True" in migration_content or "PrimaryKeyConstraint" in migration_content

    def test_has_project_path_column(self, migration_content: str) -> None:
        """Test migration defines project_path column."""
        assert "'project_path'" in migration_content
        assert "String" in migration_content

    def test_has_project_path_unique_constraint(self, migration_content: str) -> None:
        """Test migration defines unique constraint on project_path."""
        # Check for unique constraint or unique=True
        assert "unique=True" in migration_content or "UniqueConstraint" in migration_content

    def test_has_active_preset_id_foreign_key(self, migration_content: str) -> None:
        """Test migration defines FK to curated_themes."""
        assert "'active_preset_id'" in migration_content
        assert "ForeignKey" in migration_content or "ForeignKeyConstraint" in migration_content
        assert "curated_themes.id" in migration_content

    def test_has_on_delete_set_null(self, migration_content: str) -> None:
        """Test FK has ON DELETE SET NULL."""
        assert "SET NULL" in migration_content

    def test_has_framework_type_column(self, migration_content: str) -> None:
        """Test migration defines framework_type column."""
        assert "'framework_type'" in migration_content

    def test_has_detected_at_column(self, migration_content: str) -> None:
        """Test migration defines detected_at column."""
        assert "'detected_at'" in migration_content
        assert "DateTime" in migration_content

    def test_has_timestamp_columns(self, migration_content: str) -> None:
        """Test migration defines created_at and updated_at columns."""
        assert "'created_at'" in migration_content
        assert "'updated_at'" in migration_content
        assert "timezone=True" in migration_content


class TestMigrationIndexes:
    """Test migration creates required indexes."""

    def test_has_project_path_index(self, migration_content: str) -> None:
        """Test migration creates index on project_path."""
        # Check for index creation (either inline or via create_index)
        assert (
            "ix_project_settings_project_path" in migration_content
            or ("create_index" in migration_content and "project_path" in migration_content)
        )

    def test_has_active_preset_id_index(self, migration_content: str) -> None:
        """Test migration creates index on active_preset_id."""
        # Check for index on active_preset_id
        assert "ix_project_settings_active_preset_id" in migration_content

    def test_has_framework_type_index(self, migration_content: str) -> None:
        """Test migration creates index on framework_type."""
        assert "ix_project_settings_framework_type" in migration_content


class TestMigrationDowngrade:
    """Test migration downgrade drops table correctly."""

    def test_downgrade_drops_table(self, migration_content: str) -> None:
        """Test downgrade function drops project_settings table."""
        assert "drop_table" in migration_content
        assert "'project_settings'" in migration_content

    def test_downgrade_drops_indexes(self, migration_content: str) -> None:
        """Test downgrade function drops indexes."""
        # Check for drop_index in downgrade section
        assert "drop_index" in migration_content
