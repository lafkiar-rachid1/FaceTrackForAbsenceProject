"""
Service de gestion des images faciales et reconnaissance
"""
import os
import base64
import cv2
import numpy as np
from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime

from models.database_models import Student, TrainingImage
from models.schemas import FaceCaptureRequest, FaceCaptureResponse
from config import settings


class FaceService:
    """Service pour gérer la capture et reconnaissance faciale"""
    
    @staticmethod
    def save_face_images(
        db: Session,
        student_id: int,
        images_base64: List[str]
    ) -> FaceCaptureResponse:
        """
        Sauvegarder les images faciales d'un étudiant
        Cette méthode est appelée après l'inscription d'un étudiant
        """
        # Vérifier que l'étudiant existe
        student = db.query(Student).filter(Student.student_id == student_id).first()
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Étudiant introuvable"
            )
        
        # Créer le dossier pour l'étudiant
        folder_name = f"{student_id}_{student.full_name.replace(' ', '_')}"
        dataset_path = os.path.join(settings.DATASET_DIR, folder_name)
        
        if not os.path.exists(dataset_path):
            os.makedirs(dataset_path)
        
        # Charger le détecteur de visage
        face_detector = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        
        images_saved = 0
        images_rejected = 0
        
        print(f"[FaceService] Traitement de {len(images_base64)} images pour l'étudiant {student_id}")
        
        for idx, img_base64 in enumerate(images_base64):
            try:
                # Décoder l'image base64
                img_data = base64.b64decode(img_base64)
                nparr = np.frombuffer(img_data, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                
                if img is None:
                    print(f"[FaceService] Image {idx+1}: Décodage échoué")
                    images_rejected += 1
                    continue
                
                # Détecter le visage avec des paramètres assouplis
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                # Paramètres assouplis: scaleFactor=1.1 (au lieu de 1.3), minNeighbors=3 (au lieu de 5)
                faces = face_detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=3, minSize=(30, 30))
                
                if len(faces) == 0:
                    print(f"[FaceService] Image {idx+1}: Aucun visage détecté")
                    images_rejected += 1
                    continue  # Pas de visage détecté, on passe
                
                # Prendre le plus grand visage
                (x, y, w, h) = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)[0]
                face_img = img[y:y+h, x:x+w]
                
                # Sauvegarder l'image
                filename = f"{student.full_name.replace(' ', '_')}_{idx+1}.jpg"
                file_path = os.path.join(dataset_path, filename)
                cv2.imwrite(file_path, face_img)
                
                # Enregistrer dans la base de données
                training_image = TrainingImage(
                    student_id=student_id,
                    image_path=file_path,
                    is_verified=True
                )
                db.add(training_image)
                images_saved += 1
                print(f"[FaceService] Image {idx+1}: Sauvegardée avec succès")
                
            except Exception as e:
                print(f"[FaceService] Erreur lors du traitement de l'image {idx+1}: {e}")
                images_rejected += 1
                continue
        
        db.commit()
        
        print(f"[FaceService] Résultat: {images_saved} images sauvegardées, {images_rejected} rejetées")
        
        if images_saved < settings.MIN_IMAGES_FOR_TRAINING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Nombre insuffisant d'images valides. Au moins {settings.MIN_IMAGES_FOR_TRAINING} images sont requises. {images_saved}/{len(images_base64)} images ont été validées."
            )
        
        return FaceCaptureResponse(
            success=True,
            message=f"{images_saved} images sauvegardées avec succès",
            student_id=student_id,
            images_saved=images_saved,
            dataset_path=dataset_path
        )
    
    @staticmethod
    def get_student_images(db: Session, student_id: int) -> List[TrainingImage]:
        """Obtenir toutes les images d'un étudiant"""
        return db.query(TrainingImage).filter(
            TrainingImage.student_id == student_id
        ).all()
    
    @staticmethod
    def delete_student_images(db: Session, student_id: int) -> dict:
        """Supprimer toutes les images d'un étudiant"""
        images = FaceService.get_student_images(db, student_id)
        
        # Supprimer les fichiers physiques
        for image in images:
            if os.path.exists(image.image_path):
                try:
                    os.remove(image.image_path)
                except Exception as e:
                    print(f"Erreur lors de la suppression de {image.image_path}: {e}")
        
        # Supprimer de la base de données
        db.query(TrainingImage).filter(
            TrainingImage.student_id == student_id
        ).delete()
        db.commit()
        
        return {"message": "Images supprimées avec succès"}
    
    @staticmethod
    def retrain_model():
        """
        Réentraîner le modèle de reconnaissance faciale
        Cette méthode utilise le code existant de train_model.py
        """
        try:
            from train_model import train_model
            train_model()
            return {"message": "Modèle réentraîné avec succès"}
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de l'entraînement du modèle: {str(e)}"
            )
    
    @staticmethod
    def recognize_face(db: Session, image_base64: str, student_id: int) -> dict:
        """
        Reconnaître un visage à partir d'une image base64
        Retourne le résultat de la reconnaissance avec la confiance
        """
        try:
            # Décoder l'image base64
            img_data = base64.b64decode(image_base64)
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return {
                    "success": False,
                    "message": "Image invalide",
                    "confidence": 0.0
                }
            
            # Charger le détecteur de visage
            face_detector = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            )
            
            # Détecter les visages
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = face_detector.detectMultiScale(gray, 1.3, 5)
            
            if len(faces) == 0:
                return {
                    "success": False,
                    "message": "Aucun visage détecté",
                    "confidence": 0.0
                }
            
            # Utiliser DeepFace pour la reconnaissance
            try:
                from deepface import DeepFace
                
                # Obtenir le chemin du dataset de l'étudiant
                student = db.query(Student).filter(Student.student_id == student_id).first()
                if not student:
                    return {
                        "success": False,
                        "message": "Étudiant introuvable",
                        "confidence": 0.0
                    }
                
                folder_name = f"{student_id}_{student.full_name.replace(' ', '_')}"
                # Utiliser le dossier racine pour profiter du fichier .pkl global (index)
                # C'est la même logique que dans recognize_attendance.py
                global_dataset_path = settings.DATASET_DIR
                
                # Sauvegarder l'image temporaire HORS du dossier dataset pour éviter qu'elle soit indexée
                # On utilise un fichier unique pour éviter de remplir le disque
                temp_dir = os.path.join(os.getcwd(), "temp_recognition")
                if not os.path.exists(temp_dir):
                    os.makedirs(temp_dir)
                    
                temp_path = os.path.join(temp_dir, f"temp_{student_id}.jpg")
                cv2.imwrite(temp_path, img)
                
                # Effectuer la reconnaissance sur TOUTE la base
                results = DeepFace.find(
                    img_path=temp_path,
                    db_path=global_dataset_path,
                    model_name="Facenet",  # Doit correspondre au fichier .pkl
                    detector_backend="opencv",
                    enforce_detection=False,
                    silent=True
                )
                
                # Nettoyer le fichier temporaire
                if os.path.exists(temp_path):
                    os.remove(temp_path)
                
                # Analyser le résultat
                for df in results:
                    if not df.empty:
                        # DeepFace peut retourner plusieurs matchs, on prend le meilleur
                        best_match = df.iloc[0]
                        identity_path = best_match['identity']
                        
                        # Vérifier si l'identité trouvée correspond à notre étudiant
                        if folder_name in identity_path:
                            # Visage reconnu et correspond à l'étudiant !
                            distance = best_match['distance'] if 'distance' in best_match else 0.0
                            # Conversion explicite en float standard pour éviter l'erreur SQLAlchemy avec numpy.float64
                            confidence = float(max(0.0, 1.0 - distance))
                            
                            # Extraire les coordonnées du visage pour le frontend
                            face_area = None
                            if 'source_x' in best_match:
                                face_area = {
                                    "x": int(best_match['source_x']),
                                    "y": int(best_match['source_y']),
                                    "w": int(best_match['source_w']),
                                    "h": int(best_match['source_h'])
                                }
                            
                            if confidence >= 0.4:
                                return {
                                    "success": True,
                                    "message": "Visage reconnu",
                                    "confidence": round(confidence, 2),
                                    "face_area": face_area
                                }
                        else:
                            # Visage reconnu mais c'est quelqu'un d'autre !
                            recognized_name = identity_path.split(os.sep)[-2] # Extrait le nom du dossier
                            print(f"[AUTH FAIL] Reconnu comme {recognized_name} au lieu de {folder_name}")
                            return {
                                "success": False,
                                "message": f"Identité incorrecte. Reconnu comme: {recognized_name}",
                                "confidence": 0.0,
                                "face_area": face_area
                            }

                return {
                    "success": False,
                    "message": "Visage non reconnu ou ne correspond pas à votre profil",
                    "confidence": 0.0,
                    "face_area": None
                }
                
            except Exception as e:
                print(f"Erreur DeepFace: {e}")
                return {
                    "success": False,
                    "message": f"Erreur lors de la reconnaissance: {str(e)}",
                    "confidence": 0.0
                }
                
        except Exception as e:
            return {
                "success": False,
                "message": f"Erreur lors du traitement de l'image: {str(e)}",
                "confidence": 0.0
            }
    
    @staticmethod
    def verify_face_image(image_base64: str) -> bool:
        """Vérifier qu'une image contient un visage valide"""
        try:
            # Décoder l'image
            img_data = base64.b64decode(image_base64)
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return False
            
            # Détecter le visage
            face_detector = cv2.CascadeClassifier(
                cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            )
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = face_detector.detectMultiScale(gray, 1.3, 5)
            
            return len(faces) > 0
            
        except Exception:
            return False
