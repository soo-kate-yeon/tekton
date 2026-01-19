"""Curated preset database model."""

from datetime import datetime, timezone
from typing import Any

from sqlalchemy import JSON, Boolean, DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from studio_api.core.database import Base


class CuratedTheme(Base):
    """Curated preset model for storing design system presets."""

    __tablename__ = "curated_themes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Style archetype fields
    one_line_definition: Mapped[str | None] = mapped_column(Text, nullable=True)
    reference_style: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    # Token configuration
    config: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    
    # AI-only fields (not exposed in Web UI)
    principles: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    component_rules: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    forbidden_patterns: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    
    tags: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def __repr__(self) -> str:
        """String representation."""
        return f"<CuratedTheme(id={self.id}, name='{self.name}', category='{self.category}')>"
