from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func

from app.db.base import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    stripe_session_id = Column(String, unique=True, index=True)
    customer_email = Column(String, nullable=False)
    total = Column(Float, nullable=False)
    status = Column(String, default="confirmed")
    items = Column(Text)  # JSON string of cart items
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String, default="")
    image_url = Column(String, default="")
    sizes = Column(Text)  # JSON string e.g. '["S","M","L","XL"]'
    in_stock = Column(Boolean, default=True)
    drop_id = Column(String, default="ss26")


class SiteConfig(Base):
    __tablename__ = "site_config"

    id = Column(Integer, primary_key=True, default=1)
    drop_timestamp = Column(String, default="")
    gate_password = Column(String, nullable=False)
