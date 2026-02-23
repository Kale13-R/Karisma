import time
import uuid

from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
from jose import jwt

from app.core.config import settings
from app.core.security import verify_password
from app.models.schemas import GateAuthResponse, GatePasswordPayload, UserSession

router = APIRouter()


@router.post("/gate")
async def gate_auth(payload: GatePasswordPayload, response: Response) -> GateAuthResponse:
    if not verify_password(payload.password, settings.GATE_PASSWORD):
        return JSONResponse(
            status_code=401,
            content={"success": False, "error": "Invalid password"},
        )

    now = int(time.time())
    expires_at = now + (settings.SESSION_EXPIRE_HOURS * 3600)
    session_id = str(uuid.uuid4())

    token = jwt.encode(
        {
            "session_id": session_id,
            "granted_at": now,
            "expires_at": expires_at,
            "is_authenticated": True,
            "exp": expires_at,
        },
        settings.SESSION_SECRET,
        algorithm="HS256",
    )

    response.set_cookie(
        key="karisma_session",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=settings.SESSION_EXPIRE_HOURS * 3600,
        # secure=True  — enable in production (requires HTTPS)
    )

    return GateAuthResponse(
        success=True,
        session=UserSession(
            session_id=session_id,
            granted_at=now,
            expires_at=expires_at,
            is_authenticated=True,
        ),
    )
