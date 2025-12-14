from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.face_service import FaceRecognitionService

router = APIRouter()

@router.post("/register-face/{user_id}")
async def register_face(
    user_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Enregistrer le visage d'un utilisateur"""
    return await FaceRecognitionService.register_face(db, user_id, file)

@router.post("/verify-face")
async def verify_face(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Vérifier l'identité d'un utilisateur par reconnaissance faciale"""
    return await FaceRecognitionService.verify_face(db, file)

@router.post("/attendance-with-face")
async def mark_attendance_with_face(
    file: UploadFile = File(...),
    course_name: str = None,
    db: Session = Depends(get_db)
):
    """Enregistrer une présence avec reconnaissance faciale"""
    return await FaceRecognitionService.mark_attendance_with_face(db, file, course_name)
