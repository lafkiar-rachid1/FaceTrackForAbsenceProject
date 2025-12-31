"""
Service pour les fonctionnalités admin
"""
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from datetime import datetime

from models.database_models import (
    User, Role, Student, Course, CourseEnrollment, 
    Session as SessionModel
)
from models.schemas import (
    UserCreate, CourseCreate, CourseEnrollmentCreate,
    AdminStatsResponse
)
from utils.security import get_password_hash


class AdminService:
    """Service pour gérer les fonctionnalités admin"""
    
    @staticmethod
    def get_admin_stats(db: Session) -> AdminStatsResponse:
        """Obtenir les statistiques globales"""
        total_students = db.query(func.count(Student.student_id)).scalar()
        
        prof_role = db.query(Role).filter(Role.role_name == "prof").first()
        total_professors = db.query(func.count(User.user_id)).filter(
            User.role_id == prof_role.role_id
        ).scalar() if prof_role else 0
        
        total_courses = db.query(func.count(Course.course_id)).scalar()
        active_courses = db.query(func.count(Course.course_id)).filter(
            Course.is_active == True
        ).scalar()
        
        total_sessions = db.query(func.count(SessionModel.session_id)).scalar()
        active_students = db.query(func.count(Student.student_id)).filter(
            Student.is_active == True
        ).scalar()
        
        return AdminStatsResponse(
            total_students=total_students or 0,
            total_professors=total_professors or 0,
            total_courses=total_courses or 0,
            total_sessions=total_sessions or 0,
            active_students=active_students or 0,
            active_courses=active_courses or 0
        )
    
    @staticmethod
    def create_professor(db: Session, professor_data: UserCreate):
        """Créer un compte professeur"""
        # Vérifier si le username existe déjà
        existing_user = db.query(User).filter(User.username == professor_data.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce nom d'utilisateur existe déjà"
            )
        
        # Récupérer le rôle professeur
        prof_role = db.query(Role).filter(Role.role_name == "prof").first()
        if not prof_role:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Rôle professeur introuvable"
            )
        
        # Créer le professeur
        hashed_password = get_password_hash(professor_data.password)
        new_professor = User(
            username=professor_data.username,
            password_hash=hashed_password,
            full_name=professor_data.full_name,
            role_id=prof_role.role_id
        )
        
        db.add(new_professor)
        db.commit()
        db.refresh(new_professor)
        
        return new_professor
    
    @staticmethod
    def get_all_professors(db: Session):
        """Obtenir tous les professeurs"""
        prof_role = db.query(Role).filter(Role.role_name == "prof").first()
        if not prof_role:
            return []
        
        professors = db.query(User).filter(User.role_id == prof_role.role_id).all()
        return professors
    
    @staticmethod
    def create_course(db: Session, course_data: CourseCreate):
        """Créer un nouveau cours"""
        # Vérifier que le professeur existe
        professor = db.query(User).filter(User.user_id == course_data.prof_id).first()
        if not professor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Professeur introuvable"
            )
        
        # Vérifier si le code de cours existe déjà
        if course_data.course_code:
            existing_course = db.query(Course).filter(
                Course.course_code == course_data.course_code
            ).first()
            if existing_course:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ce code de cours existe déjà"
                )
        
        # Créer le cours
        new_course = Course(
            course_name=course_data.course_name,
            course_code=course_data.course_code,
            prof_id=course_data.prof_id,
            description=course_data.description,
            credits=course_data.credits,
            is_active=True
        )
        
        db.add(new_course)
        db.commit()
        db.refresh(new_course)
        
        return new_course
    
    @staticmethod
    def get_all_courses(db: Session):
        """Obtenir tous les cours"""
        courses = db.query(Course).all()
        return courses
    
    @staticmethod
    def update_course(db: Session, course_id: int, course_data: CourseCreate):
        """Mettre à jour un cours"""
        course = db.query(Course).filter(Course.course_id == course_id).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cours introuvable"
            )
        
        course.course_name = course_data.course_name
        course.course_code = course_data.course_code
        course.prof_id = course_data.prof_id
        course.description = course_data.description
        course.credits = course_data.credits
        
        db.commit()
        db.refresh(course)
        
        return course
    
    @staticmethod
    def delete_course(db: Session, course_id: int):
        """Supprimer un cours"""
        course = db.query(Course).filter(Course.course_id == course_id).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cours introuvable"
            )
        
        db.delete(course)
        db.commit()
    
    @staticmethod
    def enroll_student(db: Session, enrollment_data: CourseEnrollmentCreate):
        """Inscrire un étudiant à un cours"""
        # Vérifier que l'étudiant existe
        student = db.query(Student).filter(
            Student.student_id == enrollment_data.student_id
        ).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Étudiant introuvable"
            )
        
        # Vérifier que le cours existe
        course = db.query(Course).filter(
            Course.course_id == enrollment_data.course_id
        ).first()
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Cours introuvable"
            )
        
        # Vérifier si l'étudiant est déjà inscrit
        existing_enrollment = db.query(CourseEnrollment).filter(
            CourseEnrollment.student_id == enrollment_data.student_id,
            CourseEnrollment.course_id == enrollment_data.course_id
        ).first()
        if existing_enrollment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="L'étudiant est déjà inscrit à ce cours"
            )
        
        # Créer l'inscription
        new_enrollment = CourseEnrollment(
            student_id=enrollment_data.student_id,
            course_id=enrollment_data.course_id
        )
        
        db.add(new_enrollment)
        db.commit()
        db.refresh(new_enrollment)
        
        return new_enrollment
    
    @staticmethod
    def remove_enrollment(db: Session, enrollment_id: int):
        """Retirer un étudiant d'un cours"""
        enrollment = db.query(CourseEnrollment).filter(
            CourseEnrollment.enrollment_id == enrollment_id
        ).first()
        if not enrollment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Inscription introuvable"
            )
        
        db.delete(enrollment)
        db.commit()
    
    @staticmethod
    def get_course_students(db: Session, course_id: int):
        """Obtenir les étudiants inscrits à un cours"""
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
                    "enrollment_id": enrollment.enrollment_id,
                    "student_id": student.student_id,
                    "full_name": student.full_name,
                    "email": student.email,
                    "enrollment_number": student.enrollment_number,
                    "enrolled_at": enrollment.enrolled_at
                })
        
        return students
