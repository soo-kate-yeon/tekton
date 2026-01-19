"""add detailed preset fields

Revision ID: 002
Revises: 001
Create Date: 2026-01-17 23:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add detailed preset fields for style archetypes."""
    # Add new columns
    op.add_column('curated_themes', sa.Column('one_line_definition', sa.Text(), nullable=True))
    op.add_column('curated_themes', sa.Column('reference_style', sa.String(length=255), nullable=True))
    op.add_column('curated_themes', sa.Column('principles', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('curated_themes', sa.Column('component_rules', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('curated_themes', sa.Column('forbidden_patterns', postgresql.JSONB(astext_type=sa.Text()), nullable=True))


def downgrade() -> None:
    """Remove detailed preset fields."""
    op.drop_column('curated_themes', 'forbidden_patterns')
    op.drop_column('curated_themes', 'component_rules')
    op.drop_column('curated_themes', 'principles')
    op.drop_column('curated_themes', 'reference_style')
    op.drop_column('curated_themes', 'one_line_definition')
