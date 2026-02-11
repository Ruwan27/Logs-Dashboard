import pytest
from datetime import datetime, timezone
from uuid import uuid4
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.main import app
from app.core.database import Base, get_db
from app.models.log import Log


# Use SQLite for testing (in-memory)
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database override."""
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def sample_log_data():
    """Sample log data for testing."""
    return {
        "message": "Test log message",
        "severity": "INFO",
        "source": "test-service"
    }


@pytest.fixture
def sample_logs(db_session):
    """Create sample logs in the database."""
    logs = [
        Log(
            id=uuid4(),
            message=f"Test message {i}",
            severity=["DEBUG", "INFO", "WARN", "ERROR"][i % 4],
            source=f"service-{i % 3}",
            timestamp=datetime(2026, 1, i + 1, 12, 0, 0, tzinfo=timezone.utc),
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        for i in range(10)
    ]
    
    for log in logs:
        db_session.add(log)
    db_session.commit()
    
    return logs
