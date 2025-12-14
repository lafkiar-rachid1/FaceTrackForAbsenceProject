from sqlalchemy.orm import Session
from datetime import datetime, date
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceCreate
from typing import List

class AttendanceService:
    @staticmethod
    def create_attendance(db: Session, attendance: AttendanceCreate):
        db_attendance = Attendance(
            user_id=attendance.user_id,
            course_name=attendance.course_name,
            verification_method=attendance.verification_method,
            notes=attendance.notes,
            status="present"
        )
        db.add(db_attendance)
        db.commit()
        db.refresh(db_attendance)
        return db_attendance
    
    @staticmethod
    def get_all_attendance(db: Session, skip: int = 0, limit: int = 100) -> List[Attendance]:
        return db.query(Attendance).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_user_attendance(db: Session, user_id: int) -> List[Attendance]:
        return db.query(Attendance).filter(Attendance.user_id == user_id).all()
    
    @staticmethod
    def get_attendance_by_date(db: Session, attendance_date: date) -> List[Attendance]:
        start_datetime = datetime.combine(attendance_date, datetime.min.time())
        end_datetime = datetime.combine(attendance_date, datetime.max.time())
        return db.query(Attendance).filter(
            Attendance.check_in_time >= start_datetime,
            Attendance.check_in_time <= end_datetime
        ).all()
    
    @staticmethod
    def checkout(db: Session, attendance_id: int):
        attendance = db.query(Attendance).filter(Attendance.id == attendance_id).first()
        if attendance:
            attendance.check_out_time = datetime.utcnow()
            db.commit()
            db.refresh(attendance)
            return attendance
        return None
