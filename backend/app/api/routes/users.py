from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas.user import UserResponse
from app.services.user_service import UserService

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupérer tous les utilisateurs"""
    return UserService.get_users(db, skip=skip, limit=limit)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    """Récupérer un utilisateur par ID"""
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user

@router.delete("/{user_id}")
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """Supprimer un utilisateur"""
    return UserService.delete_user(db, user_id)
