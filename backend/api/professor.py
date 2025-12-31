"""
API pour les fonctionnalités professeur
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.schemas import (
    SessionCreate, SessionResponse, CourseResponse,
    ProfessorStatsResponse
)
from services.professor_service import ProfessorService
from utils.security import get_current_user, require_role
from models.database_models import User

router = APIRouter(prefix="/api/professor", tags=["professor"])


@router.get("/stats", response_model=ProfessorStatsResponse)
def get_professor_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("prof"))
):
    """Obtenir les statistiques du professeur"""
    return ProfessorService.get_professor_stats(db, current_user.user_id)


@router.get("/courses", response_model=List[CourseResponse])
def get_my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("prof"))
):
    """Obtenir les cours du professeur"""
    return ProfessorService.get_professor_courses(db, current_user.user_id)


@router.get("/courses/{course_id}/students")
def get_course_students(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("prof"))
):
    """Obtenir les étudiants inscrits dans un cours du professeur"""
    return ProfessorService.get_course_students(db, current_user.user_id, course_id)


@router.post("/sessions", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    session_data: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("prof"))
):
    """Créer une nouvelle session de cours"""
    return ProfessorService.create_session(db, current_user.user_id, session_data)


@router.get("/sessions", response_model=List[SessionResponse])
def get_my_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("prof"))
):
    """Obtenir toutes les sessions du professeur"""
    return ProfessorService.get_professor_sessions(db, current_user.user_id)


@router.get("/sessions/{session_id}/attendance")
def get_session_attendance(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("prof"))
):
    """Obtenir la liste de présence d'une session"""
    return ProfessorService.get_session_attendance(db, current_user.user_id, session_id)


@router.put("/sessions/{session_id}/complete")
def complete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("prof"))
):
    """Marquer une session comme terminée et marquer les absents"""
    return ProfessorService.complete_session(db, current_user.user_id, session_id)
