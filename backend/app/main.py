"""
FastAPI application entry point.
"""
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.core.logging_config import logger
from app.crud.user import user_crud
from app.routers import analytics, health, logs, saved_searches, users

MAX_DB_RETRIES = 10
DB_RETRY_INTERVAL = 5  # seconds


def wait_for_db():
    """Wait for database to be available before proceeding."""
    for attempt in range(1, MAX_DB_RETRIES + 1):
        try:
            conn = engine.connect()
            conn.close()
            logger.info("Database connection established (attempt %d)", attempt)
            return
        except Exception as e:
            logger.warning(
                "Database not ready (attempt %d/%d): %s",
                attempt, MAX_DB_RETRIES, str(e),
            )
            if attempt < MAX_DB_RETRIES:
                time.sleep(DB_RETRY_INTERVAL)
    raise RuntimeError("Could not connect to database after %d attempts" % MAX_DB_RETRIES)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Creates database tables on startup and ensures the default guest user exists.
    """
    logger.info("Starting up Logs Dashboard API...")
    
    if not settings.TESTING:
        # Wait for database to be ready
        wait_for_db()

        # Create database tables
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error("Failed to create database tables: %s", str(e))
            raise

        # Ensure default guest user exists
        db = SessionLocal()
        try:
            user_crud.get_or_create_default_guest(db)
            logger.info("Default guest user ready")
        except Exception as e:
            logger.error("Failed to create default guest user: %s", str(e))
            raise
        finally:
            db.close()
    
    yield
    
    logger.info("Shutting down Logs Dashboard API...")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
    ## Logs Dashboard API
    
    A comprehensive REST API for managing application logs.
    
    ### Features:
    - Create, read, update, and delete log entries
    - Search and filter logs by various criteria
    - Time-series analytics for log visualization
    - CSV export functionality
    - Severity distribution analytics
    
    ### Severity Levels:
    - **DEBUG**: Detailed debugging information
    - **INFO**: General informational messages
    - **WARN**: Warning messages for potential issues
    - **ERROR**: Error messages for failures
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
origins = settings.CORS_ORIGINS.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(logs.router)
app.include_router(analytics.router)
app.include_router(saved_searches.router)
app.include_router(users.router)


@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
