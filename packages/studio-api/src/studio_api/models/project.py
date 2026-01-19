"""Project database model.

Design-TAG: SPEC-STUDIO-WEB-001 Framer-style workspace/project structure
Function-TAG: Project entity for storing user projects with template and layout settings
"""

from datetime import datetime, timezone
from typing import Any

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from studio_api.core.database import Base


class LayoutBreakpoint(Base):
    """Layout breakpoint configuration for responsive design.
    
    Default breakpoints:
    - Mobile: 390px
    - Tablet: 810px  
    - Desktop: 1200px
    """

    __tablename__ = "layout_breakpoints"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True
    )
    
    # Breakpoint identification
    name: Mapped[str] = mapped_column(String(50), nullable=False)  # "mobile", "tablet", "desktop"
    min_width: Mapped[int] = mapped_column(Integer, nullable=False)  # 0, 390, 810
    max_width: Mapped[int | None] = mapped_column(Integer, nullable=True)  # 389, 809, null
    
    # Layout configuration (extensible for future settings)
    config: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False, default=dict
    )  # margin, columns, typography scale, etc.
    
    # Ordering
    display_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    
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
        return f"<LayoutBreakpoint(id={self.id}, name='{self.name}', min_width={self.min_width})>"


class Project(Base):
    """Project model for storing user projects.
    
    Each project contains:
    - Active template (linked to CuratedTheme)
    - Layout breakpoints configuration
    - General settings
    """

    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Thumbnail for workspace display
    thumbnail_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    
    # Active template (foreign key to curated_themes)
    active_template_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("curated_themes.id", ondelete="SET NULL"), nullable=True, index=True
    )
    
    # Token configuration (copied from template, user can customize)
    token_config: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False, default=dict
    )
    
    # General project settings
    settings: Mapped[dict[str, Any]] = mapped_column(
        JSON, nullable=False, default=dict
    )  # stack, framework preferences, etc.
    
    is_archived: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    
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
    
    # Relationships
    active_template = relationship("CuratedTheme", foreign_keys=[active_template_id])
    breakpoints = relationship(
        "LayoutBreakpoint",
        backref="project",
        cascade="all, delete-orphan",
        order_by="LayoutBreakpoint.display_order",
    )

    def __repr__(self) -> str:
        return f"<Project(id={self.id}, name='{self.name}')>"
