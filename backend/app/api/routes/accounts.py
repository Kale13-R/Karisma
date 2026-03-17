import time
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password, verify_password_hash
from app.db import models
from app.db.base import get_db
from app.models.schemas import AccountAuthResponse, UserLogin, UserProfile, UserRegister
from app.services.email_service import send_welcome_email

router = APIRouter()


def _make_user_token(user_id: int, email: str) -> tuple[str, int]:
    expire = int(time.time()) + (settings.SESSION_EXPIRE_HOURS * 3600)
    token = jwt.encode(
        {"sub": str(user_id), "email": email, "exp": expire, "type": "user"},
        settings.SESSION_SECRET,
        algorithm="HS256",
    )
    return token, expire


def _set_user_cookie(response: Response, token: str, max_age: int) -> None:
    response.set_cookie(
        key="karisma_user",
        value=token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=max_age,
        path="/",
    )


def get_current_user(request: Request, db: Session = Depends(get_db)) -> models.User:
    token = request.cookies.get("karisma_user")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, settings.SESSION_SECRET, algorithms=["HS256"])
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid session")
    user = db.query(models.User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.post("/accounts/register", response_model=AccountAuthResponse)
def register(payload: UserRegister, response: Response, db: Session = Depends(get_db)):
    if not payload.email or not payload.password:
        raise HTTPException(status_code=422, detail="Email and password are required")
    if len(payload.password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")

    existing = db.query(models.User).filter_by(email=payload.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    user = models.User(
        email=payload.email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token, expire = _make_user_token(user.id, user.email)
    _set_user_cookie(response, token, settings.SESSION_EXPIRE_HOURS * 3600)

    send_welcome_email(user.email)

    return AccountAuthResponse(
        success=True,
        user=UserProfile(
            id=user.id,
            email=user.email,
            created_at=str(user.created_at),
        ),
    )


@router.post("/accounts/login", response_model=AccountAuthResponse)
def login(payload: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(email=payload.email).first()
    if not user or not verify_password_hash(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token, _ = _make_user_token(user.id, user.email)
    _set_user_cookie(response, token, settings.SESSION_EXPIRE_HOURS * 3600)

    return AccountAuthResponse(
        success=True,
        user=UserProfile(
            id=user.id,
            email=user.email,
            created_at=str(user.created_at),
        ),
    )


@router.post("/accounts/logout")
def logout(response: Response):
    response.delete_cookie(key="karisma_user", path="/")
    return {"success": True}


@router.get("/accounts/me", response_model=AccountAuthResponse)
def me(user: models.User = Depends(get_current_user)):
    return AccountAuthResponse(
        success=True,
        user=UserProfile(
            id=user.id,
            email=user.email,
            created_at=str(user.created_at),
        ),
    )
