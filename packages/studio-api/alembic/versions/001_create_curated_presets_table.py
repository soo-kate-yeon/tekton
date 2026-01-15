"""create curated_presets table

Revision ID: 001
Revises:
Create Date: 2026-01-15 01:07:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create curated_presets table."""
    op.create_table(
        'curated_presets',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('config', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('tags', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_curated_presets_category'), 'curated_presets', ['category'], unique=False)
    op.create_index(op.f('ix_curated_presets_is_active'), 'curated_presets', ['is_active'], unique=False)
    op.create_index(op.f('ix_curated_presets_name'), 'curated_presets', ['name'], unique=False)


def downgrade() -> None:
    """Drop curated_presets table."""
    op.drop_index(op.f('ix_curated_presets_name'), table_name='curated_presets')
    op.drop_index(op.f('ix_curated_presets_is_active'), table_name='curated_presets')
    op.drop_index(op.f('ix_curated_presets_category'), table_name='curated_presets')
    op.drop_table('curated_presets')
