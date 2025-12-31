"""
Service pour les fonctionnalités professeur
"""
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from fastapi import HTTPException, status
from datetime import datetime, date

from models.database_models import (
    User, Course, Session as SessionModel, Student, 
    CourseEnrollment, Attendance
)
from models.schemas import SessionCreate, ProfessorStatsResponse


class ProfessorService:
    """Service pour gérer les fonctionnalités professeur"""
    
    @staticmethod
    def get_professor_stats(db: Session, prof_id: int) -> ProfessorStatsResponse:
        """Obtenir les statistiques du professeur"""
        total_courses = db.query(func.count(Course.course_id)).filter(
            Course.prof_id == prof_id
        ).scalar() or 0
        
        total_sessions = db.query(func.count(SessionModel.session_id)).join(
            Course
        ).filter(Course.prof_id == prof_id).scalar() or 0
        
        upcoming_sessions = db.query(func.count(SessionModel.session_id)).join(
            Course
        ).filter(
            Course.prof_id == prof_id,
            SessionModel.session_date >= date.today(),
            SessionModel.is_completed == False
        ).scalar() or 0
        
        # Nombre d'étudiants inscrits dans tous les cours du prof
        students_enrolled = db.query(func.count(func.distinct(CourseEnrollment.student_id))).join(
            Course
        ).filter(Course.prof_id == prof_id).scalar() or 0
        
        return ProfessorStatsResponse(
            total_courses=total_courses,
            total_sessions=total_sessions,
            upcoming_sessions=upcoming_sessions,
            students_enrolled=students_enrolled
        )
    
    @staticmethod
    def get_professor_courses(db: Session, prof_id: int):
        """Obtenir les cours du professeur"""
        courses = db.query(Course).filter(Course.prof_id == prof_id).all()
        return courses
    
    @staticmethod
    def get_course_students(db: Session, prof_id: int, course_id: int):
        """Obtenir les étudiants inscrits dans un cours du professeur"""
        # Vérifier que le cours appartient au professeur
        course = db.query(Course).filter(
            Course.course_id == course_id,
            Course.prof_id == prof_id
        ).first()
        
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cours introuvable ou accès non autorisé"
            )
        
        enrollments = db.query(CourseEnrollment).filter(
            CourseEnrollment.course_id == course_id
        ).all()
        
        students = []
        for enrollment in enrollments:
            student = db.query(Student).filter(
                Student.student_id == enrollment.student_id
            ).first()
            if student:
                students.append({
                    "student_id": student.student_id,
                    "full_name": student.full_name,
                    "email": student.email,
                    "enrollment_number": student.enrollment_number,
                    "enrolled_at": enrollment.enrolled_at
                })
        
        return students
    
    @staticmethod
    def create_session(db: Session, prof_id: int, session_data: SessionCreate):
        """Créer une nouvelle session de cours"""
        # Vérifier que le cours appartient au professeur
        course = db.query(Course).filter(
            Course.course_id == session_data.course_id,
            Course.prof_id == prof_id
        ).first()
        
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cours introuvable ou accès non autorisé"
            )
        
        # Vérifier que end_time > start_time
        if session_data.end_time <= session_data.start_time:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'heure de fin doit être après l'heure de début"
            )
        
        # Créer la session
        new_session = SessionModel(
            course_id=session_data.course_id,
            session_date=session_data.session_date,
            start_time=session_data.start_time,
            end_time=session_data.end_time,
            location=session_data.location,
            is_completed=False
        )
        
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        
        return new_session
    
    @staticmethod
    def get_professor_sessions(db: Session, prof_id: int):
        """Obtenir toutes les sessions du professeur"""
        sessions = db.query(SessionModel).join(
            Course
        ).filter(
            Course.prof_id == prof_id
        ).order_by(SessionModel.session_date.desc()).all()
        
        return sessions
    
    @staticmethod
    def get_session_attendance(db: Session, prof_id: int, session_id: int):
        """Obtenir la liste de présence d'une session"""
        # Vérifier que la session appartient au professeur
        session = db.query(SessionModel).join(Course).filter(
            SessionModel.session_id == session_id,
            Course.prof_id == prof_id
        ).first()
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session introuvable ou accès non autorisé"
            )
        
        # Obtenir tous les étudiants inscrits au cours
        enrolled_students = db.query(Student).join(
            CourseEnrollment
        ).filter(
            CourseEnrollment.course_id == session.course_id
        ).all()
        
        # Obtenir les présences
        attendances = db.query(Attendance).filter(
            Attendance.session_id == session_id
        ).all()
        
        attendance_dict = {att.student_id: att for att in attendances}
        
        result = []
        for student in enrolled_students:
            attendance = attendance_dict.get(student.student_id)
            result.append({
                "student_id": student.student_id,
                "full_name": student.full_name,
                "email": student.email,
                "enrollment_number": student.enrollment_number,
                "status": attendance.status if attendance else "Non marqué",
                "confidence": attendance.confidence if attendance else None,
                "detected_at": attendance.detected_at if attendance else None
            })
        
        return result
    
    @staticmethod
    def complete_session(db: Session, prof_id: int, session_id: int):
        """Marquer une session comme terminée et marquer les absents"""
        # Vérifier que la session appartient au professeur
        session = db.query(SessionModel).join(Course).filter(
            SessionModel.session_id == session_id,
            Course.prof_id == prof_id
        ).first()
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session introuvable ou accès non autorisé"
            )
        
        # Marquer la session comme complétée
        session.is_completed = True
        
        # Obtenir tous les étudiants inscrits
        enrolled_students = db.query(CourseEnrollment).filter(
            CourseEnrollment.course_id == session.course_id
        ).all()
        
        # Marquer les absents
        absent_count = 0
        for enrollment in enrolled_students:
            # Vérifier si l'étudiant a déjà une présence marquée
            existing_attendance = db.query(Attendance).filter(
                Attendance.student_id == enrollment.student_id,
                Attendance.session_id == session_id
            ).first()
            
            if not existing_attendance:
                # Marquer comme absent
                absent_attendance = Attendance(
                    student_id=enrollment.student_id,
                    session_id=session_id,
                    status="Absent",
                    confidence=0.0,
                    detection_method="manual"
                )
                db.add(absent_attendance)
                absent_count += 1
        
        db.commit()
        
        return {
            "message": "Session marquée comme terminée",
            "session_id": session_id,
            "absent_marked": absent_count
        }
