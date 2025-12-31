"""
Service de gestion des étudiants
"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional

from models.database_models import Student, StudentLogin, TrainingImage
from models.schemas import StudentCreate, StudentRegister, StudentResponse, StudentWithLogin
from utils.security import get_password_hash


class StudentService:
    """Service pour gérer les étudiants"""
    
    @staticmethod
    def create_student(db: Session, student_data: StudentCreate) -> Student:
        """Créer un nouvel étudiant"""
        # Vérifier l'email unique
        if student_data.email:
            existing = db.query(Student).filter(Student.email == student_data.email).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cet email existe déjà"
                )
        
        # Vérifier le numéro d'inscription unique
        if student_data.enrollment_number:
            existing = db.query(Student).filter(
                Student.enrollment_number == student_data.enrollment_number
            ).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Ce numéro d'inscription existe déjà"
                )
        
        new_student = Student(**student_data.model_dump())
        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        
        return new_student
    
    @staticmethod
    def register_student_with_login(db: Session, register_data: StudentRegister) -> dict:
        """
        Enregistrer un étudiant avec un compte de connexion
        IMPORTANT: Cette méthode retourne les infos nécessaires pour la capture d'image
        """
        # Vérifier si le username existe déjà
        existing_login = db.query(StudentLogin).filter(
            StudentLogin.username == register_data.username
        ).first()
        if existing_login:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce nom d'utilisateur existe déjà"
            )
        
        # Vérifier l'email unique
        if register_data.email:
            existing = db.query(Student).filter(Student.email == register_data.email).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cet email existe déjà"
                )
        
        # Créer l'étudiant
        student = Student(
            full_name=register_data.full_name,
            email=register_data.email,
            phone=register_data.phone,
            enrollment_number=register_data.enrollment_number
        )
        db.add(student)
        db.flush()  # Pour obtenir le student_id
        
        # Créer le login
        hashed_password = get_password_hash(register_data.password)
        student_login = StudentLogin(
            student_id=student.student_id,
            username=register_data.username,
            password_hash=hashed_password
        )
        db.add(student_login)
        db.commit()
        db.refresh(student)
        
        return {
            "student": student,
            "message": "Étudiant créé avec succès. Veuillez capturer vos images faciales.",
            "requires_face_capture": True
        }
    
    @staticmethod
    def get_student_by_id(db: Session, student_id: int) -> Optional[Student]:
        """Obtenir un étudiant par son ID"""
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Étudiant introuvable"
            )
        return student
    
    @staticmethod
    def get_student_with_details(db: Session, student_id: int) -> StudentWithLogin:
        """Obtenir un étudiant avec ses détails de login et d'images"""
        student = StudentService.get_student_by_id(db, student_id)
        
        # Compter les images
        image_count = db.query(TrainingImage).filter(
            TrainingImage.student_id == student_id
        ).count()
        
        # Obtenir le username
        student_login = db.query(StudentLogin).filter(
            StudentLogin.student_id == student_id
        ).first()
        
        return StudentWithLogin(
            student_id=student.student_id,
            full_name=student.full_name,
            email=student.email,
            phone=student.phone,
            enrollment_number=student.enrollment_number,
            created_at=student.created_at,
            is_active=student.is_active,
            username=student_login.username if student_login else None,
            has_images=image_count > 0,
            image_count=image_count
        )
    
    @staticmethod
    def get_all_students(db: Session, skip: int = 0, limit: int = 100) -> List[Student]:
        """Obtenir tous les étudiants"""
        return db.query(Student).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_student(db: Session, student_id: int, student_data: StudentCreate) -> Student:
        """Mettre à jour un étudiant"""
        student = StudentService.get_student_by_id(db, student_id)
        
        for key, value in student_data.model_dump(exclude_unset=True).items():
            setattr(student, key, value)
        
        db.commit()
        db.refresh(student)
        return student
    
    @staticmethod
    def delete_student(db: Session, student_id: int) -> dict:
        """Supprimer un étudiant"""
        student = StudentService.get_student_by_id(db, student_id)
        
        db.delete(student)
        db.commit()
        
        return {"message": "Étudiant supprimé avec succès"}
    
    @staticmethod
    def check_student_has_images(db: Session, student_id: int) -> bool:
        """Vérifier si un étudiant a des images d'entraînement"""
        count = db.query(TrainingImage).filter(
            TrainingImage.student_id == student_id
        ).count()
        return count > 0
