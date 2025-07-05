from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    db_user: str = "postgres"
    db_password: str = "441788"
    db_host: str = "localhost"
    db_port: str = "5432"
    db_name: str = "uniplatform"

    @property
    def sync_url(self):
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"

    @property
    def admin_url(self):
        return f"postgresql+asyncpg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/postgres"

    class Config:
        env_file = ".env"

settings = Settings()
