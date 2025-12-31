"""
Fichier __init__.py pour les modèles
"""
from .database_models import (
    Role, User, Student, StudentLogin, TrainingImage,
    Course, Session, Attendance, Log, Notification, CourseEnrollment
)
from .schemas import (
    Token, TokenData, LoginRequest,
    UserCreate, UserResponse,
    StudentCreate, StudentRegister, StudentResponse, StudentWithLogin,
    StudentLoginCreate, StudentLoginResponse,
    TrainingImageCreate, TrainingImageResponse,
    FaceCaptureRequest, FaceCaptureResponse,
    CourseCreate, CourseResponse, CourseWithProfessor,
    SessionCreate, SessionResponse, SessionWithCourse,
    AttendanceCreate, AttendanceResponse, AttendanceWithDetails, AttendanceStats,
    CourseEnrollmentCreate, EnrollmentResponse,
    LogCreate, LogResponse,
    NotificationCreate, NotificationResponse,
    FaceRecognitionRequest, FaceRecognitionResponse,
    StudentDashboard, ProfessorDashboard,
    AdminStatsResponse, ProfessorStatsResponse
)

__all__ = [
    # Database models
    "Role", "User", "Student", "StudentLogin", "TrainingImage",
    "Course", "Session", "Attendance", "Log", "Notification", "CourseEnrollment",
    
    # Schemas
    "Token", "TokenData", "LoginRequest",
    "UserCreate", "UserResponse",
    "StudentCreate", "StudentRegister", "StudentResponse", "StudentWithLogin",
    "StudentLoginCreate", "StudentLoginResponse",
    "TrainingImageCreate", "TrainingImageResponse",
    "FaceCaptureRequest", "FaceCaptureResponse",
    "CourseCreate", "CourseResponse", "CourseWithProfessor",
    "SessionCreate", "SessionResponse", "SessionWithCourse",
    "AttendanceCreate", "AttendanceResponse", "AttendanceWithDetails", "AttendanceStats",
    "CourseEnrollmentCreate", "EnrollmentResponse",
    "LogCreate", "LogResponse",
    "NotificationCreate", "NotificationResponse",
    "FaceRecognitionRequest", "FaceRecognitionResponse",
    "StudentDashboard", "ProfessorDashboard",
    "AdminStatsResponse", "ProfessorStatsResponse"
]
