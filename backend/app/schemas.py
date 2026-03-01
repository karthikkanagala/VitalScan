from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Optional, List
from datetime import datetime
from uuid import UUID

# ─────────────────────────────
# Authentication Schemas
# ─────────────────────────────

class UserCreate(BaseModel):
    """User registration schema."""
    full_name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=255)


class UserLogin(BaseModel):
    """User login schema."""
    email: EmailStr
    password: str


class Token(BaseModel):
    """JWT token response schema."""
    access_token: str
    token_type: str


class UserOut(BaseModel):
    """User output schema (no password)."""
    id: UUID
    full_name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────
# Health Assessment Schemas
# ─────────────────────────────

class VitalScanInput(BaseModel):
    """Input schema for health risk assessment."""
    
    # Personal Information
    age: int = Field(..., ge=18, le=80)
    sex: Literal["Male", "Female"]
    height_cm: float = Field(..., gt=100, lt=250)
    weight_kg: float = Field(..., gt=30, lt=200)
    waist_cm: float = Field(..., gt=40, lt=180)

    # Medical History
    family_history_heart: bool
    family_history_diabetes: bool
    smoking_status: Literal["Never", "Former", "Current"]

    # Lifestyle Factors
    physical_activity: Literal["Sedentary", "Light", "Moderate", "Active"]
    sleep_hours: Literal["<5", "5-6", "7-8", ">8"]
    stress_level: Literal["Low", "Moderate", "High"]
    sugar_intake: Literal["Low", "Moderate", "High"]
    fried_food: Literal["Rarely", "Sometimes", "Frequently"]
    water_intake: Literal["<1L", "1-2L", ">2L"]
    screen_time: Literal["<2hrs", "2-4hrs", ">4hrs"]

    # Symptoms
    chest_discomfort: Literal["Never", "Occasionally", "Frequently"]
    thirst_fatigue: Literal["Never", "Sometimes", "Often"]
    salt_intake: Literal["Low", "Moderate", "High"]


class SimulationInput(VitalScanInput):
    """Input schema for lifestyle simulation (same as VitalScanInput)."""
    pass


class RiskOutput(BaseModel):
    """Prediction output schema with risk scores and recommendations."""
    heart_risk_score: float = Field(..., ge=0, le=100)
    heart_risk_label: str  # Low / Moderate / High
    
    diabetes_risk_score: float = Field(..., ge=0, le=100)
    diabetes_risk_label: str
    
    obesity_risk_score: float = Field(..., ge=0, le=100)
    obesity_risk_label: str
    obesity_category: str  # WHO BMI category
    
    compounding_alert: bool
    compounding_message: str
    
    action_plan: List[str]  # Top 3 personalized actions


class RiskSessionOut(BaseModel):
    """Stored risk session from database."""
    id: UUID
    user_id: Optional[UUID]
    
    age: float
    sex: str
    height_cm: float
    weight_kg: float
    waist_cm: float
    
    family_history_heart: bool
    family_history_diabetes: bool
    smoking_status: str
    
    physical_activity: str
    sleep_hours: str
    stress_level: str
    sugar_intake: str
    fried_food: str
    water_intake: str
    screen_time: str
    
    chest_discomfort: str
    thirst_fatigue: str
    salt_intake: str
    
    heart_risk_score: float
    diabetes_risk_score: float
    obesity_risk_score: float
    obesity_category: str
    
    created_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────
# Error Responses
# ─────────────────────────────

class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    status_code: int
