"""
API de gestion des étudiants
"""
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.schemas import (
    StudentCreate, StudentResponse, StudentWithLogin,
    FaceCaptureRequest, FaceCaptureResponse
)
from services import StudentService, FaceService
from utils.security import get_current_admin, get_current_student

router = APIRouter(prefix="/api/students", tags=["Students"])


@router.post("/capture-faces", response_model=FaceCaptureResponse, summary="Capturer les images faciales")
def capture_student_faces(
    capture_data: FaceCaptureRequest,
    db: Session = Depends(get_db)
):
    """
    Capturer et sauvegarder les images faciales d'un étudiant
    
    **IMPORTANT**: Cette API doit être appelée après l'inscription d'un étudiant
    
    - **student_id**: ID de l'étudiant
    - **images_base64**: Liste d'images encodées en base64 (min 10, max 30)
    
    Le frontend doit:
    1. Ouvrir la caméra
    2. Capturer 10-30 images du visage de l'étudiant
    3. Encoder chaque image en base64
    4. Envoyer toutes les images via cette API
    """
    return FaceService.save_face_images(
        db,
        capture_data.student_id,
        capture_data.images_base64
    )


@router.post("/", response_model=StudentResponse, summary="Créer un étudiant (Admin seulement)")
def create_student(
    student_data: StudentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """
    Créer un nouvel étudiant (réservé aux administrateurs)
    
    Note: Pour l'inscription publique avec login, utilisez `/api/auth/register/student`
    """
    return StudentService.create_student(db, student_data)


@router.get("/", response_model=List[StudentResponse], summary="Lister tous les étudiants")
def get_all_students(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """
    Obtenir la liste de tous les étudiants (admin/prof seulement)
    """
    return StudentService.get_all_students(db, skip, limit)


@router.get("/{student_id}", response_model=StudentWithLogin, summary="Obtenir un étudiant")
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """
    Obtenir les détails d'un étudiant par son ID
    """
    return StudentService.get_student_with_details(db, student_id)


@router.put("/{student_id}", response_model=StudentResponse, summary="Mettre à jour un étudiant")
def update_student(
    student_id: int,
    student_data: StudentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """
    Mettre à jour les informations d'un étudiant
    """
    return StudentService.update_student(db, student_id, student_data)


@router.delete("/{student_id}", summary="Supprimer un étudiant")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """
    Supprimer un étudiant et toutes ses données associées
    """
    return StudentService.delete_student(db, student_id)


@router.get("/{student_id}/images", summary="Obtenir les images d'un étudiant")
def get_student_images(
    student_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """
    Obtenir toutes les images d'entraînement d'un étudiant
    """
    images = FaceService.get_student_images(db, student_id)
    return {
        "student_id": student_id,
        "total_images": len(images),
        "images": [
            {
                "image_id": img.image_id,
                "image_path": img.image_path,
                "captured_at": img.captured_at,
                "is_verified": img.is_verified
            }
            for img in images
        ]
    }


@router.delete("/{student_id}/images", summary="Supprimer les images d'un étudiant")
def delete_student_images(
    student_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_admin)
):
    """
    Supprimer toutes les images d'entraînement d'un étudiant
    """
    return FaceService.delete_student_images(db, student_id)


@router.post("/retrain-model", summary="Réentraîner le modèle")
def retrain_model(current_user = Depends(get_current_admin)):
    """
    Réentraîner le modèle de reconnaissance faciale avec toutes les images
    
    À appeler après avoir ajouté/modifié des images d'étudiants
    """
    return FaceService.retrain_model()


@router.get("/me/profile", response_model=StudentWithLogin, summary="Profil de l'étudiant connecté")
def get_my_profile(
    current_student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Obtenir le profil de l'étudiant actuellement connecté
    """
    return StudentService.get_student_with_details(db, current_student.student_id)
