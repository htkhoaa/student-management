from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    JWT_TOKEN_EXPIRATION: int
    DATABASE_URL: str
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

settings = Settings()