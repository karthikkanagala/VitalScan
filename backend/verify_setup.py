#!/usr/bin/env python
"""
VitalScan Backend Verification Script
Tests database, Redis, and models to ensure everything is ready.
Run this before starting the backend server.

Usage:
    python verify_setup.py
"""

import os
import sys
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def check_python_version():
    """Check Python version."""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        logger.info(f"✅ Python version: {version.major}.{version.minor}.{version.micro}")
        return True
    else:
        logger.error(f"❌ Python 3.8+ required. Found: {version.major}.{version.minor}")
        return False


def check_dependencies():
    """Check if required packages are installed."""
    required = [
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'psycopg2',
        'redis',
        'joblib',
        'pydantic',
        'passlib',
        'jose'
    ]
    
    missing = []
    for package in required:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing.append(package)
    
    if not missing:
        logger.info(f"✅ All required packages installed")
        return True
    else:
        logger.error(f"❌ Missing packages: {', '.join(missing)}")
        logger.info("   Run: pip install -r requirements.txt")
        return False


def check_env_file():
    """Check if .env file exists."""
    env_path = Path(".env")
    if env_path.exists():
        logger.info("✅ .env file found")
        return True
    else:
        logger.warning("⚠️  .env file not found")
        logger.info("   Create .env file with:")
        logger.info("   DATABASE_URL=postgresql://postgres:password@localhost:5432/vitalscan")
        logger.info("   REDIS_URL=redis://localhost:6379")
        logger.info("   SECRET_KEY=your_secret_key")
        return False


def check_database():
    """Test PostgreSQL connection."""
    try:
        from sqlalchemy import create_engine
        from dotenv import load_dotenv
        
        load_dotenv()
        db_url = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/vitalscan')
        
        engine = create_engine(db_url, pool_pre_ping=True)
        with engine.connect() as conn:
            logger.info("✅ PostgreSQL connected")
            return True
    except Exception as e:
        logger.error(f"❌ PostgreSQL connection failed: {e}")
        logger.info("   Make sure:")
        logger.info("   1. PostgreSQL is running (port 5432)")
        logger.info("   2. Database 'vitalscan' exists")
        logger.info("   3. .env has correct DATABASE_URL with your password")
        return False


def check_redis():
    """Test Redis connection."""
    try:
        from redis import Redis
        from dotenv import load_dotenv
        
        load_dotenv()
        redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
        
        client = Redis.from_url(redis_url, decode_responses=True, socket_connect_timeout=5)
        client.ping()
        logger.info("✅ Redis connected")
        return True
    except Exception as e:
        logger.warning(f"⚠️  Redis connection failed: {e}")
        logger.info("   Make sure Redis is running (port 6379)")
        logger.info("   The app will work without Redis (caching disabled)")
        return False


def check_models():
    """Check if ML models exist."""
    models_dir = Path("models")
    heart_model = models_dir / "heart_model.pkl"
    diabetes_model = models_dir / "diabetes_model.pkl"
    
    heart_exists = heart_model.exists()
    diabetes_exists = diabetes_model.exists()
    
    if heart_exists:
        logger.info("✅ Heart model found")
    else:
        logger.warning("⚠️  Heart model not found (using fallback calculations)")
    
    if diabetes_exists:
        logger.info("✅ Diabetes model found")
    else:
        logger.warning("⚠️  Diabetes model not found (using fallback calculations)")
    
    return heart_exists or diabetes_exists


def check_file_structure():
    """Check if required directories exist."""
    required_dirs = [
        'app',
        'app/routes',
        'app/utils',
        'models',
        'data'
    ]
    
    missing = []
    for dir_path in required_dirs:
        if not Path(dir_path).exists():
            missing.append(dir_path)
    
    if not missing:
        logger.info("✅ File structure correct")
        return True
    else:
        logger.error(f"❌ Missing directories: {', '.join(missing)}")
        return False


def main():
    """Run all checks."""
    logger.info("=" * 50)
    logger.info("VitalScan Backend Verification")
    logger.info("=" * 50)
    
    checks = [
        ("Python Version", check_python_version),
        ("File Structure", check_file_structure),
        ("Dependencies", check_dependencies),
        ("Environment File", check_env_file),
        ("PostgreSQL Database", check_database),
        ("Redis Cache", check_redis),
        ("ML Models", check_models),
    ]
    
    results = []
    for name, check_func in checks:
        logger.info(f"\nChecking {name}...")
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            logger.error(f"Check failed: {e}")
            results.append((name, False))
    
    # Summary
    logger.info("\n" + "=" * 50)
    logger.info("SUMMARY")
    logger.info("=" * 50)
    
    for name, result in results:
        status = "✅" if result else "❌"
        logger.info(f"{status} {name}")
    
    critical_passed = all(
        results[i][1] for i in [0, 1, 2, 3, 4]  # Python, Files, Deps, Env, DB
    )
    
    if critical_passed:
        logger.info("\n🟢 Backend is ready to start!")
        logger.info("Run: python -m uvicorn app.main:app --reload --port 8000")
        return 0
    else:
        logger.info("\n🔴 Fix the issues above before starting the backend")
        return 1


if __name__ == "__main__":
    sys.exit(main())
