from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")

    GATE_PASSWORD: str
    SESSION_SECRET: str
    SESSION_EXPIRE_HOURS: int = 24
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]


settings = Settings()
