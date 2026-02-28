import time
import uuid

from fastapi import APIRouter, HTTPException, Response

from jose import jwt

from app.core.config import settings
from app.core.security import verify_password
from app.models.schemas import GateAuthResponse, GatePasswordPayload, UserSession
from app.services.config_service import get_site_config

router = APIRouter()


@router.post("/auth/gate")
async def gate_auth(payload: GatePasswordPayload, response: Response):
    config = get_site_config()
    stored_password = config.get("password", "")

    if not verify_password(payload.password, stored_password):
        raise HTTPException(status_code=401, detail="Invalid password")

    now = int(time.time())
    expire = now + (settings.SESSION_EXPIRE_HOURS * 3600)
    session_id = str(uuid.uuid4())

    session = UserSession(
        sessionId=session_id,
        grantedAt=now,
        expiresAt=expire,
        isAuthenticated=True,
    )

    token = jwt.encode(
        {"sub": session_id, "exp": expire},
        settings.SESSION_SECRET,
        algorithm="HS256",
    )

    response.set_cookie(
        key="karisma_session",
        value=token,
        httponly=True,
        max_age=settings.SESSION_EXPIRE_HOURS * 3600,
        samesite="lax",
        # secure=True,  # Enable in production (HTTPS required)
    )

    return GateAuthResponse(success=True, session=session)
