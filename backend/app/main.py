import re
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, health, products
from app.api.routes.accounts import router as accounts_router
from app.api.routes.admin import router as admin_router
from app.api.routes.checkout import router as checkout_router
from app.api.routes.webhooks import router as webhooks_router
from app.core.config import settings
from app.db.base import Base, engine
from app.db import seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed initial data
    Base.metadata.create_all(bind=engine)
    seed.seed()
    yield
    # Shutdown: nothing to clean up for SQLite


def is_allowed_origin(origin: str) -> bool:
    # Always allow localhost
    if origin.startswith("http://localhost"):
        return True
    # Allow any Vercel preview or production URL for this project
    if re.match(r"https://karisma.*\.vercel\.app$", origin):
        return True
    # Allow custom domain when configured
    if settings.VERCEL_URL and origin == f"https://{settings.VERCEL_URL}":
        return True
    return False


app = FastAPI(title="Karisma API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://localhost:\d+|https://karisma.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(health.router)
app.include_router(products.router)
app.include_router(accounts_router, prefix="/api")
app.include_router(checkout_router, prefix="/api")
app.include_router(webhooks_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
