"""
VitalScan FastAPI Backend
A comprehensive health risk detection API powered by AI.

To run this backend:
1. cd backend
2. pip install -r requirements.txt
3. Make sure PostgreSQL is running and database 'vitalscan' exists:
   - createdb vitalscan
4. Make sure Redis is running:
   - redis-server (on port 6379)
5. Place heart_model.pkl and diabetes_model.pkl in backend/models/
6. Run: uvicorn app.main:app --reload --port 8000
7. API documentation available at: http://localhost:8000/docs

Environment Setup:
- Copy .env.example to .env and update DATABASE_URL, REDIS_URL, SECRET_KEY
- Ensure PostgreSQL user has password set
- Redis should be accessible at localhost:6379
"""

import logging
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import engine, Base, test_database_connection, test_redis_connection
from app.models_db import User, RiskSession
from app.routes import auth, predict

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="VitalScan API",
    description="AI-powered health risk detection system",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration - Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://vitalscan-frontend.onrender.com"  # add your render URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────
# Event Handlers
# ─────────────────────────────

@app.on_event("startup")
async def startup_event():
    """Create database tables and test connections on app startup."""
    logger.info("🚀 VitalScan API starting up...")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created/verified")
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {e}")
    
    # Test database connection
    if test_database_connection():
        logger.info("✅ PostgreSQL connected")
    else:
        logger.error("⚠️  PostgreSQL connection failed - some features may not work")
    
    # Test Redis connection
    if test_redis_connection():
        logger.info("✅ Redis connected")
    else:
        logger.warning("⚠️  Redis not available - caching disabled but app will continue")
    
    logger.info("🟢 VitalScan API ready!")


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown."""
    logger.info("🛑 VitalScan API shutting down...")


# ─────────────────────────────
# Root Endpoints
# ─────────────────────────────

@app.get("/", tags=["Info"])
async def root():
    """Root endpoint - API status."""
    return {
        "status": "VitalScan API running",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health", tags=["Info"])
async def health_check():
    """Health check endpoint - verify API, database, and Redis status."""
    db_connected = test_database_connection()
    redis_connected = test_redis_connection()
    
    return {
        "status": "ok" if (db_connected and redis_connected) else "degraded",
        "database": "connected" if db_connected else "disconnected",
        "redis": "connected" if redis_connected else "disconnected",
        "version": "1.0.0"
    }


# ─────────────────────────────
# Route Inclusion
# ─────────────────────────────

# Include authentication routes
app.include_router(auth.router)
logger.info("✓ Authentication routes loaded")

# Include prediction routes
app.include_router(predict.router)
logger.info("✓ Prediction routes loaded")


# ─────────────────────────────
# Error Handlers
# ─────────────────────────────

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    logger.warning(f"HTTP error {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Catch-all exception handler."""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    import uvicorn
    
    # Run: python -m uvicorn app.main:app --reload --port 8000
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
