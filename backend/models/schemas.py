"""
Schémas Pydantic pour la validation des données
"""
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime, date, time
from typing import Optional, List
from enum import Enum


# ============================================
# Enums
# ============================================
class RoleEnum(str, Enum):
    ADMIN = "admin"
    PROF = "prof"
    STUDENT = "student"


class StatusEnum(str, Enum):
    PRESENT = "Présent"
    ABSENT = "Absent"


# ============================================
# Auth Schemas
# ============================================
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


# ============================================
# User Schemas
# ============================================
class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None


class UserCreate(BaseModel):
    username: str
    password: str
    full_name: Optional[str] = None
    role_id: int


class UserResponse(BaseModel):
    user_id: int
    username: str
    full_name: Optional[str]
    role_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# Student Schemas
# ============================================
class StudentBase(BaseModel):
    full_name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    enrollment_number: Optional[str] = None


class StudentCreate(StudentBase):
    pass


class StudentRegister(StudentBase):
    """Schema pour l'inscription d'un étudiant avec login"""
    username: str
    password: str
    
    @validator('username')
    def username_must_be_valid(cls, v):
        if len(v) < 3:
            raise ValueError('Le nom d\'utilisateur doit contenir au moins 3 caractères')
        return v
    
    @validator('password')
    def password_must_be_strong(cls, v):
        if len(v) < 6:
            raise ValueError('Le mot de passe doit contenir au moins 6 caractères')
        return v


class StudentResponse(StudentBase):
    student_id: int
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True


class StudentWithLogin(StudentResponse):
    username: Optional[str] = None
    has_images: bool = False
    image_count: int = 0


# ============================================
# Student Login Schemas
# ============================================
class StudentLoginCreate(BaseModel):
    student_id: int
    username: str
    password: str


class StudentLoginResponse(BaseModel):
    login_id: int
    student_id: int
    username: str
    created_at: datetime
    last_login: Optional[datetime]

    class Config:
        from_attributes = True


# ============================================
# Training Image Schemas
# ============================================
class TrainingImageBase(BaseModel):
    student_id: int
    image_path: str


class TrainingImageCreate(TrainingImageBase):
    pass


class TrainingImageResponse(TrainingImageBase):
    image_id: int
    captured_at: datetime
    is_verified: bool

    class Config:
        from_attributes = True


# ============================================
# Face Capture Schemas
# ============================================
class FaceCaptureRequest(BaseModel):
    """Requête pour capturer les images du visage lors de l'inscription"""
    student_id: int
    images_base64: List[str] = Field(..., min_items=1, max_items=30)
    
    @validator('images_base64')
    def validate_images(cls, v):
        if len(v) < 10:
            raise ValueError('Au moins 10 images sont requises pour un bon entraînement')
        return v


class FaceCaptureResponse(BaseModel):
    success: bool
    message: str
    student_id: int
    images_saved: int
    dataset_path: str


# ============================================
# Course Schemas
# ============================================
class CourseBase(BaseModel):
    course_name: str
    course_code: Optional[str] = None
    description: Optional[str] = None
    credits: Optional[int] = None


class CourseCreate(CourseBase):
    prof_id: int


class CourseResponse(CourseBase):
    course_id: int
    prof_id: int
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True


class CourseWithProfessor(CourseResponse):
    professor_name: Optional[str] = None


# ============================================
# Session Schemas
# ============================================
class SessionBase(BaseModel):
    course_id: int
    session_date: date
    start_time: time
    end_time: time
    location: Optional[str] = None


class SessionCreate(SessionBase):
    pass


class SessionResponse(SessionBase):
    session_id: int
    created_at: datetime
    is_completed: bool

    class Config:
        from_attributes = True


class SessionWithCourse(SessionResponse):
    course_name: Optional[str] = None
    professor_name: Optional[str] = None


# ============================================
# Attendance Schemas
# ============================================
class AttendanceBase(BaseModel):
    student_id: int
    session_id: int
    status: StatusEnum


class AttendanceCreate(AttendanceBase):
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    detection_method: Optional[str] = "facial_recognition"


class AttendanceResponse(AttendanceBase):
    attendance_id: int
    confidence: Optional[float]
    detected_at: datetime
    detection_method: Optional[str]

    class Config:
        from_attributes = True


class AttendanceWithDetails(AttendanceResponse):
    student_name: Optional[str] = None
    course_name: Optional[str] = None
    session_date: Optional[date] = None


class AttendanceStats(BaseModel):
    student_id: int
    student_name: str
    total_sessions: int
    present_count: int
    absent_count: int
    attendance_percentage: float


# ============================================
# Enrollment Schemas
# ============================================
class CourseEnrollmentCreate(BaseModel):
    student_id: int
    course_id: int


class EnrollmentResponse(BaseModel):
    enrollment_id: int
    student_id: int
    course_id: int
    enrolled_at: datetime

    class Config:
        from_attributes = True


# ============================================
# Log Schemas
# ============================================
class LogCreate(BaseModel):
    user_id: Optional[int] = None
    action: str
    details: Optional[str] = None
    ip_address: Optional[str] = None


class LogResponse(BaseModel):
    log_id: int
    user_id: Optional[int]
    action: str
    details: Optional[str]
    ip_address: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True


# ============================================
# Notification Schemas
# ============================================
class NotificationCreate(BaseModel):
    user_id: int
    message: str
    notification_type: Optional[str] = "info"


class NotificationResponse(BaseModel):
    notification_id: int
    user_id: int
    message: str
    notification_type: Optional[str]
    read_status: bool
    created_at: datetime
    read_at: Optional[datetime]

    class Config:
        from_attributes = True


# ============================================
# Recognition Schemas
# ============================================
class FaceRecognitionRequest(BaseModel):
    """Requête pour reconnaissance faciale en temps réel"""
    session_id: int
    image_base64: str


class FaceRecognitionResponse(BaseModel):
    success: bool
    message: str
    detected_students: List[dict] = []
    attendance_marked: List[int] = []


# ============================================
# Dashboard Schemas
# ============================================
class StudentDashboard(BaseModel):
    student: StudentResponse
    total_courses: int
    total_sessions: int
    present_count: int
    absent_count: int
    attendance_rate: float
    recent_attendances: List[AttendanceWithDetails]


class ProfessorDashboard(BaseModel):
    professor: UserResponse
    total_courses: int
    total_sessions: int
    upcoming_sessions: List[SessionWithCourse]
    recent_attendances: List[AttendanceWithDetails]


class AdminStatsResponse(BaseModel):
    total_students: int
    total_professors: int
    total_courses: int
    total_sessions: int
    active_students: int
    active_courses: int


class ProfessorStatsResponse(BaseModel):
    total_courses: int
    total_sessions: int
    upcoming_sessions: int
    students_enrolled: int
