from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.logging_config import logger
from app.crud.log import log_crud
from app.schemas.log import (
    LogCountAnalytics,
    SeverityDistributionResponse,
    SeverityLevel,
    TimeSeriesDataPoint,
    SeverityDistribution,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get(
    "/log-count",
    response_model=LogCountAnalytics,
    summary="Get log count over time",
    description="Get aggregated log counts grouped by time period for charting."
)
async def get_log_count_analytics(
    granularity: str = Query(
        default="day",
        pattern="^(hour|day)$",
        description="Time granularity: 'hour' or 'day'"
    ),
    start_date: Optional[datetime] = Query(None, description="Filter from this date"),
    end_date: Optional[datetime] = Query(None, description="Filter until this date"),
    severity: Optional[SeverityLevel] = Query(None, description="Filter by severity"),
    source: Optional[str] = Query(None, description="Filter by source"),
    db: Session = Depends(get_db)
) -> LogCountAnalytics:
    
    logger.debug(f"Getting log count analytics: granularity={granularity}")
    
    results = log_crud.get_log_count_by_time(
        db,
        granularity=granularity,
        start_date=start_date,
        end_date=end_date,
        severity=severity,
        source=source
    )
    
    data = [TimeSeriesDataPoint(**r) for r in results]
    total_count = sum(d.count for d in data)
    
    return LogCountAnalytics(
        data=data,
        total_count=total_count,
        granularity=granularity,
        start_date=start_date,
        end_date=end_date
    )


@router.get(
    "/severity-distribution",
    response_model=SeverityDistributionResponse,
    summary="Get severity distribution",
    description="Get distribution of logs by severity level."
)
async def get_severity_distribution(
    start_date: Optional[datetime] = Query(None, description="Filter from this date"),
    end_date: Optional[datetime] = Query(None, description="Filter until this date"),
    source: Optional[str] = Query(None, description="Filter by source"),
    db: Session = Depends(get_db)
) -> SeverityDistributionResponse:
    
    logger.debug("Getting severity distribution")
    
    results = log_crud.get_severity_distribution(
        db,
        start_date=start_date,
        end_date=end_date,
        source=source
    )
    
    data = [SeverityDistribution(**r) for r in results]
    total_count = sum(d.count for d in data)
    
    return SeverityDistributionResponse(
        data=data,
        total_count=total_count
    )
