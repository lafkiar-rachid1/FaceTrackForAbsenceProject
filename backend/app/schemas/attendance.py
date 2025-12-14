from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AttendanceBase(BaseModel):
    course_name: Optional[str] = None
    notes: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    user_id: int
    verification_method: str = "face_recognition"

class AttendanceResponse(AttendanceBase):
    id: int
    user_id: int
    check_in_time: datetime
    check_out_time: Optional[datetime]
    status: str
    verification_method: str
    confidence_score: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
