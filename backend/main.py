from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, users, attendance, face_recognition

app = FastAPI(
    title="Face Track Absence API",
    description="API pour la gestion des absences par reconnaissance faciale",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(face_recognition.router, prefix="/api/face", tags=["Face Recognition"])

@app.get("/")
async def root():
    return {"message": "Face Track Absence API - Version 1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
