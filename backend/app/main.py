from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="VitalScan API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    try:
        from app.database import Base, engine
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created/verified")
    except Exception as e:
        logger.warning(f"Database connection warning: {e}")

@app.get("/")
def root():
    return {"status": "VitalScan API running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )

# Include routers
try:
    from app.routes import auth, predict
    app.include_router(auth.router)
    logger.info("✓ Authentication routes loaded")
    app.include_router(predict.router)
    logger.info("✓ Prediction routes loaded")
except Exception as e:
    logger.warning(f"Route loading warning: {e}")


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
