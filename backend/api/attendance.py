"""
API de gestion de présence (attendance)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date, datetime, time

from database import get_db
from models.schemas import (
    AttendanceCreate, AttendanceResponse, AttendanceWithDetails,
    AttendanceStats, FaceRecognitionRequest, FaceRecognitionResponse,
    SessionWithCourse
)
from models.database_models import (
    Attendance, Student, Session as SessionModel, Course,
    CourseEnrollment, StudentLogin
)
from utils.security import get_current_professor, get_current_student
from services.face_service import FaceService

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


@router.get("/sessions/available", response_model=List[SessionWithCourse])
def get_available_sessions(
    current_student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Obtenir les sessions disponibles pour marquer la présence
    Sessions actives: date du jour et heure actuelle entre start_time et end_time
    """
    today = date.today()
    now = datetime.now().time()
    
    print(f"[DEBUG] Student ID: {current_student.student_id}")
    print(f"[DEBUG] Today: {today}, Now: {now}")
    
    # Obtenir les cours de l'étudiant
    enrolled_courses = db.query(CourseEnrollment).filter(
        CourseEnrollment.student_id == current_student.student_id
    ).all()
    
    course_ids = [enrollment.course_id for enrollment in enrolled_courses]
    print(f"[DEBUG] Enrolled courses: {course_ids}")
    
    # Obtenir les sessions actives
    sessions = db.query(SessionModel).filter(
        SessionModel.course_id.in_(course_ids),
        SessionModel.session_date == today,
        SessionModel.start_time <= now,
        SessionModel.end_time >= now,
        SessionModel.is_completed == False
    ).all()
    
    print(f"[DEBUG] Found {len(sessions)} active sessions")
    
    result = []
    for session in sessions:
        course = db.query(Course).filter(Course.course_id == session.course_id).first()
        result.append(SessionWithCourse(
            session_id=session.session_id,
            course_id=session.course_id,
            session_date=session.session_date,
            start_time=session.start_time,
            end_time=session.end_time,
            location=session.location,
            created_at=session.created_at,
            is_completed=session.is_completed,
            course_name=course.course_name if course else None,
            professor_name=course.professor.full_name if course and course.professor else None
        ))
    
    return result


@router.post("/recognize", response_model=FaceRecognitionResponse)
def recognize_and_mark_attendance(
    recognition_data: FaceRecognitionRequest,
    current_student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Reconnaissance faciale et marquage automatique de la présence
    """
    # Vérifier que la session existe et est active
    session = db.query(SessionModel).filter(
        SessionModel.session_id == recognition_data.session_id
    ).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session introuvable")
    
    # Vérifier que la session est aujourd'hui et active
    today = date.today()
    now = datetime.now().time()
    
    if session.session_date != today:
        raise HTTPException(
            status_code=400,
            detail="Cette session n'est pas prévue aujourd'hui"
        )
    
    if now < session.start_time or now > session.end_time:
        raise HTTPException(
            status_code=400,
            detail="Cette session n'est pas active actuellement"
        )
    
    # Vérifier que l'étudiant est inscrit au cours
    enrollment = db.query(CourseEnrollment).filter(
        CourseEnrollment.student_id == current_student.student_id,
        CourseEnrollment.course_id == session.course_id
    ).first()
    
    if not enrollment:
        raise HTTPException(
            status_code=403,
            detail="Vous n'êtes pas inscrit à ce cours"
        )
    
    # Vérifier si déjà marqué présent
    existing_attendance = db.query(Attendance).filter(
        Attendance.student_id == current_student.student_id,
        Attendance.session_id == recognition_data.session_id
    ).first()
    
    if existing_attendance and existing_attendance.status == "Présent":
        return FaceRecognitionResponse(
            success=False,
            message="Votre présence a déjà été enregistrée pour cette session",
            detected_students=[],
            attendance_marked=[]
        )
    
    # Effectuer la reconnaissance faciale
    try:
        recognition_result = FaceService.recognize_face(
            db,
            recognition_data.image_base64,
            current_student.student_id
        )
        
        if not recognition_result["success"]:
            return FaceRecognitionResponse(
                success=False,
                message=recognition_result["message"],
                detected_students=[],
                attendance_marked=[]
            )
        
        # Marquer la présence
        if existing_attendance:
            existing_attendance.status = "Présent"
            existing_attendance.confidence = recognition_result["confidence"]
            existing_attendance.detected_at = datetime.now()
            existing_attendance.detection_method = "facial_recognition"
            db.commit()
        else:
            new_attendance = Attendance(
                student_id=current_student.student_id,
                session_id=recognition_data.session_id,
                status="Présent",
                confidence=recognition_result["confidence"],
                detection_method="facial_recognition"
            )
            db.add(new_attendance)
            db.commit()
        
        return FaceRecognitionResponse(
            success=True,
            message="Présence enregistrée avec succès",
            detected_students=[{
                "student_id": current_student.student_id,
                "full_name": current_student.student.full_name,
                "confidence": recognition_result["confidence"]
            }],
            attendance_marked=[current_student.student_id]
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la reconnaissance faciale: {str(e)}"
        )


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
