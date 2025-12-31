"""
Modèles de base de données SQLAlchemy
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Date, Time, Text, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.connection import Base


class Role(Base):
    __tablename__ = "roles"

    role_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role_name = Column(String(50), unique=True, nullable=False)

    # Relationships
    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role_id = Column(Integer, ForeignKey("roles.role_id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    role = relationship("Role", back_populates="users")
    courses = relationship("Course", back_populates="professor")
    logs = relationship("Log", back_populates="user")
    notifications = relationship("Notification", back_populates="user")


class Student(Base):
    __tablename__ = "students"

    student_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(20))
    enrollment_number = Column(String(50), unique=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    is_active = Column(Boolean, default=True)

    # Relationships
    login = relationship("StudentLogin", back_populates="student", uselist=False)
    training_images = relationship("TrainingImage", back_populates="student", cascade="all, delete-orphan")
    attendances = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    enrollments = relationship("CourseEnrollment", back_populates="student", cascade="all, delete-orphan")


class StudentLogin(Base):
    __tablename__ = "student_logins"

    login_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    last_login = Column(DateTime)

    # Relationships
    student = relationship("Student", back_populates="login")


class TrainingImage(Base):
    __tablename__ = "training_images"

    image_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False, index=True)
    image_path = Column(String(500), nullable=False)
    captured_at = Column(DateTime, server_default=func.now())
    is_verified = Column(Boolean, default=False)

    # Relationships
    student = relationship("Student", back_populates="training_images")


class Course(Base):
    __tablename__ = "courses"

    course_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_name = Column(String(255), nullable=False)
    course_code = Column(String(50), unique=True, index=True)
    prof_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    description = Column(Text)
    credits = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())
    is_active = Column(Boolean, default=True)

    # Relationships
    professor = relationship("User", back_populates="courses")
    sessions = relationship("Session", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("CourseEnrollment", back_populates="course", cascade="all, delete-orphan")


class Session(Base):
    __tablename__ = "sessions"

    session_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey("courses.course_id", ondelete="CASCADE"), nullable=False, index=True)
    session_date = Column(Date, nullable=False, index=True)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    location = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    is_completed = Column(Boolean, default=False)

    # Relationships
    course = relationship("Course", back_populates="sessions")
    attendances = relationship("Attendance", back_populates="session", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint('end_time > start_time', name='check_time_order'),
    )


class Attendance(Base):
    __tablename__ = "attendance"

    attendance_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False, index=True)
    session_id = Column(Integer, ForeignKey("sessions.session_id", ondelete="CASCADE"), nullable=False, index=True)
    confidence = Column(Float)
    detected_at = Column(DateTime, server_default=func.now())
    status = Column(String(20), nullable=False, index=True)
    detection_method = Column(String(50), default="facial_recognition")

    # Relationships
    student = relationship("Student", back_populates="attendances")
    session = relationship("Session", back_populates="attendances")

    __table_args__ = (
        UniqueConstraint('student_id', 'session_id', name='uq_student_session'),
        CheckConstraint("status IN ('Présent', 'Absent')", name='check_status'),
        CheckConstraint('confidence >= 0 AND confidence <= 1', name='check_confidence'),
    )


class Log(Base):
    __tablename__ = "logs"

    log_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"))
    action = Column(String(255), nullable=False, index=True)
    details = Column(Text)
    ip_address = Column(String(45))
    timestamp = Column(DateTime, server_default=func.now(), index=True)

    # Relationships
    user = relationship("User", back_populates="logs")


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False, index=True)
    message = Column(String(500), nullable=False)
    notification_type = Column(String(50), default="info")
    read_status = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
    read_at = Column(DateTime)

    # Relationships
    user = relationship("User", back_populates="notifications")


class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"

    enrollment_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False, index=True)
    course_id = Column(Integer, ForeignKey("courses.course_id", ondelete="CASCADE"), nullable=False, index=True)
    enrolled_at = Column(DateTime, server_default=func.now())

    # Relationships
    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

    __table_args__ = (
        UniqueConstraint('student_id', 'course_id', name='uq_student_course'),
    )
