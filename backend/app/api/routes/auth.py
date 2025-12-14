from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Inscription d'un nouvel utilisateur"""
    return AuthService.register_user(db, user)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Connexion utilisateur"""
    return AuthService.login_user(db, credentials)

@router.get("/me", response_model=UserResponse)
async def get_current_user(current_user = Depends(AuthService.get_current_user)):
    """Récupérer les informations de l'utilisateur connecté"""
    return current_user
