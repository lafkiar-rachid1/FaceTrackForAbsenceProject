import cv2
import os
import sys
import numpy as np

# Configuration
SOURCE_IMAGE = r"C:\Users\bouha\OneDrive\Dokumente\Cycle Ingenieur\S1\Base de donnes\Project_Base_Donne\image.png"
STUDENT_NAME = "Omar_Bouhaddach"
STUDENT_ID = "101"
DATASET_DIR = "dataset"
HAAR_CASCADE_PATH = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
MAX_IMAGES = 30

def create_dataset_from_image():
    # Setup paths
    folder_name = f"{STUDENT_ID}_{STUDENT_NAME}"
    student_path = os.path.join(DATASET_DIR, folder_name)
    
    if not os.path.exists(student_path):
        os.makedirs(student_path)
        print(f"[INFO] Dossier créé: {student_path}")
    
    # Load image
    if not os.path.exists(SOURCE_IMAGE):
        print(f"[ERREUR] Image non trouvée: {SOURCE_IMAGE}")
        return

    img = cv2.imread(SOURCE_IMAGE)
    if img is None:
        print("[ERREUR] Impossible de lire l'image.")
        return

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Detect face
    detector = cv2.CascadeClassifier(HAAR_CASCADE_PATH)
    faces = detector.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) == 0:
        print("[ERREUR] Aucun visage détecté dans l'image fournie.")
        return
        
    print(f"[INFO] Visage détecté. Génération de {MAX_IMAGES} images...")
    
    # Take the largest face found
    (x, y, w, h) = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)[0]
    
    face_roi = gray[y:y+h, x:x+w]
    
    # Generate images (with slight augmentation simply by saving duplicates for now, 
    # LBPH handles identical inputs fine, though variance is better)
    for i in range(MAX_IMAGES):
        save_path = os.path.join(student_path, f"{STUDENT_NAME}_{i+1}.jpg")
        cv2.imwrite(save_path, img[y:y+h, x:x+w])
        
    print(f"[SUCCÈS] Dataset généré pour {STUDENT_NAME} avec ID {STUDENT_ID}")

if __name__ == "__main__":
    create_dataset_from_image()
