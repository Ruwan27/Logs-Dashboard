from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field, field_validator
from enum import Enum


class SeverityLevel(str, Enum):
    """Severity level enumeration."""
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARN = "WARN"
    ERROR = "ERROR"


class LogBase(BaseModel):
    """Base schema for Log with common fields."""
    message: str = Field(..., min_length=1, max_length=10000, description="Log message content")
    severity: SeverityLevel = Field(default=SeverityLevel.INFO, description="Log severity level")
    source: str = Field(..., min_length=1, max_length=255, description="Log source identifier")
    timestamp: Optional[datetime] = Field(None, description="Log timestamp (defaults to current time)")


class LogCreate(LogBase):
    """Schema for creating a new log entry."""
    
    @field_validator('message')
    @classmethod
    def message_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Message cannot be empty or whitespace only')
        return v.strip()
    
    @field_validator('source')
    @classmethod
    def source_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError('Source cannot be empty or whitespace only')
        return v.strip()


class LogUpdate(BaseModel):
    """Schema for updating a log entry. All fields optional."""
    message: Optional[str] = Field(None, min_length=1, max_length=10000)
    severity: Optional[SeverityLevel] = None
    source: Optional[str] = Field(None, min_length=1, max_length=255)
    timestamp: Optional[datetime] = None
    
    @field_validator('message')
    @classmethod
    def message_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError('Message cannot be empty or whitespace only')
        return v.strip() if v else v
    
    @field_validator('source')
    @classmethod
    def source_not_empty(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not v.strip():
            raise ValueError('Source cannot be empty or whitespace only')
        return v.strip() if v else v


class LogResponse(LogBase):
    """Schema for log response with all fields."""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class LogListResponse(BaseModel):
    """Paginated response for log list."""
    items: List[LogResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class LogSearchParams(BaseModel):
    """Search parameters for filtering logs."""
    start_date: Optional[datetime] = Field(None, description="Filter logs from this date")
    end_date: Optional[datetime] = Field(None, description="Filter logs until this date")
    severity: Optional[SeverityLevel] = Field(None, description="Filter by severity level")
    source: Optional[str] = Field(None, description="Filter by source (partial match)")
    message: Optional[str] = Field(None, description="Search in message content")
    page: int = Field(default=1, ge=1, description="Page number")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")
    sort_by: str = Field(default="timestamp", description="Field to sort by")
    sort_order: str = Field(default="desc", pattern="^(asc|desc)$", description="Sort order")


class TimeSeriesDataPoint(BaseModel):
    """Single data point for time series analytics."""
    period: str = Field(..., description="Time period (e.g., '2024-01-15' or '2024-01-15 14:00')")
    count: int = Field(..., description="Number of logs in this period")


class LogCountAnalytics(BaseModel):
    """Response for log count analytics."""
    data: List[TimeSeriesDataPoint]
    total_count: int
    granularity: str = Field(..., description="Time granularity: 'hour' or 'day'")
    start_date: Optional[datetime]
    end_date: Optional[datetime]


class SeverityDistribution(BaseModel):
    """Severity distribution data."""
    severity: str
    count: int
    percentage: float


class SeverityDistributionResponse(BaseModel):
    """Response for severity distribution analytics."""
    data: List[SeverityDistribution]
    total_count: int
