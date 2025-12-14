import cv2
import numpy as np
import json
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.attendance import Attendance
from app.config import settings
from PIL import Image
import io

class FaceRecognitionService:
    # Charger le classificateur de détection de visages d'OpenCV
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    @staticmethod
    def extract_face_features(image):
        """Extraire les caractéristiques du visage à partir d'une image"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = FaceRecognitionService.face_cascade.detectMultiScale(gray, 1.3, 5)
        
        if len(faces) == 0:
            return None, None
        
        if len(faces) > 1:
            raise ValueError("Multiple faces detected")
        
        # Extraire le visage
        (x, y, w, h) = faces[0]
        face = gray[y:y+h, x:x+w]
        
        # Redimensionner pour une taille fixe
        face_resized = cv2.resize(face, (100, 100))
        
        # Normaliser
        face_normalized = face_resized / 255.0
        
        return face_normalized.flatten(), (x, y, w, h)
    
    @staticmethod
    async def register_face(db: Session, user_id: int, file: UploadFile):
        """Enregistrer l'encodage facial d'un utilisateur"""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        
        # Lire l'image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Image invalide")
        
        try:
            # Extraire les caractéristiques du visage
            face_features, bbox = FaceRecognitionService.extract_face_features(image)
            
            if face_features is None:
                raise HTTPException(status_code=400, detail="Aucun visage détecté dans l'image")
            
            # Sauvegarder l'encodage
            user.face_encoding = json.dumps(face_features.tolist())
            db.commit()
            
            return {"message": "Visage enregistré avec succès", "user_id": user_id}
            
        except ValueError as e:
            if "Multiple faces" in str(e):
                raise HTTPException(status_code=400, detail="Plusieurs visages détectés. Veuillez fournir une image avec un seul visage")
            raise HTTPException(status_code=400, detail=f"Erreur lors de la détection: {str(e)}")
    
    @staticmethod
    async def verify_face(db: Session, file: UploadFile):
        """Vérifier l'identité d'un utilisateur par reconnaissance faciale"""
        # Lire l'image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            raise HTTPException(status_code=400, detail="Image invalide")
        
        try:
            # Extraire les caractéristiques du visage
            test_features, bbox = FaceRecognitionService.extract_face_features(image)
            
            if test_features is None:
                raise HTTPException(status_code=400, detail="Aucun visage détecté dans l'image")
            
        except ValueError as e:
            raise HTTPException(status_code=400, detail="Erreur lors de la détection du visage")
        
        # Récupérer tous les utilisateurs avec encodage facial
        users = db.query(User).filter(User.face_encoding.isnot(None)).all()
        
        best_match = None
        best_distance = float('inf')
        threshold = 0.6  # Seuil de similarité (ajustable)
        
        for user in users:
            stored_features = np.array(json.loads(user.face_encoding))
            
            # Calculer la distance euclidienne
            distance = np.linalg.norm(test_features - stored_features)
            
            if distance < threshold and distance < best_distance:
                best_distance = distance
                best_match = user
        
        if best_match:
            confidence = max(0, (1 - best_distance / threshold) * 100)
            return {
                "match": True,
                "user_id": best_match.id,
                "username": best_match.username,
                "full_name": best_match.full_name,
                "confidence": f"{confidence:.2f}%"
            }
        
        return {"match": False, "message": "Aucune correspondance trouvée"}
    
    @staticmethod
    async def mark_attendance_with_face(db: Session, file: UploadFile, course_name: str = None):
        """Enregistrer une présence avec reconnaissance faciale"""
        # Vérifier l'identité
        verification_result = await FaceRecognitionService.verify_face(db, file)
        
        if not verification_result.get("match"):
            raise HTTPException(status_code=404, detail="Visage non reconnu")
        
        user_id = verification_result["user_id"]
        
        # Créer l'enregistrement de présence
        attendance = Attendance(
            user_id=user_id,
            course_name=course_name,
            verification_method="face_recognition",
            confidence_score=verification_result["confidence"],
            status="present"
        )
        db.add(attendance)
        db.commit()
        db.refresh(attendance)
        
        return {
            "message": "Présence enregistrée avec succès",
            "attendance_id": attendance.id,
            "user": verification_result["full_name"],
            "confidence": verification_result["confidence"]
        }
