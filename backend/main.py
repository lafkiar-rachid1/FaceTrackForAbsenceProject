"""
Application principale FastAPI
Système de Présence par Reconnaissance Faciale
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from config import settings
from database import init_db
from api import auth, students, attendance, admin, professor


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'application"""
    # Startup
    print("🚀 Démarrage de l'application...")
    print("📊 Initialisation de la base de données...")
    # init_db()  # Décommenter pour créer les tables automatiquement
    print("✅ Application prête!")
    
    yield
    
    # Shutdown
    print("👋 Arrêt de l'application...")


# Créer l'application FastAPI
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
    ## Système de Présence par Reconnaissance Faciale
    
    Cette API permet de gérer un système de présence basé sur la reconnaissance faciale.
    
    ### Fonctionnalités principales:
    
    * **Authentification**: Login pour étudiants, professeurs et administrateurs
    * **Gestion des étudiants**: CRUD complet avec capture d'images faciales
    * **Gestion de présence**: Marquage automatique et manuel de présence
    * **Statistiques**: Taux de présence par étudiant
    
    ### Workflow d'inscription d'un étudiant:
    
    1. L'étudiant s'inscrit via `/api/auth/register/student`
    2. Le système retourne `requires_face_capture: true`
    3. Le frontend ouvre la caméra et capture 10-30 images
    4. Les images sont envoyées via `/api/students/capture-faces`
    5. L'étudiant peut maintenant se connecter et marquer sa présence
    
    ### Technologies:
    
    * **Backend**: FastAPI + PostgreSQL + SQLAlchemy
    * **Recognition**: DeepFace (Facenet) + OpenCV
    * **Authentication**: JWT (JSON Web Tokens)
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Inclure les routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(attendance.router)
app.include_router(admin.router)
app.include_router(professor.router)


# Route de base
@app.get("/", tags=["Root"])
def read_root():
    """Page d'accueil de l'API"""
    return {
        "message": "Bienvenue sur l'API FaceTrack Absence System",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "redoc": "/redoc"
    }


# Route de santé
@app.get("/health", tags=["Health"])
def health_check():
    """Vérifier l'état de l'API"""
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "database": "connected"  # TODO: Vérifier vraiment la connexion
    }


# Gestionnaire d'erreurs personnalisé
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Gestionnaire global d'exceptions"""
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Une erreur interne s'est produite",
            "error": str(exc) if settings.DEBUG else "Internal Server Error"
        }
    )


if __name__ == "__main__":
    import uvicorn
    
    print("=" * 50)
    print(f"🎯 {settings.APP_NAME}")
    print(f"📦 Version: {settings.APP_VERSION}")
    print("=" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
