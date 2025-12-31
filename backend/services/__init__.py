"""
Fichier __init__.py pour services
"""
from .auth_service import AuthService
from .student_service import StudentService
from .face_service import FaceService

__all__ = ["AuthService", "StudentService", "FaceService"]
