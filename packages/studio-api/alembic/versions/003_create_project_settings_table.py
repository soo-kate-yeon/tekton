"""create project_settings table

Revision ID: 003
Revises: 002
Create Date: 2026-01-18 10:00:00.000000

Design-TAG: SPEC-MCP-001 natural language screen generation database infrastructure
Function-TAG: Migration creates project_settings table with FK to curated_themes
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '003'
down_revision: Union[str, None] = '002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create project_settings table with FK to curated_themes."""
    op.create_table(
        'project_settings',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('project_path', sa.String(length=1024), nullable=False),
        sa.Column(
            'active_preset_id',
            sa.Integer(),
            sa.ForeignKey('curated_themes.id', ondelete='SET NULL'),
            nullable=True,
        ),
        sa.Column('framework_type', sa.String(length=50), nullable=True),
        sa.Column('detected_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text('now()'),
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text('now()'),
        ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('project_path', name='uq_project_settings_project_path'),
    )
    # Create indexes for optimized queries
    op.create_index(
        op.f('ix_project_settings_project_path'),
        'project_settings',
        ['project_path'],
        unique=True,
    )
    op.create_index(
        op.f('ix_project_settings_active_preset_id'),
        'project_settings',
        ['active_preset_id'],
        unique=False,
    )
    op.create_index(
        op.f('ix_project_settings_framework_type'),
        'project_settings',
        ['framework_type'],
        unique=False,
    )


def downgrade() -> None:
    """Drop project_settings table and indexes."""
    op.drop_index(op.f('ix_project_settings_framework_type'), table_name='project_settings')
    op.drop_index(op.f('ix_project_settings_active_preset_id'), table_name='project_settings')
    op.drop_index(op.f('ix_project_settings_project_path'), table_name='project_settings')
    op.drop_table('project_settings')
