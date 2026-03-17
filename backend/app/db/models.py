from sqlalchemy import Boolean, Column, Date, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func

from app.db.base import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    stripe_session_id = Column(String(255), unique=True, index=True)
    customer_email = Column(String(255), nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String(50), default="confirmed")
    items = Column(Text, nullable=True)  # JSON string of cart items
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Product(Base):
    __tablename__ = "products"

    id = Column(String(100), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(Text, default="")
    image_url = Column(String(500), default="")
    sizes = Column(Text)  # JSON string e.g. '["S","M","L","XL"]'
    in_stock = Column(Boolean, default=True)
    drop_id = Column(String(100), default="ss26")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(Text, unique=True)
    password_hash = Column(Text, nullable=False)
    created_at = Column(Date, nullable=False, server_default=func.current_date())


class SiteConfig(Base):
    __tablename__ = "site_config"

    id = Column(Integer, primary_key=True, default=1)
    drop_timestamp = Column(String(100), default="")
    gate_password = Column(String(255), nullable=False)
