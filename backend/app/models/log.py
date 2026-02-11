import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, Index, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.core.database import Base


class SeverityLevel(str, enum.Enum):
    """Enumeration of log severity levels."""
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARN = "WARN"
    ERROR = "ERROR"


class Log(Base):
    
    __tablename__ = "logs"
    
    # Primary key
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False
    )
    
    # Core fields
    timestamp = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
        default=lambda: datetime.now(timezone.utc)
    )
    
    message = Column(
        Text,
        nullable=False
    )
    
    severity = Column(
        String(10),
        nullable=False,
        index=True,
        default=SeverityLevel.INFO.value
    )
    
    source = Column(
        String(255),
        nullable=False,
        index=True
    )
    
    # Audit fields
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )
    
    # Composite indexes for common query patterns
    __table_args__ = (
        Index('idx_logs_timestamp_severity', 'timestamp', 'severity'),
        Index('idx_logs_source_timestamp', 'source', 'timestamp'),
    )
    
    def __repr__(self) -> str:
        return f"<Log(id={self.id}, severity={self.severity}, source={self.source})>"
