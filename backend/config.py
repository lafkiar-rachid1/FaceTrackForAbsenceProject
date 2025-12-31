"""
Configuration de l'application
"""
from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "FaceTrack Absence System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/facetrack_db"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS (string séparé par des virgules, sera converti en liste)
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convertir CORS_ORIGINS string en liste"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    # Face Recognition
    DATASET_DIR: str = "dataset"
    MODELS_DIR: str = "models"
    ATTENDANCE_DIR: str = "attendance"
    FACE_MODEL: str = "Facenet"  # DeepFace model
    DETECTOR_BACKEND: str = "opencv"
    MIN_IMAGES_FOR_TRAINING: int = 10
    MAX_IMAGES_PER_STUDENT: int = 30
    
    # Upload
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
