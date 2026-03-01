import logging
import hashlib
import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db, get_redis
from ..schemas import VitalScanInput, SimulationInput, RiskOutput, RiskSessionOut
from ..models_db import User, RiskSession
from ..utils.predict import run_prediction
from ..utils.auth_utils import get_current_user, get_optional_current_user

router = APIRouter(prefix="/api", tags=["Health Assessment"])
logger = logging.getLogger(__name__)


def get_redis_key(data: VitalScanInput) -> str:
    """Generate cache key from input data hash."""
    data_str = json.dumps(data.dict(), sort_keys=True)
    return f"prediction:{hashlib.sha256(data_str.encode()).hexdigest()}"


@router.post("/predict", response_model=RiskOutput)
async def predict(
    data: VitalScanInput,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Calculate health risk scores from user health data.
    
    Endpoint works with or without authentication. If authenticated, saves session to database.
    
    Request:
        - VitalScanInput: All health factors
    
    Response:
        - RiskOutput: Risk scores, labels, alerts, and action plan
    
    Raises:
        - 400: Invalid input data
        - 500: Prediction error
    """
    try:
        logger.info(f"Prediction request received for user_id={current_user.id if current_user else 'anonymous'}")
        
        # Run ML prediction
        risk_output = run_prediction(data)
        
        # If user is authenticated, save session to database
        if current_user:
            try:
                risk_session = RiskSession(
                    user_id=current_user.id,
                    age=data.age,
                    sex=data.sex,
                    height_cm=data.height_cm,
                    weight_kg=data.weight_kg,
                    waist_cm=data.waist_cm,
                    family_history_heart=data.family_history_heart,
                    family_history_diabetes=data.family_history_diabetes,
                    smoking_status=data.smoking_status,
                    physical_activity=data.physical_activity,
                    sleep_hours=data.sleep_hours,
                    stress_level=data.stress_level,
                    sugar_intake=data.sugar_intake,
                    fried_food=data.fried_food,
                    water_intake=data.water_intake,
                    screen_time=data.screen_time,
                    chest_discomfort=data.chest_discomfort,
                    thirst_fatigue=data.thirst_fatigue,
                    salt_intake=data.salt_intake,
                    heart_risk_score=risk_output.heart_risk_score,
                    diabetes_risk_score=risk_output.diabetes_risk_score,
                    obesity_risk_score=risk_output.obesity_risk_score,
                    obesity_category=risk_output.obesity_category
                )
                db.add(risk_session)
                db.commit()
                logger.info(f"Risk session saved for user {current_user.id}")
            except Exception as e:
                logger.warning(f"Failed to save risk session: {e}")
                db.rollback()
        
        return risk_output
    
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Risk assessment failed"
        )


@router.post("/simulate", response_model=RiskOutput)
async def simulate(
    data: SimulationInput,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Simulate lifestyle changes and see impact on risk scores.
    
    Caching optimization:
    - Check Redis cache first (TTL 300 seconds)
    - If cached: return instantly (< 100ms)
    - If not cached: run prediction, cache result, return
    
    This is the "live slider" endpoint — must be fast.
    
    Request:
        - SimulationInput: same as VitalScanInput
    
    Response:
        - RiskOutput: Updated risk scores
    
    Raises:
        - 400: Invalid input
        - 500: Simulation error
    """
    try:
        cache_key = get_redis_key(data)
        redis_client = get_redis()
        
        # Try to get cached result
        if redis_client:
            try:
                cached_result = redis_client.get(cache_key)
                if cached_result:
                    logger.info(f"Cache hit for simulation")
                    cached_data = json.loads(cached_result)
                    return RiskOutput(**cached_data)
            except Exception as e:
                logger.warning(f"Cache retrieval failed: {e}")
        
        # Cache miss or Redis unavailable — run prediction
        logger.info(f"Running simulation for user_id={current_user.id if current_user else 'anonymous'}")
        risk_output = run_prediction(data)
        
        # Try to cache result (TTL 300 seconds)
        if redis_client:
            try:
                redis_client.setex(
                    cache_key,
                    300,  # TTL in seconds
                    json.dumps(risk_output.dict())
                )
                logger.info(f"Simulation result cached")
            except Exception as e:
                logger.warning(f"Cache storage failed: {e}")
        
        return risk_output
    
    except Exception as e:
        logger.error(f"Simulation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Simulation failed"
        )


@router.get("/history", response_model=List[RiskSessionOut])
async def get_history(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get user's risk assessment history.
    
    Requires: Valid JWT token (authenticated users only)
    
    Query Parameters:
        - limit: Number of sessions to return (default 10, max 50)
    
    Response:
        - List of RiskSessionOut: User's previous assessments
    
    Raises:
        - 401: Not authenticated
        - 500: Database error
    """
    try:
        # Validate limit
        limit = min(limit, 50)  # Cap at 50 to prevent abuse
        
        logger.info(f"Fetching history for user {current_user.id}")
        
        # Query sessions ordered by creation time (newest first)
        sessions = db.query(RiskSession).filter(
            RiskSession.user_id == current_user.id
        ).order_by(
            RiskSession.created_at.desc()
        ).limit(limit).all()
        
        logger.info(f"Found {len(sessions)} sessions for user {current_user.id}")
        
        return sessions
    
    except Exception as e:
        logger.error(f"History fetch error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch history"
        )
