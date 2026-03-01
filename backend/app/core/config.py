from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    GATE_PASSWORD: str = ""
    SESSION_SECRET: str = "changeme-use-a-long-random-string-in-production"
    SESSION_EXPIRE_HOURS: int = 24
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    VERCEL_URL: str = ""  # injected by Vercel as env var; set in Railway to match production domain
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    STRIPE_CURRENCY: str = "usd"
    RESEND_API_KEY: str = ""
    RESEND_FROM_EMAIL: str = "orders@karisma.com"
    ADMIN_SECRET: str = ""
    DATABASE_URL: str = "sqlite:///./karisma.db"
    ENVIRONMENT: str = "development"


settings = Settings()
