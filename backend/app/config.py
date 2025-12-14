from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 5242880  # 5MB
    
    # Face Recognition
    FACE_RECOGNITION_TOLERANCE: float = 0.6
    
    class Config:
        env_file = ".env"

settings = Settings()
