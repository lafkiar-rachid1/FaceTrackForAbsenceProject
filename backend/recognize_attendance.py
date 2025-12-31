import cv2
import os
import pandas as pd
from datetime import datetime
from deepface import DeepFace
import time

# Constants
DATASET_DIR = "dataset"
ATTENDANCE_DIR = "attendance"

def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)

def mark_attendance(full_path_or_name):
    # Depending on DeepFace version, it returns full path or relative.
    # We assume 'full_path_or_name' contains the folder name "ID_Name"
    
    create_directory(ATTENDANCE_DIR)
    now = datetime.now()
    date_str = now.strftime('%Y-%m-%d')
    time_str = now.strftime('%H:%M:%S')
    filename = os.path.join(ATTENDANCE_DIR, f"{date_str}.csv")
    
    columns = ['ID', 'Nom', 'Date', 'Heure']
    
    if not os.path.exists(filename):
        df = pd.DataFrame(columns=columns)
        df.to_csv(filename, index=False)
    else:
        df = pd.read_csv(filename)
    
    # Extract ID_Name from path
    # Path example: .../dataset/101_Omar/Omar_1.jpg
    # We want "101_Omar"
    
    try:
        norm_path = os.path.normpath(full_path_or_name)
        path_parts = norm_path.split(os.sep)
        
        # Assumption: structure is dataset / ID_Name / image.jpg
        # Find 'dataset' index
        if "dataset" in path_parts:
            idx = path_parts.index("dataset")
            if idx + 1 < len(path_parts):
                folder_name = path_parts[idx+1]
            else:
                folder_name = "Unknown"
        else:
            # Fallback if structure is different
            folder_name = os.path.basename(os.path.dirname(full_path_or_name))
            
    except:
        folder_name = "Unknown"

    if "_" in folder_name:
         student_id, student_name = folder_name.split("_", 1)
    else:
         student_id = folder_name
         student_name = folder_name

    # Check if already marked
    if str(student_id) in df['ID'].astype(str).values:
        return False, student_name
        
    new_entry = {
        'ID': student_id,
        'Nom': student_name,
        'Date': date_str,
        'Heure': time_str
    }
    
    df.loc[len(df)] = new_entry
    df.to_csv(filename, index=False)
    print(f"[PRESENT] {student_name} marked at {time_str}")
    return True, student_name

def recognize():
    import threading
    import queue
    
    print("[INFO] Starting Optimized DeepFace Recognition...")
    print("[INFO] Loading camera...")

    cam = cv2.VideoCapture(0)
    if not cam.isOpened():
        print("[ERROR] Could not open camera.")
        return
        
    print("[INFO] Camera started. Press 'q' to quit.")
    print("[INFO] Using Facenet model for faster CPU processing...")
    
    # Thread-safe queue for recognition results
    result_queue = queue.Queue()
    recognition_queue = queue.Queue(maxsize=2)  # Limit queue size
    
    # Shared state
    frame_count = 0
    current_names = []
    current_locations = []
    last_recognition_time = time.time()
    
    # FPS calculation
    fps_start_time = time.time()
    fps_frame_count = 0
    current_fps = 0
    
    # Use Haar cascade for fast detection to draw boxes every frame
    face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    # Recognition worker thread
    def recognition_worker():
        while True:
            try:
                frame_data = recognition_queue.get(timeout=1)
                if frame_data is None:  # Poison pill to stop thread
                    break
                    
                frame, frame_id = frame_data
                
                try:
                    # Use Facenet for faster CPU processing (3-5x faster than VGG-Face)
                    results = DeepFace.find(
                        img_path=frame, 
                        db_path=DATASET_DIR, 
                        model_name="Facenet",  # Changed from VGG-Face
                        detector_backend="opencv",  # Fastest detector
                        enforce_detection=False,
                        silent=True
                    )
                    
                    names = []
                    locations = []
                    
                    for df in results:
                        if not df.empty:
                            best_match = df.iloc[0]
                            identity = best_match['identity']
                            
                            # Mark Attendance
                            marked, name = mark_attendance(identity)
                            
                            if 'source_x' in best_match:
                                x = int(best_match['source_x'])
                                y = int(best_match['source_y'])
                                w = int(best_match['source_w'])
                                h = int(best_match['source_h'])
                                locations.append((x, y, w, h))
                                names.append(name)
                    
                    result_queue.put((names, locations, frame_id))
                    
                except Exception as e:
                    # Silently continue on errors
                    pass
                    
            except queue.Empty:
                continue
    
    # Start recognition thread
    recognition_thread = threading.Thread(target=recognition_worker, daemon=True)
    recognition_thread.start()

    try:
        while True:
            ret, frame = cam.read()
            if not ret:
                break
                
            frame_count += 1
            fps_frame_count += 1
            
            # Calculate FPS every second
            elapsed_time = time.time() - fps_start_time
            if elapsed_time > 1.0:
                current_fps = fps_frame_count / elapsed_time
                fps_frame_count = 0
                fps_start_time = time.time()
            
            # Fast detection on resized frame for high FPS
            small_frame_detect = cv2.resize(frame, (320, 240)) # Fixed small size for consistent speed
            gray_small = cv2.cvtColor(small_frame_detect, cv2.COLOR_BGR2GRAY)
            
            # Detect faces on small image
            small_faces = face_detector.detectMultiScale(gray_small, 1.3, 5)
            
            # Scale coordinates back to original frame size
            faces = []
            scale_x = frame.shape[1] / 320
            scale_y = frame.shape[0] / 240
            
            for (x, y, w, h) in small_faces:
                real_x = int(x * scale_x)
                real_y = int(y * scale_y)
                real_w = int(w * scale_x)
                real_h = int(h * scale_y)
                faces.append((real_x, real_y, real_w, real_h))
            
            # Process every 5 frames for recognition (balanced speed/update rate)
            if frame_count % 5 == 0 and len(faces) > 0:
                # We send the ORIGINAL frame (or slightly resized) to ensure MAX ACCURACY for model
                # But to keep analysis fast, we can use a moderate scale like 0.75 or just original depending on CPU.
                # User asked for "same performance" (accuracy) so let's send original crop or reasonable size.
                # DeepFace will resize internally anyway, but sending massive images slows down pre-processing.
                # Let's use a dynamic approach or stick to the previous 0.75 which was likely fine, or use original if resolution is standard.
                
                # Optimized: Send a copy for recognition to avoid threading race conditions on 'frame' array
                recog_frame = frame.copy() 
                
                # Add to queue if not full
                if not recognition_queue.full():
                    recognition_queue.put((recog_frame, frame_count))
            
            # Check for new results
            try:
                while not result_queue.empty():
                    names, locations, frame_id = result_queue.get_nowait()
                    current_locations = locations # These are already in original scale from the thread
                    current_names = names
                    last_recognition_time = time.time()
            except queue.Empty:
                pass
            
            # --- TRACKING LOGIC ---
            # Match current 'fast' detections (faces) with 'known' recognitions (current_locations)
            # This makes the Green Box "stick" to the face at 30 FPS!
            matched_faces_indices = set()
            
            if len(current_locations) > 0 and len(faces) > 0:
                updated_locations = []
                updated_names = []
                
                for i, (rx, ry, rw, rh) in enumerate(current_locations):
                    best_match_idx = -1
                    min_dist = float('inf')
                    
                    r_center = (rx + rw//2, ry + rh//2)
                    
                    for j, (x, y, w, h) in enumerate(faces):
                        if j in matched_faces_indices: continue
                        
                        face_center = (x + w//2, y + h//2)
                        dist = ((r_center[0] - face_center[0])**2 + (r_center[1] - face_center[1])**2)**0.5
                        
                        # If centers are close (e.g., within 100 pixels), assume same person
                        if dist < 100: 
                            if dist < min_dist:
                                min_dist = dist
                                best_match_idx = j
                    
                    if best_match_idx != -1:
                        # Found a match! Update known face location to the NEW detection
                        # This gives us the "smooth" 30FPS movement for the persistent green box
                        updated_locations.append(faces[best_match_idx])
                        updated_names.append(current_names[i])
                        matched_faces_indices.add(best_match_idx)
                        
                        # IMPORTANT: Reset timer so it doesn't disappear while we are tracking it
                        last_recognition_time = time.time() 
                    else:
                        # Lost track temporarily (or face turned), keep old position briefly
                        updated_locations.append((rx, ry, rw, rh))
                        updated_names.append(current_names[i])
                
                # Update our main lists with the tracked positions
                current_locations = updated_locations
                current_names = updated_names
            
            # Clear old results if NO face has been seen/tracked for 2 seconds
            if time.time() - last_recognition_time > 2.0:
                current_locations = []
                current_names = []
            
            # Draw results
            
            # 1. Draw UNRECOGNIZED faces (Blue box)
            # These are faces in 'faces' that were NOT matched to a known person
            for idx, (x, y, w, h) in enumerate(faces):
                if idx not in matched_faces_indices:
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
                    # cv2.putText(frame, "Scanning...", (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)
                    
            # 2. Draw RECOGNIZED faces (Green box) - Now synchronized with detection!
            for (x, y, w, h), name in zip(current_locations, current_names):
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
                # Fancy background for text
                label_size, baseline = cv2.getTextSize(name, cv2.FONT_HERSHEY_SIMPLEX, 0.9, 2)
                cv2.rectangle(frame, (x, y - label_size[1] - 10), (x + label_size[0], y), (0, 255, 0), cv2.FILLED)
                cv2.putText(frame, name, (x, y-5), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 0), 2)
            
            # Display FPS counter
            cv2.putText(frame, f"FPS: {current_fps:.1f}", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            
            # Display Status
            status_text = "Status: Monitoring" if len(faces) > 0 else "Status: Idle"
            cv2.putText(frame, status_text, (10, 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 1)

            cv2.imshow('Optimized Face Attendance', frame)
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
    
    finally:
        # Cleanup
        recognition_queue.put(None)  # Stop worker thread
        recognition_thread.join(timeout=2)
        cam.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    recognize()
