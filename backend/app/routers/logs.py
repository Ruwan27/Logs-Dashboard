import csv
import io
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.core.logging_config import logger
from app.crud.log import log_crud
from app.schemas.log import (
    LogCreate,
    LogUpdate,
    LogResponse,
    LogListResponse,
    SeverityLevel,
)

router = APIRouter(prefix="/logs", tags=["logs"])


@router.post(
    "",
    response_model=LogResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new log entry",
    description="Creates a new log entry with the provided data."
)
async def create_log(
    log_data: LogCreate,
    db: Session = Depends(get_db)
) -> LogResponse:
    
    logger.info(f"Creating new log entry from source: {log_data.source}")
    
    try:
        log = log_crud.create(db, log_data)
        logger.info(f"Created log entry with ID: {log.id}")
        return log
    except Exception as e:
        logger.error(f"Error creating log entry: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create log entry"
        )


@router.get(
    "",
    response_model=LogListResponse,
    summary="List log entries",
    description="Get a paginated list of log entries with optional sorting."
)
async def list_logs(
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(
        default=settings.DEFAULT_PAGE_SIZE,
        ge=1,
        le=settings.MAX_PAGE_SIZE,
        description="Items per page"
    ),
    sort_by: str = Query(
        default="timestamp",
        description="Field to sort by (timestamp, severity, source, created_at)"
    ),
    sort_order: str = Query(
        default="desc",
        pattern="^(asc|desc)$",
        description="Sort order"
    ),
    db: Session = Depends(get_db)
) -> LogListResponse:
    
    logger.debug(f"Listing logs: page={page}, page_size={page_size}")
    
    logs, total = log_crud.get_list(db, page, page_size, sort_by, sort_order)
    total_pages = (total + page_size - 1) // page_size
    
    return LogListResponse(
        items=logs,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get(
    "/search",
    response_model=LogListResponse,
    summary="Search log entries",
    description="Search log entries with filters for date range, severity, source, and message."
)
async def search_logs(
    start_date: Optional[datetime] = Query(None, description="Filter from this date"),
    end_date: Optional[datetime] = Query(None, description="Filter until this date"),
    severity: Optional[SeverityLevel] = Query(None, description="Filter by severity"),
    source: Optional[str] = Query(None, description="Filter by source (partial match)"),
    message: Optional[str] = Query(None, description="Search in message content"),
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(
        default=settings.DEFAULT_PAGE_SIZE,
        ge=1,
        le=settings.MAX_PAGE_SIZE,
        description="Items per page"
    ),
    sort_by: str = Query(default="timestamp", description="Field to sort by"),
    sort_order: str = Query(default="desc", pattern="^(asc|desc)$", description="Sort order"),
    db: Session = Depends(get_db)
) -> LogListResponse:
    
    logger.debug(f"Searching logs: severity={severity}, source={source}")
    
    logs, total = log_crud.search(
        db,
        start_date=start_date,
        end_date=end_date,
        severity=severity,
        source=source,
        message=message,
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    total_pages = (total + page_size - 1) // page_size
    
    return LogListResponse(
        items=logs,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages
    )


@router.get(
    "/export",
    summary="Export logs to CSV",
    description="Export log entries matching filters to CSV format."
)
async def export_logs_csv(
    start_date: Optional[datetime] = Query(None, description="Filter from this date"),
    end_date: Optional[datetime] = Query(None, description="Filter until this date"),
    severity: Optional[SeverityLevel] = Query(None, description="Filter by severity"),
    source: Optional[str] = Query(None, description="Filter by source"),
    db: Session = Depends(get_db)
) -> Response:
    
    logger.info("Exporting logs to CSV")
    
    logs = log_crud.get_all_for_export(
        db,
        start_date=start_date,
        end_date=end_date,
        severity=severity,
        source=source
    )
    
    # Create CSV in memory
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow(['ID', 'Timestamp', 'Severity', 'Source', 'Message', 'Created At', 'Updated At'])
    
    # Write data
    for log in logs:
        writer.writerow([
            str(log.id),
            log.timestamp.isoformat(),
            log.severity,
            log.source,
            log.message,
            log.created_at.isoformat(),
            log.updated_at.isoformat()
        ])
    
    csv_content = output.getvalue()
    output.close()
    
    # Generate filename with current timestamp
    filename = f"logs_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )


@router.get(
    "/{log_id}",
    response_model=LogResponse,
    summary="Get a single log entry",
    description="Get detailed information about a specific log entry."
)
async def get_log(
    log_id: UUID,
    db: Session = Depends(get_db)
) -> LogResponse:
    
    logger.debug(f"Getting log entry: {log_id}")
    
    log = log_crud.get_by_id(db, log_id)
    
    if not log:
        logger.warning(f"Log entry not found: {log_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Log entry with ID {log_id} not found"
        )
    
    return log


@router.put(
    "/{log_id}",
    response_model=LogResponse,
    summary="Update a log entry",
    description="Update an existing log entry with the provided data."
)
async def update_log(
    log_id: UUID,
    log_data: LogUpdate,
    db: Session = Depends(get_db)
) -> LogResponse:
    
    logger.info(f"Updating log entry: {log_id}")
    
    log = log_crud.update(db, log_id, log_data)
    
    if not log:
        logger.warning(f"Log entry not found for update: {log_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Log entry with ID {log_id} not found"
        )
    
    logger.info(f"Updated log entry: {log_id}")
    return log


@router.delete(
    "/{log_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a log entry",
    description="Delete a specific log entry."
)
async def delete_log(
    log_id: UUID,
    db: Session = Depends(get_db)
) -> None:
    
    logger.info(f"Deleting log entry: {log_id}")
    
    deleted = log_crud.delete(db, log_id)
    
    if not deleted:
        logger.warning(f"Log entry not found for deletion: {log_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Log entry with ID {log_id} not found"
        )
    
    logger.info(f"Deleted log entry: {log_id}")
