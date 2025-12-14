# Face Track - Système de Gestion des Absences par Reconnaissance Faciale

## Description
Application de gestion des absences utilisant la reconnaissance faciale pour automatiser le suivi de présence.

## Architecture du Projet

### Backend (FastAPI)
- **Framework**: FastAPI
- **Base de données**: PostgreSQL avec SQLAlchemy
- **Reconnaissance faciale**: face_recognition + OpenCV
- **Authentification**: JWT avec python-jose

#### Structure Backend
```
backend/
├── main.py                 # Point d'entrée de l'application
├── requirements.txt        # Dépendances Python
├── .env.example           # Variables d'environnement exemple
└── app/
    ├── __init__.py
    ├── config.py          # Configuration de l'app
    ├── database.py        # Configuration base de données
    ├── models/            # Modèles SQLAlchemy
    │   ├── user.py
    │   └── attendance.py
    ├── schemas/           # Schémas Pydantic
    │   ├── user.py
    │   └── attendance.py
    ├── services/          # Logique métier
    │   ├── auth_service.py
    │   ├── user_service.py
    │   ├── attendance_service.py
    │   └── face_service.py
    └── api/
        └── routes/        # Routes API
            ├── auth.py
            ├── users.py
            ├── attendance.py
            └── face_recognition.py
```

### Frontend (React + Vite + Tailwind)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router
- **HTTP Client**: Axios

#### Structure Frontend
```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env
└── src/
    ├── main.jsx           # Point d'entrée
    ├── App.jsx            # Composant principal
    ├── index.css          # Styles Tailwind
    ├── components/        # Composants réutilisables
    │   └── Layout.jsx
    ├── pages/             # Pages de l'application
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   ├── Dashboard.jsx
    │   ├── FaceRegistration.jsx
    │   ├── Attendance.jsx
    │   ├── AttendanceHistory.jsx
    │   └── Users.jsx
    ├── services/          # Services API
    │   ├── api.js
    │   └── index.js
    └── store/             # State management
        └── authStore.js
```

## Installation

### Backend

1. Créer un environnement virtuel:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Installer les dépendances:
```bash
pip install -r requirements.txt
```

3. Configurer les variables d'environnement:
```bash
copy .env.example .env
# Éditer .env avec vos configurations
```

4. Lancer le serveur:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

1. Installer les dépendances:
```bash
cd frontend
npm install
```

2. Lancer le serveur de développement:
```bash
npm run dev
```

L'application sera accessible sur http://localhost:5173

## Fonctionnalités

### Authentification
- Inscription des utilisateurs
- Connexion avec JWT
- Gestion des rôles (étudiant, enseignant, admin)

### Reconnaissance Faciale
- Enregistrement du visage via webcam ou upload
- Vérification d'identité par reconnaissance faciale
- Marquage automatique de présence

### Gestion des Présences
- Enregistrement des présences par reconnaissance faciale
- Historique des présences
- Statistiques de présence
- Filtrage par période

### Administration
- Gestion des utilisateurs
- Vue d'ensemble des présences
- Suppression d'utilisateurs

## API Endpoints

### Authentification
- POST `/api/auth/register` - Inscription
- POST `/api/auth/login` - Connexion
- GET `/api/auth/me` - Utilisateur connecté

### Utilisateurs
- GET `/api/users` - Liste des utilisateurs
- GET `/api/users/{id}` - Détails utilisateur
- DELETE `/api/users/{id}` - Supprimer utilisateur

### Présences
- POST `/api/attendance` - Créer présence
- GET `/api/attendance` - Toutes les présences
- GET `/api/attendance/user/{id}` - Présences par utilisateur
- PUT `/api/attendance/{id}/checkout` - Enregistrer sortie

### Reconnaissance Faciale
- POST `/api/face/register-face/{user_id}` - Enregistrer visage
- POST `/api/face/verify-face` - Vérifier identité
- POST `/api/face/attendance-with-face` - Marquer présence

## Technologies

### Backend
- FastAPI
- SQLAlchemy
- face-recognition
- OpenCV
- python-jose
- Pydantic

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- Zustand
- react-webcam
- lucide-react

## Base de Données

### Tables principales:
- **users**: Informations utilisateurs et encodages faciaux
- **attendance**: Enregistrements de présence

## Sécurité
- Authentification JWT
- Hachage des mots de passe avec bcrypt
- CORS configuré
- Validation des données avec Pydantic
