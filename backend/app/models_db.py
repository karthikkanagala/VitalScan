from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from .database import Base

class User(Base):
    """User account model."""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    risk_sessions = relationship("RiskSession", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.email}>"


class RiskSession(Base):
    """Health risk assessment session."""
    __tablename__ = "risk_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)

    # Personal Information
    age = Column(Float, nullable=False)
    sex = Column(String(50), nullable=False)
    height_cm = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    waist_cm = Column(Float, nullable=False)

    # Medical History
    family_history_heart = Column(Boolean, nullable=False, default=False)
    family_history_diabetes = Column(Boolean, nullable=False, default=False)
    smoking_status = Column(String(50), nullable=False)

    # Lifestyle Factors
    physical_activity = Column(String(50), nullable=False)
    sleep_hours = Column(String(50), nullable=False)
    stress_level = Column(String(50), nullable=False)
    sugar_intake = Column(String(50), nullable=False)
    fried_food = Column(String(50), nullable=False)
    water_intake = Column(String(50), nullable=False)
    screen_time = Column(String(50), nullable=False)

    # Symptoms
    chest_discomfort = Column(String(50), nullable=False)
    thirst_fatigue = Column(String(50), nullable=False)
    salt_intake = Column(String(50), nullable=False)

    # Risk Scores
    heart_risk_score = Column(Float, nullable=False)
    diabetes_risk_score = Column(Float, nullable=False)
    obesity_risk_score = Column(Float, nullable=False)
    obesity_category = Column(String(100), nullable=False)

    # Metadata
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="risk_sessions")

    def __repr__(self):
        return f"<RiskSession user_id={self.user_id} created_at={self.created_at}>"


# Create indexes for faster querying
__table_args__ = (
    Index('idx_user_created', 'user_id', 'created_at'),
)
