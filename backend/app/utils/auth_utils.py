import logging
from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from ..models_db import User
from ..database import get_db

load_dotenv()

logger = logging.getLogger(__name__)

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "vitalscan_secret_key_change_in_production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/signin")


def hash_password(password: str) -> str:
    """Hash a plain text password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT access token.
    
    Args:
        data: Payload to encode
        expires_delta: Token expiration time (uses default if None)
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    try:
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        logger.info(f"Token created for user {data.get('sub')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Token creation failed: {e}")
        raise


def verify_token(token: str) -> Dict:
    """
    Verify and decode JWT token.
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded payload
    
    Raises:
        HTTPException: If token is invalid or expired
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        
        if email is None:
            raise credentials_exception
        
        return payload
    except JWTError as e:
        logger.warning(f"Token verification failed: {e}")
        raise credentials_exception


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """
    Dependency to get current authenticated user from token.
    
    Args:
        token: JWT token from Authorization header
        db: Database session
    
    Returns:
        User object
    
    Raises:
        HTTPException: If token invalid or user not found
    """
    payload = verify_token(token)
    email: str = payload.get("sub")
    
    user = db.query(User).filter(User.email == email).first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


def get_optional_current_user(
    token: Optional[str] = Depends(OAuth2PasswordBearer(tokenUrl="/api/auth/signin", auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Dependency that returns the current user or None if not authenticated."""
    if token is None:
        return None
    try:
        payload = verify_token(token)
        email: str = payload.get("sub")
        if email is None:
            return None
        user = db.query(User).filter(User.email == email).first()
        return user
    except Exception:
        return None
