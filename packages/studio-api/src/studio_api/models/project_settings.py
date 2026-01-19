"""Project settings database model.

Design-TAG: SPEC-MCP-001 natural language screen generation database infrastructure
Function-TAG: ProjectSettings model stores project-specific preset associations
"""

from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from studio_api.core.database import Base


class ProjectSettings(Base):
    """Project settings model for storing project-specific preset associations.

    This model links a project directory to an active curated preset,
    enabling natural language screen generation with consistent styling.

    Attributes:
        id: Primary key
        project_path: Unique path to the project directory
        active_preset_id: FK to curated_themes (SET NULL on delete)
        framework_type: Detected or configured framework (react, vue, nextjs, etc.)
        detected_at: Timestamp when framework was last auto-detected
        created_at: Record creation timestamp
        updated_at: Record last update timestamp
    """

    __tablename__ = "project_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_path: Mapped[str] = mapped_column(
        String(1024), nullable=False, unique=True, index=True
    )
    active_preset_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("curated_themes.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    framework_type: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    detected_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
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

    # Relationship to CuratedTheme (optional, for eager loading if needed)
    active_theme = relationship(
        "CuratedTheme",
        foreign_keys=[active_preset_id],
        lazy="selectin",
    )

    def __repr__(self) -> str:
        """String representation."""
        return (
            f"<ProjectSettings(id={self.id}, "
            f"project_path='{self.project_path}', "
            f"framework_type='{self.framework_type}')>"
        )
