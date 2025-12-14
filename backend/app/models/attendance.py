from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.database import Base

class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    check_in_time = Column(DateTime(timezone=True), server_default=func.now())
    check_out_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="present")  # present, absent, late
    course_name = Column(String(255), nullable=True)
    verification_method = Column(String(50), default="face_recognition")  # face_recognition, manual
    confidence_score = Column(String(10), nullable=True)
    notes = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
