# backend/auth_utils.py
# Password hashing, JWT creation/verification, and
# reusable FastAPI dependencies (get_current_user, require_admin)

from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlmodel import Session, select

from database import get_session
from models import User

# -------------------------------------------------------
# Config — in production move these to environment variables
# -------------------------------------------------------
SECRET_KEY = "change-this-to-a-long-random-secret-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# -------------------------------------------------------
# Password hashing
# -------------------------------------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# -----------------------------------------------------
# JWT
# -----------------------------------------------------
def create_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    payload = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    payload.update({"exp": expire})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# -------------------------------------------------------
# FastAPI dependency — extracts the current user's email from JWT
# -------------------------------------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
    """
    Dependency: validates the Bearer token and returns the email (subject).
    Raises 401 if the token is missing, expired, or invalid.
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
        return email
    except JWTError:
        raise credentials_exception


# -------------------------------------------------------
# FastAPI dependency — require the current user to be admin
# -------------------------------------------------------
def require_admin(
    current_user_email: str = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> User:
    """
    Dependency: validates JWT AND checks role == 'admin'.
    • 401 if token is invalid (raised by get_current_user)
    • 403 if the user exists but is not an admin
    Returns the full User object so admin routes can use it.
    """
    user = session.exec(select(User).where(User.email == current_user_email)).first()
    if not user or user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user
