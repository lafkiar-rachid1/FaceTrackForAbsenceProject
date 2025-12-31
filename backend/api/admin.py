"""
API pour les fonctionnalités admin
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.schemas import (
    UserCreate, UserResponse, CourseCreate, CourseResponse,
    CourseEnrollmentCreate, AdminStatsResponse
)
from services.admin_service import AdminService
from utils.security import get_current_user, require_role
from models.database_models import User

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/stats", response_model=AdminStatsResponse)
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Obtenir les statistiques globales pour l'admin"""
    return AdminService.get_admin_stats(db)


@router.post("/professors", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_professor(
    professor_data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Créer un compte professeur"""
    return AdminService.create_professor(db, professor_data)


@router.get("/professors", response_model=List[UserResponse])
def get_all_professors(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Obtenir tous les professeurs"""
    return AdminService.get_all_professors(db)


@router.post("/courses", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Créer un nouveau cours"""
    return AdminService.create_course(db, course_data)


@router.get("/courses", response_model=List[CourseResponse])
def get_all_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Obtenir tous les cours"""
    return AdminService.get_all_courses(db)


@router.put("/courses/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Mettre à jour un cours"""
    return AdminService.update_course(db, course_id, course_data)


@router.delete("/courses/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Supprimer un cours"""
    AdminService.delete_course(db, course_id)
    return {"message": "Cours supprimé avec succès"}


@router.post("/enrollments", status_code=status.HTTP_201_CREATED)
def enroll_student_to_course(
    enrollment_data: CourseEnrollmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Inscrire un étudiant à un cours"""
    return AdminService.enroll_student(db, enrollment_data)


@router.delete("/enrollments/{enrollment_id}")
def remove_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Retirer un étudiant d'un cours"""
    AdminService.remove_enrollment(db, enrollment_id)
    return {"message": "Inscription supprimée avec succès"}


@router.get("/courses/{course_id}/students")
def get_course_students(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Obtenir les étudiants inscrits à un cours"""
    return AdminService.get_course_students(db, course_id)
