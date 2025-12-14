from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, Token
from app.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

class AuthService:
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        # Convertir le hash stocké en bytes
        return bcrypt.checkpw(
            plain_password.encode('utf-8'), 
            hashed_password.encode('utf-8') if isinstance(hashed_password, str) else hashed_password
        )
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def register_user(db: Session, user: UserCreate):
        # Vérifier si l'utilisateur existe déjà
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Email déjà enregistré")
        
        db_user = db.query(User).filter(User.username == user.username).first()
        if db_user:
            raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà pris")
        
        # Créer le nouvel utilisateur
        hashed_password = AuthService.get_password_hash(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            hashed_password=hashed_password,
            role=user.role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def login_user(db: Session, credentials: UserLogin):
        # Chercher par username OU email
        user = db.query(User).filter(
            (User.username == credentials.username) | (User.email == credentials.username)
        ).first()
        
        # Debug logs
        print(f"Login attempt - Identifier: {credentials.username}")
        print(f"User found: {user is not None}")
        
        if not user:
            print("User not found")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Identifiants incorrects",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        print(f"User found: {user.username} / {user.email}")
        print(f"Stored hash: {user.hashed_password[:20]}...")
        print(f"Password to verify: {credentials.password}")
        
        password_valid = AuthService.verify_password(credentials.password, user.hashed_password)
        print(f"Password valid: {password_valid}")
        
        if not password_valid:
            print("Password verification failed")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Identifiants incorrects",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = AuthService.create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    
    @staticmethod
    def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Impossible de valider les identifiants",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
        
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise credentials_exception
        return user
