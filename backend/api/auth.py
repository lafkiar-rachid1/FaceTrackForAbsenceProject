"""
API d'authentification
Endpoints pour login et register
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.schemas import (
    LoginRequest, Token, StudentRegister, 
    StudentResponse, StudentWithLogin
)
from services import AuthService, StudentService
from utils.security import get_current_user, get_current_student

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login/user", response_model=Token, summary="Login pour Admin/Professeur")
def login_user(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authentifier un utilisateur (admin ou professeur)
    
    - **username**: Nom d'utilisateur
    - **password**: Mot de passe
    """
    return AuthService.login_user(db, login_data)


@router.post("/login/student", response_model=Token, summary="Login pour Étudiant")
def login_student(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authentifier un étudiant
    
    - **username**: Nom d'utilisateur de l'étudiant
    - **password**: Mot de passe
    """
    return AuthService.login_student(db, login_data)


@router.post("/register/student", response_model=dict, summary="Inscription d'un étudiant")
def register_student(
    register_data: StudentRegister,
    db: Session = Depends(get_db)
):
    """
    Inscrire un nouvel étudiant avec un compte de connexion
    
    **IMPORTANT**: Après l'inscription, l'étudiant DOIT capturer ses images faciales
    en utilisant l'endpoint `/api/students/capture-faces`
    
    - **full_name**: Nom complet de l'étudiant
    - **email**: Email (optionnel)
    - **phone**: Téléphone (optionnel)
    - **enrollment_number**: Numéro d'inscription (optionnel)
    - **username**: Nom d'utilisateur pour se connecter (minimum 3 caractères)
    - **password**: Mot de passe (minimum 6 caractères)
    
    Returns:
        - student: Informations de l'étudiant créé
        - message: Message de succès
        - requires_face_capture: True (indique qu'il faut capturer les images)
    """
    result = StudentService.register_student_with_login(db, register_data)
    
    return {
        "student": StudentResponse.model_validate(result["student"]),
        "message": result["message"],
        "requires_face_capture": result["requires_face_capture"]
    }


@router.get("/me/user", summary="Obtenir l'utilisateur actuel (Admin/Prof)")
def get_current_user_info(current_user = Depends(get_current_user)):
    """
    Obtenir les informations de l'utilisateur actuellement connecté (admin/prof)
    """
    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "role": current_user.role.role_name
    }


@router.get("/me/student", response_model=StudentWithLogin, summary="Obtenir l'étudiant actuel")
def get_current_student_info(
    current_student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Obtenir les informations de l'étudiant actuellement connecté
    """
    return StudentService.get_student_with_details(db, current_student.student_id)


@router.post("/verify-token", summary="Vérifier la validité d'un token")
def verify_token(current_user = Depends(get_current_user)):
    """
    Vérifier si le token JWT est valide
    """
    return {
        "valid": True,
        "user_id": current_user.user_id,
        "username": current_user.username
    }
