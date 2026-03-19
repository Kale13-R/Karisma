from pydantic import BaseModel, EmailStr
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


class UserRegister(BaseModel):
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfile(BaseModel):
    id: int
    email: str
    created_at: str  # ISO date string


class AccountAuthResponse(BaseModel):
    success: bool
    user: Optional[UserProfile] = None
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


class CheckoutRequest(BaseModel):
    cart_items: List[CartItem]
    base_url: str


class CheckoutResponse(BaseModel):
    checkout_url: str


class PaymentIntentRequest(BaseModel):
    cart_items: List[CartItem]


class PaymentIntentResponse(BaseModel):
    client_secret: str
