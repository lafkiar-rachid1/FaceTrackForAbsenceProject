"""
Service d'authentification
"""
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.database_models import User, Student, StudentLogin, Role, Log
from models.schemas import UserCreate, LoginRequest, Token
from utils.security import verify_password, get_password_hash, create_access_token


class AuthService:
    """Service pour gérer l'authentification"""
    
    @staticmethod
    def authenticate_user(db: Session, username: str, password: str):
        """Authentifier un utilisateur (admin/prof)"""
        user = db.query(User).filter(User.username == username).first()
        
        if not user:
            return None
        
        if not verify_password(password, user.password_hash):
            return None
            
        return user
    
    @staticmethod
    def authenticate_student(db: Session, username: str, password: str):
        """Authentifier un étudiant"""
        student_login = db.query(StudentLogin).filter(
            StudentLogin.username == username
        ).first()
        
        if not student_login:
            return None
        
        if not verify_password(password, student_login.password_hash):
            return None
        
        # Mettre à jour last_login
        student_login.last_login = datetime.utcnow()
        db.commit()
        
        return student_login
    
    @staticmethod
    def login_user(db: Session, login_data: LoginRequest) -> Token:
        """Login pour admin/prof"""
        user = AuthService.authenticate_user(db, login_data.username, login_data.password)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Nom d'utilisateur ou mot de passe incorrect",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Créer le token
        access_token = create_access_token(
            data={"sub": user.username, "role": user.role.role_name}
        )
        
        # Logger l'action
        log = Log(
            user_id=user.user_id,
            action="LOGIN",
            details=f"User {user.username} logged in"
        )
        db.add(log)
        db.commit()
        
        return Token(access_token=access_token, token_type="bearer")
    
    @staticmethod
    def login_student(db: Session, login_data: LoginRequest) -> Token:
        """Login pour étudiant"""
        student_login = AuthService.authenticate_student(
            db, login_data.username, login_data.password
        )
        
        if not student_login:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Nom d'utilisateur ou mot de passe incorrect",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Créer le token
        access_token = create_access_token(
            data={"sub": student_login.username, "role": "student", "student_id": student_login.student_id}
        )
        
        return Token(access_token=access_token, token_type="bearer")
    
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """Créer un nouvel utilisateur (admin/prof)"""
        # Vérifier si l'utilisateur existe déjà
        existing_user = db.query(User).filter(User.username == user_data.username).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ce nom d'utilisateur existe déjà"
            )
        
        # Créer l'utilisateur
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            username=user_data.username,
            password_hash=hashed_password,
            full_name=user_data.full_name,
            role_id=user_data.role_id
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
