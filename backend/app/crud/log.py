from datetime import datetime, timedelta, timezone
from typing import List, Optional, Tuple
from uuid import UUID

from sqlalchemy import asc, desc, func
from sqlalchemy.orm import Session

from app.models.log import Log
from app.schemas.log import LogCreate, LogUpdate, SeverityLevel


class LogCRUD:
    """CRUD operations for Log model."""
    
    @staticmethod
    def create(db: Session, log_data: LogCreate) -> Log:
        
        db_log = Log(
            message=log_data.message,
            severity=log_data.severity.value,
            source=log_data.source,
            timestamp=log_data.timestamp or datetime.now(timezone.utc)
        )
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        return db_log
    
    @staticmethod
    def get_by_id(db: Session, log_id: UUID) -> Optional[Log]:
        
        return db.query(Log).filter(Log.id == log_id).first()
    
    @staticmethod
    def get_list(
        db: Session,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "timestamp",
        sort_order: str = "desc"
    ) -> Tuple[List[Log], int]:
        
        query = db.query(Log)
        
        # Get total count
        total = query.count()
        
        # Apply sorting
        sort_column = getattr(Log, sort_by, Log.timestamp)
        if sort_order == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))
        
        # Apply pagination
        offset = (page - 1) * page_size
        logs = query.offset(offset).limit(page_size).all()
        
        return logs, total
    
    @staticmethod
    def update(db: Session, log_id: UUID, log_data: LogUpdate) -> Optional[Log]:
        
        db_log = db.query(Log).filter(Log.id == log_id).first()
        
        if not db_log:
            return None
        
        update_data = log_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            if value is not None:
                if field == "severity":
                    value = value.value
                setattr(db_log, field, value)
        
        db_log.updated_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(db_log)
        return db_log
    
    @staticmethod
    def delete(db: Session, log_id: UUID) -> bool:
        
        db_log = db.query(Log).filter(Log.id == log_id).first()
        
        if not db_log:
            return False
        
        db.delete(db_log)
        db.commit()
        return True
    
    @staticmethod
    def search(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        severity: Optional[SeverityLevel] = None,
        source: Optional[str] = None,
        message: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
        sort_by: str = "timestamp",
        sort_order: str = "desc"
    ) -> Tuple[List[Log], int]:
        
        query = db.query(Log)
        
        # Apply filters
        if start_date:
            query = query.filter(Log.timestamp >= start_date)
        
        if end_date:
            query = query.filter(Log.timestamp <= end_date)
        
        if severity:
            query = query.filter(Log.severity == severity.value)
        
        if source:
            query = query.filter(Log.source.ilike(f"%{source}%"))
        
        if message:
            query = query.filter(Log.message.ilike(f"%{message}%"))
        
        # Get total count
        total = query.count()
        
        # Apply sorting
        sort_column = getattr(Log, sort_by, Log.timestamp)
        if sort_order == "desc":
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))
        
        # Apply pagination
        offset = (page - 1) * page_size
        logs = query.offset(offset).limit(page_size).all()
        
        return logs, total
    
    @staticmethod
    def get_log_count_by_time(
        db: Session,
        granularity: str = "day",
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        severity: Optional[SeverityLevel] = None,
        source: Optional[str] = None
    ) -> List[dict]:
        
        query = db.query(Log)
        
        # Apply filters
        if start_date:
            query = query.filter(Log.timestamp >= start_date)
        
        if end_date:
            query = query.filter(Log.timestamp <= end_date)
        
        if severity:
            query = query.filter(Log.severity == severity.value)
        
        if source:
            query = query.filter(Log.source.ilike(f"%{source}%"))
        
        # Group by time period
        if granularity == "hour":
            period_expr = func.date_trunc('hour', Log.timestamp)
        else:
            period_expr = func.date_trunc('day', Log.timestamp)
        
        results = (
            query
            .with_entities(
                period_expr.label('period'),
                func.count(Log.id).label('count')
            )
            .group_by(period_expr)
            .order_by(period_expr)
            .all()
        )
        
        fmt = "%Y-%m-%d %H:%M" if granularity == "hour" else "%Y-%m-%d"
        return [
            {
                "period": result.period if isinstance(result.period, str) else result.period.strftime(fmt),
                "count": result.count
            }
            for result in results
        ]
    
    @staticmethod
    def get_severity_distribution(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        source: Optional[str] = None
    ) -> List[dict]:
        
        query = db.query(Log)
        
        # Apply filters
        if start_date:
            query = query.filter(Log.timestamp >= start_date)
        
        if end_date:
            query = query.filter(Log.timestamp <= end_date)
        
        if source:
            query = query.filter(Log.source.ilike(f"%{source}%"))
        
        # Get total count
        total = query.count()
        
        if total == 0:
            return []
        
        # Group by severity
        results = (
            query
            .with_entities(
                Log.severity,
                func.count(Log.id).label('count')
            )
            .group_by(Log.severity)
            .order_by(desc('count'))
            .all()
        )
        
        return [
            {
                "severity": result.severity,
                "count": result.count,
                "percentage": round((result.count / total) * 100, 2)
            }
            for result in results
        ]
    
    @staticmethod
    def get_all_for_export(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        severity: Optional[SeverityLevel] = None,
        source: Optional[str] = None
    ) -> List[Log]:
       
        query = db.query(Log)
        
        if start_date:
            query = query.filter(Log.timestamp >= start_date)
        
        if end_date:
            query = query.filter(Log.timestamp <= end_date)
        
        if severity:
            query = query.filter(Log.severity == severity.value)
        
        if source:
            query = query.filter(Log.source.ilike(f"%{source}%"))
        
        return query.order_by(desc(Log.timestamp)).all()

    @staticmethod
    def get_summary(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        source: Optional[str] = None,
    ) -> dict:
        
        query = db.query(Log)

        if start_date:
            query = query.filter(Log.timestamp >= start_date)

        if end_date:
            query = query.filter(Log.timestamp <= end_date)

        if source:
            query = query.filter(Log.source.ilike(f"%{source}%"))

        total_logs = query.count()
        logs_last_24_hours = query.filter(
            Log.timestamp >= datetime.now(timezone.utc) - timedelta(hours=24)
        ).count()
        error_count = query.filter(Log.severity == SeverityLevel.ERROR.value).count()
        warning_count = query.filter(Log.severity == SeverityLevel.WARN.value).count()
        unique_sources = query.with_entities(func.count(func.distinct(Log.source))).scalar() or 0

        error_rate = round((error_count / total_logs) * 100, 2) if total_logs else 0.0

        return {
            "total_logs": total_logs,
            "logs_last_24_hours": logs_last_24_hours,
            "error_count": error_count,
            "warning_count": warning_count,
            "unique_sources": unique_sources,
            "error_rate": error_rate,
        }

    @staticmethod
    def get_top_sources(
        db: Session,
        limit: int = 5,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        severity: Optional[SeverityLevel] = None,
    ) -> Tuple[List[dict], int]:
        """
        Get the most active log sources.
        """
        query = db.query(Log)

        if start_date:
            query = query.filter(Log.timestamp >= start_date)

        if end_date:
            query = query.filter(Log.timestamp <= end_date)

        if severity:
            query = query.filter(Log.severity == severity.value)

        total = query.count()
        if total == 0:
            return [], 0

        results = (
            query.with_entities(
                Log.source.label("source"),
                func.count(Log.id).label("count"),
            )
            .group_by(Log.source)
            .order_by(desc("count"), Log.source.asc())
            .limit(limit)
            .all()
        )

        return [
            {
                "source": result.source,
                "count": result.count,
                "percentage": round((result.count / total) * 100, 2),
            }
            for result in results
        ], total


# Singleton instance
log_crud = LogCRUD()
