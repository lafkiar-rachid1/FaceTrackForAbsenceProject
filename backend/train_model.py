import os
from deepface import DeepFace

# Constants
DATASET_DIR = "dataset"
MODELS_DIR = "models"
# DeepFace creates a representation file in the dataset directory automatically.
# e.g., representations_vgg_face.pkl

def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)

def train_model():
    print("[INFO] Checking dataset...")
    
    if not os.path.exists(DATASET_DIR):
        print(f"Erreur: Le dossier '{DATASET_DIR}' n'existe pas.")
        return

    # DeepFace 'find' will automatically build the index (representations file) 
    # if it doesn't exist. We can trigger this by running a dummy find 
    # or just initializing the build_model. 
    # But the most robust way to ensure the .pkl is created is to run a find against the db.
    
    print("[INFO] Using Facenet model for faster CPU processing...")
    print("[INFO] Indexing faces in dataset... This might take a while on first run (downloading models + processing).")
    
    try:
        # We need at least one image to find. We can pick the first image in dataset as target,
        # just to trigger the indexing.
        sample_img = None
        for root, dirs, files in os.walk(DATASET_DIR):
            for file in files:
                if file.endswith("jpg") or file.endswith("png"):
                    sample_img = os.path.join(root, file)
                    break
            if sample_img: break
            
        if not sample_img:
            print("[ERROR] dataset is empty.")
            return

        # Trigger indexing with Facenet model (same as recognition script)
        # enforce_detection=False allows it to proceed even if the sample image detection fails 
        # (though likely it won't if we just captured it), but the goal here is to build the DB index.
        DeepFace.find(
            img_path=sample_img, 
            db_path=DATASET_DIR, 
            model_name="Facenet",  # Changed from default VGG-Face
            detector_backend="opencv",  # Use fastest detector
            enforce_detection=False, 
            silent=True
        )
        
        print(f"[SUCCESS] Dataset indexed with Facenet model. Representations saved in '{DATASET_DIR}'.")
        
    except Exception as e:
        print(f"[ERROR] during indexing: {e}")
        # Note: If it fails on finding the specific sample, it might still have built the index.

if __name__ == "__main__":
    train_model()
