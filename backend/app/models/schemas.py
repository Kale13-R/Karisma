from pydantic import BaseModel
from typing import Optional, List


class GatePasswordPayload(BaseModel):
    password: str


class UserSession(BaseModel):
    sessionId: str
    grantedAt: int
    expiresAt: int
    isAuthenticated: bool


class GateAuthResponse(BaseModel):
    success: bool
    session: Optional[UserSession] = None
    error: Optional[str] = None


class Product(BaseModel):
    id: str
    name: str
    price: float
    description: str
    imageUrl: str
    sizes: List[str]
    inStock: bool
    dropId: str


class CartItem(BaseModel):
    product: Product
    size: str
    quantity: int
