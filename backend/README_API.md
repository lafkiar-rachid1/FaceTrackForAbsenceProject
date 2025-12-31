# FaceTrack Absence System - Backend

Système de présence par reconnaissance faciale utilisant FastAPI, PostgreSQL et DeepFace.

## 🚀 Installation

### 1. Prérequis

- Python 3.10+
- PostgreSQL 14+
- Webcam (pour la capture d'images)

### 2. Installation des dépendances

```bash
pip install -r requirements.txt
```

### 3. Configuration de la base de données

1. Créer une base de données PostgreSQL:

```sql
CREATE DATABASE facetrack_db;
```

2. Exécuter le script SQL pour créer les tables:

```bash
psql -U postgres -d facetrack_db -f init_db.sql
```

### 4. Configuration de l'environnement

1. Copier le fichier `.env.example` en `.env`:

```bash
copy .env.example .env
```

2. Modifier les valeurs dans `.env`:

```env
DATABASE_URL=postgresql://postgres:votre_mot_de_passe@localhost:5432/facetrack_db
SECRET_KEY=votre-clé-secrète-très-sécurisée
```

### 5. Lancer l'application

```bash
python main.py
```

Ou avec uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

L'API sera accessible sur: http://localhost:8000

Documentation Swagger: http://localhost:8000/docs

## 📁 Structure du projet

```
backend/
├── api/                    # Endpoints FastAPI
│   ├── auth.py            # Authentification (login/register)
│   ├── students.py        # Gestion des étudiants
│   └── attendance.py      # Gestion de présence
├── services/              # Logique métier
│   ├── auth_service.py    # Service d'authentification
│   ├── student_service.py # Service étudiants
│   └── face_service.py    # Service reconnaissance faciale
├── models/                # Modèles de données
│   ├── database_models.py # Modèles SQLAlchemy
│   └── schemas.py         # Schémas Pydantic
├── database/              # Configuration DB
│   └── connection.py      # Connexion PostgreSQL
├── utils/                 # Utilitaires
│   └── security.py        # Sécurité et JWT
├── dataset/               # Images d'entraînement
├── models/                # Modèles entraînés
├── attendance/            # Fichiers CSV de présence
├── config.py              # Configuration
├── main.py                # Application principale
├── init_db.sql            # Script création tables
└── requirements.txt       # Dépendances Python
```

## 🔑 Workflow d'inscription d'un étudiant

### 1. L'étudiant s'inscrit

**Endpoint:** `POST /api/auth/register/student`

```json
{
  "full_name": "Omar Bouhaddach",
  "email": "omar@example.com",
  "phone": "+212600000000",
  "enrollment_number": "101",
  "username": "omar_b",
  "password": "secure_password"
}
```

**Réponse:**

```json
{
  "student": {
    "student_id": 1,
    "full_name": "Omar Bouhaddach",
    "email": "omar@example.com",
    ...
  },
  "message": "Étudiant créé avec succès. Veuillez capturer vos images faciales.",
  "requires_face_capture": true
}
```

### 2. Capture des images faciales

**Endpoint:** `POST /api/students/capture-faces`

Le frontend doit:
1. Ouvrir la caméra
2. Capturer 10-30 images du visage
3. Encoder chaque image en base64
4. Envoyer via l'API

```json
{
  "student_id": 1,
  "images_base64": [
    "base64_image_1...",
    "base64_image_2...",
    ...
  ]
}
```

### 3. L'étudiant peut se connecter

**Endpoint:** `POST /api/auth/login/student`

```json
{
  "username": "omar_b",
  "password": "secure_password"
}
```

## 📚 Endpoints principaux

### Authentification

- `POST /api/auth/login/user` - Login admin/professeur
- `POST /api/auth/login/student` - Login étudiant
- `POST /api/auth/register/student` - Inscription étudiant
- `GET /api/auth/me/user` - Profil utilisateur
- `GET /api/auth/me/student` - Profil étudiant

### Étudiants

- `POST /api/students/capture-faces` - Capturer images faciales
- `GET /api/students/` - Lister tous les étudiants
- `GET /api/students/{id}` - Détails d'un étudiant
- `PUT /api/students/{id}` - Mettre à jour
- `DELETE /api/students/{id}` - Supprimer
- `POST /api/students/retrain-model` - Réentraîner le modèle

### Présence

- `POST /api/attendance/` - Marquer présence
- `GET /api/attendance/session/{id}` - Présences d'une session
- `GET /api/attendance/student/{id}` - Présences d'un étudiant
- `GET /api/attendance/student/{id}/stats` - Statistiques
- `GET /api/attendance/me/attendance` - Mes présences
- `GET /api/attendance/me/stats` - Mes statistiques

## 🗄️ Base de données

### Tables principales

1. **roles** - Rôles utilisateurs (admin, prof, student)
2. **users** - Utilisateurs (admin et professeurs)
3. **students** - Étudiants
4. **student_logins** - Identifiants de connexion des étudiants
5. **training_images** - Images d'entraînement pour reconnaissance faciale
6. **courses** - Cours
7. **sessions** - Séances de cours
8. **attendance** - Présence
9. **logs** - Logs système
10. **notifications** - Notifications
11. **course_enrollments** - Inscription des étudiants aux cours

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

Pour accéder aux endpoints protégés:

```http
Authorization: Bearer <votre_token>
```

## 🎯 Scripts utiles

### Créer un administrateur

```python
from database import SessionLocal
from models.database_models import User, Role
from utils.security import get_password_hash

db = SessionLocal()
admin_role = db.query(Role).filter(Role.role_name == "admin").first()

admin = User(
    username="admin",
    password_hash=get_password_hash("admin123"),
    full_name="Administrateur",
    role_id=admin_role.role_id
)

db.add(admin)
db.commit()
```

### Réentraîner le modèle

```bash
python train_model.py
```

### Capturer des visages (ancienne méthode)

```bash
python capture_faces.py
```

### Reconnaissance en temps réel

```bash
python recognize_attendance.py
```

## 🐛 Dépannage

### Erreur de connexion PostgreSQL

Vérifiez que PostgreSQL est démarré et que les informations dans `.env` sont correctes.

### Erreur "No module named 'deepface'"

```bash
pip install deepface
```

### Erreur de caméra

Vérifiez que la webcam est connectée et pas utilisée par une autre application.

## 📝 License

Ce projet est sous licence MIT.

## 👥 Auteurs

- Équipe FaceTrack - ENSET
