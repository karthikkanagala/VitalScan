import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from redis import Redis
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/vitalscan")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# PostgreSQL Engine
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Test connection before using
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# SQLAlchemy Base for ORM models
Base = declarative_base()

# Database dependency for FastAPI
def get_db():
    """Dependency to get database session for routes."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Redis client
_redis_client = None

def get_redis() -> Redis:
    """Get Redis client instance. If Redis is down, log warning but don't crash."""
    global _redis_client
    
    if _redis_client is None:
        try:
            _redis_client = Redis.from_url(REDIS_URL, decode_responses=True)
            # Test connection
            _redis_client.ping()
            logger.info("Redis connected successfully")
        except Exception as e:
            logger.warning(f"Redis connection failed: {e}. Caching disabled but app will continue.")
            _redis_client = None
    
    return _redis_client

def test_redis_connection():
    """Test Redis connection without crashing app."""
    try:
        client = Redis.from_url(REDIS_URL, decode_responses=True, socket_connect_timeout=5)
        client.ping()
        return True
    except Exception as e:
        logger.warning(f"Redis not available: {e}")
        return False

def test_database_connection():
    """Test database connection."""
    try:
        with engine.connect() as connection:
            logger.info("Database connected successfully")
            return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False
