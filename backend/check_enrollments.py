"""
Script pour vérifier les inscriptions des étudiants aux cours
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.database_models import Student, Course, CourseEnrollment, Session as SessionModel, User
from datetime import date, datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/facetrack_db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def check_data():
    db = SessionLocal()
    try:
        print("\n=== ÉTUDIANTS ===")
        students = db.query(Student).all()
        for s in students:
            print(f"ID: {s.student_id}, Nom: {s.full_name}, Email: {s.email}")
        
        print("\n=== COURS ===")
        courses = db.query(Course).all()
        for c in courses:
            prof_name = db.query(User).filter(User.user_id == c.prof_id).first()
            print(f"ID: {c.course_id}, Nom: {c.course_name}, Code: {c.course_code}, Prof: {prof_name.full_name if prof_name else 'N/A'}")
        
        print("\n=== INSCRIPTIONS (course_enrollments) ===")
        enrollments = db.query(CourseEnrollment).all()
        if not enrollments:
            print("⚠️  AUCUNE INSCRIPTION TROUVÉE !")
        for e in enrollments:
            student = db.query(Student).filter(Student.student_id == e.student_id).first()
            course = db.query(Course).filter(Course.course_id == e.course_id).first()
            print(f"Student: {student.full_name if student else 'Unknown'} -> Course: {course.course_name if course else 'Unknown'}")
        
        print("\n=== SESSIONS D'AUJOURD'HUI ===")
        today = date.today()
        sessions = db.query(SessionModel).filter(SessionModel.session_date == today).all()
        if not sessions:
            print("⚠️  AUCUNE SESSION POUR AUJOURD'HUI !")
        for s in sessions:
            course = db.query(Course).filter(Course.course_id == s.course_id).first()
            print(f"Session ID: {s.session_id}, Course: {course.course_name if course else 'Unknown'}, "
                  f"Date: {s.session_date}, {s.start_time} - {s.end_time}, Completed: {s.is_completed}")
        
    finally:
        db.close()

if __name__ == "__main__":
    check_data()
