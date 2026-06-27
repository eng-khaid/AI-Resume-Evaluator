# backend/routers/auth.py
# Day 4 — auth endpoints wired to the real SQLite database
#
# Three routes:
#   POST /auth/register  — create account, hash password, save to DB
#   POST /auth/login     — verify credentials, return JWT
#   GET  /auth/me        — return current user's email + role

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from auth_utils import (
    create_token,
    get_current_user,
    hash_password,
    verify_password,
)
from database import get_session
from models import LoginRequest, RegisterRequest, User, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


# ------------------------------------------------------
# POST /auth/register
# ------------------------------------------------------
@router.post("/register", status_code=201)
def register(data: RegisterRequest, session: Session = Depends(get_session)):
    """
    Create a new user account.

    The UNIQUE constraint on email means two simultaneous
    registrations with the same email cannot both succeed —
    the second INSERT raises IntegrityError which we catch
    and convert to a 400 response.
    """
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        # role defaults to "user" — no need to pass it
    )
    session.add(user)
    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    return {"message": "Registered successfully"}


# -------------------------------------------------------
# POST /auth/login
# -------------------------------------------------------
@router.post("/login")
def login(data: LoginRequest, session: Session = Depends(get_session)):
    """
    Verify credentials and return a JWT access token.

    Always returns the same 401 whether the email doesn't
    exist or the password is wrong — avoids leaking which
    emails are registered.
    """
    user = session.exec(select(User).where(User.email == data.email)).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


# -------------------------------------------------------
# GET /auth/me
# -------------------------------------------------------
@router.get("/me", response_model=UserResponse)
def get_me(
    current_user_email: str = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """
    Return the current user's public info (email + role).
    Requires a valid Bearer token.
    """
    user = session.exec(select(User).where(User.email == current_user_email)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(email=user.email, role=user.role)
