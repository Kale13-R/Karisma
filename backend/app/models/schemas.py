from pydantic import BaseModel
from typing import Optional


class GatePasswordPayload(BaseModel):
    password: str


class UserSession(BaseModel):
    session_id: str
    granted_at: int
    expires_at: int
    is_authenticated: bool


class GateAuthResponse(BaseModel):
    success: bool
    session: Optional[UserSession] = None
    error: Optional[str] = None
