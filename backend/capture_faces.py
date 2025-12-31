import cv2
import os
import sys

# Constants
DATASET_DIR = "dataset"
HAAR_CASCADE_PATH = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
MAX_IMAGES = 30

def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)

def capture_faces():
    print("=== Enregistrement d'un nouvel étudiant ===")
    student_id = input("Entrez l'ID de l'étudiant (ex: 101): ").strip()
    student_name = input("Entrez le Nom de l'étudiant (ex: Omar): ").strip()
    
    if not student_id or not student_name:
        print("Erreur: ID et Nom sont obligatoires.")
        return

    folder_name = f"{student_id}_{student_name}"
    student_path = os.path.join(DATASET_DIR, folder_name)
    
    create_directory(student_path)
    
    # Initialize camera
    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        print("Erreur: Impossible d'ouvrir la caméra")
        return

    # Load face detector
    face_detector = cv2.CascadeClassifier(HAAR_CASCADE_PATH)
    
    print("\n[INFO] La caméra va s'ouvrir.")
    print("[INFO] Regardez la caméra et bougez légèrement la tête.")
    print("[INFO] Appuyez sur 'c' pour commencer la capture ou 'q' pour quitter.")

    count = 0
    capturing = False
    
    while True:
        ret, frame = cam.read()
        if not ret:
            print("Erreur: Impossible de lire le flux vidéo")
            break
            
        # Optimize detection speed by resizing
        small_frame = cv2.resize(frame, (320, 240))
        gray_small = cv2.cvtColor(small_frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces on small frame
        faces_small = face_detector.detectMultiScale(gray_small, 1.3, 5)
        
        # Scale back coordinates
        scale_x = frame.shape[1] / 320
        scale_y = frame.shape[0] / 240
        
        # Status Text
        if capturing:
            cv2.putText(frame, "STATUS: CAPTURING...", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        else:
            cv2.putText(frame, "PRESS 'C' TO START", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        for (sx, sy, sw, sh) in faces_small:
            # Scale coordinates to original frame
            x = int(sx * scale_x)
            y = int(sy * scale_y)
            w = int(sw * scale_x)
            h = int(sh * scale_y)
            
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            
            if capturing:
                count += 1
                # Save the captured image into the datasets folder
                img_path = os.path.join(student_path, f"{student_name}_{count}.jpg")
                # Save in COLOR (frame is BGR)
                cv2.imwrite(img_path, frame[y:y+h, x:x+w])
                
                # Display success text
                cv2.putText(frame, f"Count: {count}/{MAX_IMAGES}", (x, y-10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
            
            # Stop if we have enough images
            if count >= MAX_IMAGES:
                break

        cv2.imshow('Enregistrement Visage', frame)

        # Reduced wait time for better responsiveness
        k = cv2.waitKey(1) & 0xff
        
        # Check for 'q' (Quit)
        if k == ord('q') or k == ord('Q'):
            print("[INFO] Quitting...")
            break
        
        # Check for 'c' (Capture) - Handle both lowercase and uppercase
        elif k == ord('c') or k == ord('C'):
            print("[INFO] 'C' Pressed! Starting capture...")
            capturing = True
            
        if count >= MAX_IMAGES:
            print(f"\n[SUCCÈS] {count} images capturées pour {student_name}.")
            break

    # Cleanup
    cam.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    create_directory(DATASET_DIR)
    capture_faces()
