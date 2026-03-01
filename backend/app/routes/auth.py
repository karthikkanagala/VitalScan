import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from ..database import get_db
from ..schemas import UserCreate, UserLogin, Token, UserOut
from ..models_db import User
from ..utils.auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account.
    
    Returns:
        - access_token: JWT token for authentication
        - token_type: "bearer"
    
    Raises:
        - 400: Email already registered
        - 500: Server error
    """
    try:
        # Check if email already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            logger.warning(f"Signup attempt with existing email: {user_data.email}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = hash_password(user_data.password)
        new_user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            hashed_password=hashed_password
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Create JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": new_user.email},
            expires_delta=access_token_expires
        )
        
        logger.info(f"User created successfully: {new_user.email}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Account creation failed"
        )


@router.post("/signin", response_model=Token)
def signin(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    User login endpoint.
    
    Returns:
        - access_token: JWT token for authentication
        - token_type: "bearer"
    
    Raises:
        - 401: Invalid email or password
        - 500: Server error
    """
    try:
        # Find user by email
        user = db.query(User).filter(User.email == credentials.email).first()
        
        if not user:
            logger.warning(f"Signin attempt with non-existent email: {credentials.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(credentials.password, user.hashed_password):
            logger.warning(f"Failed signin attempt for user: {credentials.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )
        
        logger.info(f"User signed in successfully: {user.email}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signin error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )


@router.get("/me", response_model=UserOut)
def get_current_user_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current authenticated user's information.
    
    Requires: Valid JWT token in Authorization header
    
    Returns:
        - User info (id, full_name, email, created_at)
    
    Raises:
        - 401: Invalid or missing token
        - 404: User not found
    """
    try:
        return current_user
    except Exception as e:
        logger.error(f"Error fetching user info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user information"
        )
