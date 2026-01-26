 # App settings
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "3D CSV Visualizer"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")  # Environment (String)

    # URI Settings
    BACKEND_URI: str = os.getenv("BACKEND_URI", "http://localhost:8000")  # Backend URI (String)
    FRONTEND_URI: str = os.getenv("FRONTEND_URI")   # Frontend URI (String)
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def is_production(self):
        return self.ENVIRONMENT == "production"


settings = Settings()