import os
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./vitalscan.db"  # fallback to SQLite if no PostgreSQL
)
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Fix for Render PostgreSQL URL format
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

try:
    from sqlalchemy import create_engine
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import sessionmaker

    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()

    def get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

except Exception as e:
    print(f"Database setup warning: {e}")

try:
    import redis as redis_lib
    redis_client = redis_lib.from_url(REDIS_URL, decode_responses=True)
except Exception as e:
    redis_client = None
    print(f"Redis connection warning: {e}")

def get_redis():
    return redis_client

def test_database_connection():
    try:
        with engine.connect() as connection:
            return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False

def test_redis_connection():
    try:
        if redis_client:
            redis_client.ping()
            return True
        return False
    except Exception as e:
        logger.warning(f"Redis not available: {e}")
        return False
