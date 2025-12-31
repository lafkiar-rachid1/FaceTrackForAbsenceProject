"""
API de gestion de présence (attendance)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from database import get_db
from models.schemas import (
    AttendanceCreate, AttendanceResponse, AttendanceWithDetails,
    AttendanceStats, FaceRecognitionRequest, FaceRecognitionResponse
)
from models.database_models import Attendance, Student, Session as SessionModel, Course
from utils.security import get_current_professor, get_current_student

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post("/", response_model=AttendanceResponse, summary="Marquer une présence manuellement")
def mark_attendance(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_professor)
):
    """
    Marquer manuellement la présence d'un étudiant à une session
    """
    # Vérifier que l'étudiant existe
    student = db.query(Student).filter(Student.student_id == attendance_data.student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")
    
    # Vérifier que la session existe
    session = db.query(SessionModel).filter(
        SessionModel.session_id == attendance_data.session_id
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session introuvable")
    
    # Vérifier si la présence existe déjà
    existing = db.query(Attendance).filter(
        Attendance.student_id == attendance_data.student_id,
        Attendance.session_id == attendance_data.session_id
    ).first()
    
    if existing:
        # Mettre à jour
        existing.status = attendance_data.status.value
        existing.confidence = attendance_data.confidence
        existing.detection_method = attendance_data.detection_method
        db.commit()
        db.refresh(existing)
        return existing
    
    # Créer nouvelle présence
    new_attendance = Attendance(
        student_id=attendance_data.student_id,
        session_id=attendance_data.session_id,
        status=attendance_data.status.value,
        confidence=attendance_data.confidence,
        detection_method=attendance_data.detection_method
    )
    
    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)
    
    return new_attendance


@router.get("/session/{session_id}", response_model=List[AttendanceWithDetails])
def get_session_attendance(
    session_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_professor)
):
    """
    Obtenir toutes les présences d'une session
    """
    attendances = db.query(Attendance).filter(
        Attendance.session_id == session_id
    ).all()
    
    result = []
    for att in attendances:
        result.append(AttendanceWithDetails(
            attendance_id=att.attendance_id,
            student_id=att.student_id,
            session_id=att.session_id,
            status=att.status,
            confidence=att.confidence,
            detected_at=att.detected_at,
            detection_method=att.detection_method,
            student_name=att.student.full_name,
            course_name=att.session.course.course_name,
            session_date=att.session.session_date
        ))
    
    return result


@router.get("/student/{student_id}", response_model=List[AttendanceWithDetails])
def get_student_attendance(
    student_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtenir toutes les présences d'un étudiant
    """
    attendances = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()
    
    result = []
    for att in attendances:
        result.append(AttendanceWithDetails(
            attendance_id=att.attendance_id,
            student_id=att.student_id,
            session_id=att.session_id,
            status=att.status,
            confidence=att.confidence,
            detected_at=att.detected_at,
            detection_method=att.detection_method,
            student_name=att.student.full_name,
            course_name=att.session.course.course_name,
            session_date=att.session.session_date
        ))
    
    return result


@router.get("/student/{student_id}/stats", response_model=AttendanceStats)
def get_student_stats(
    student_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtenir les statistiques de présence d'un étudiant
    """
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Étudiant introuvable")
    
    attendances = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).all()
    
    total_sessions = len(attendances)
    present_count = sum(1 for att in attendances if att.status == "Présent")
    absent_count = sum(1 for att in attendances if att.status == "Absent")
    
    attendance_percentage = (present_count / total_sessions * 100) if total_sessions > 0 else 0.0
    
    return AttendanceStats(
        student_id=student_id,
        student_name=student.full_name,
        total_sessions=total_sessions,
        present_count=present_count,
        absent_count=absent_count,
        attendance_percentage=round(attendance_percentage, 2)
    )


@router.get("/me/attendance", response_model=List[AttendanceWithDetails])
def get_my_attendance(
    current_student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Obtenir les présences de l'étudiant connecté
    """
    attendances = db.query(Attendance).filter(
        Attendance.student_id == current_student.student_id
    ).all()
    
    result = []
    for att in attendances:
        result.append(AttendanceWithDetails(
            attendance_id=att.attendance_id,
            student_id=att.student_id,
            session_id=att.session_id,
            status=att.status,
            confidence=att.confidence,
            detected_at=att.detected_at,
            detection_method=att.detection_method,
            student_name=att.student.full_name,
            course_name=att.session.course.course_name,
            session_date=att.session.session_date
        ))
    
    return result


@router.get("/me/stats", response_model=AttendanceStats)
def get_my_stats(
    current_student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Obtenir les statistiques de présence de l'étudiant connecté
    """
    return get_student_stats(current_student.student_id, db)


@router.delete("/{attendance_id}")
def delete_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_professor)
):
    """
    Supprimer une présence
    """
    attendance = db.query(Attendance).filter(
        Attendance.attendance_id == attendance_id
    ).first()
    
    if not attendance:
        raise HTTPException(status_code=404, detail="Présence introuvable")
    
    db.delete(attendance)
    db.commit()
    
    return {"message": "Présence supprimée avec succès"}
