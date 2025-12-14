from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app.database import get_db
from app.schemas.attendance import AttendanceCreate, AttendanceResponse
from app.services.attendance_service import AttendanceService

router = APIRouter()

@router.post("/", response_model=AttendanceResponse)
async def create_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db)
):
    """Enregistrer une présence"""
    return AttendanceService.create_attendance(db, attendance)

@router.get("/", response_model=List[AttendanceResponse])
async def get_all_attendance(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupérer toutes les présences"""
    return AttendanceService.get_all_attendance(db, skip=skip, limit=limit)

@router.get("/user/{user_id}", response_model=List[AttendanceResponse])
async def get_user_attendance(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Récupérer les présences d'un utilisateur"""
    return AttendanceService.get_user_attendance(db, user_id)

@router.get("/date/{attendance_date}", response_model=List[AttendanceResponse])
async def get_attendance_by_date(
    attendance_date: date,
    db: Session = Depends(get_db)
):
    """Récupérer les présences par date"""
    return AttendanceService.get_attendance_by_date(db, attendance_date)

@router.put("/{attendance_id}/checkout")
async def checkout(
    attendance_id: int,
    db: Session = Depends(get_db)
):
    """Enregistrer une sortie"""
    return AttendanceService.checkout(db, attendance_id)
