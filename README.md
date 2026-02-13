# 🎓 FaceTrack - Système de Gestion des Absences par Reconnaissance Faciale

## 📋 Description
Application complète de gestion des absences pour les établissements d'enseignement, utilisant la reconnaissance faciale pour automatiser le suivi de présence. Système multi-rôles (Administrateur, Professeur, Étudiant) avec interface moderne et intuitive.

## 🏗️ Architecture du Projet

### Backend (FastAPI + PostgreSQL + OpenCV)
- **Framework**: FastAPI
- **Base de données**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentification**: JWT (python-jose)
- **Reconnaissance faciale**: OpenCV, face_recognition, DeepFace, TensorFlow
- **Validation**: Pydantic

#### Structure Backend
```
backend/
├── main.py                    # Point d'entrée FastAPI
├── config.py                  # Configuration de l'application
├── requirements.txt           # Dépendances Python
├── init_db.sql               # Script d'initialisation de la BD
├── Dockerfile                # Image Docker backend
├── .env                      # Variables d'environnement
│
├── api/                      # Routes API
│   ├── __init__.py
│   ├── auth.py              # Authentification et inscription
│   ├── admin.py             # Endpoints administrateur
│   ├── professor.py         # Endpoints professeur
│   ├── students.py          # Endpoints étudiant
│   └── attendance.py        # Gestion des présences
│
├── services/                 # Logique métier
│   ├── __init__.py
│   ├── auth_service.py      # Service d'authentification
│   ├── admin_service.py     # Service admin
│   ├── professor_service.py # Service professeur
│   ├── student_service.py   # Service étudiant
│   └── face_service.py      # Service reconnaissance faciale
│
├── models/                   # Modèles de données
│   ├── __init__.py
│   ├── database_models.py   # Modèles SQLAlchemy
│   ├── schemas.py           # Schémas Pydantic
│   └── face_model.yml       # Modèle ML entraîné
│
├── database/                 # Configuration BD
│   ├── __init__.py
│   └── connection.py        # Connexion PostgreSQL
│
├── utils/                    # Utilitaires
│   ├── __init__.py
│   └── security.py          # Sécurité et JWT
│
├── dataset/                  # Images d'entraînement
│   └── {student_id}_{nom}/  # Dossiers par étudiant
│
├── temp_recognition/         # Images temporaires
├── attendance/              # Fichiers CSV de présence
│
└── Scripts utilitaires:
    ├── capture_faces.py      # Capture des visages
    ├── train_model.py        # Entraînement du modèle
    ├── recognize_attendance.py # Test reconnaissance
    ├── create_test_users.py # Création utilisateurs test
    ├── check_enrollments.py # Vérification inscriptions
    └── reset_users.py       # Réinitialisation utilisateurs
```

### Frontend (React + Vite + Tailwind CSS)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand (AuthContext)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Components**: Lucide React, React Icons

#### Structure Frontend
```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.cjs
├── Dockerfile                # Image Docker frontend
├── nginx.conf               # Configuration Nginx
├── .env                     # Variables d'environnement
│
└── src/
    ├── main.jsx             # Point d'entrée
    ├── App.jsx              # Composant principal + routes
    ├── index.css            # Styles Tailwind
    │
    ├── pages/               # Pages de l'application
    │   ├── Home.jsx         # Page d'accueil
    │   ├── Login.jsx        # Connexion
    │   ├── Register.jsx     # Inscription
    │   ├── AdminDashboard.jsx      # Dashboard admin
    │   ├── ProfessorDashboard.jsx  # Dashboard professeur
    │   └── StudentDashboard.jsx    # Dashboard étudiant
    │
    ├── components/          # Composants réutilisables
    │   ├── ProtectedRoute.jsx      # Protection des routes
    │   ├── LoadingSpinner.jsx      # Spinner de chargement
    │   ├── CameraCapture.jsx       # Capture webcam
    │   ├── MarkAttendance.jsx      # Marquage présence
    │   │
    │   ├── admin/          # Composants admin
    │   │   ├── HeaderAdmin.jsx
    │   │   ├── SideBarAdmin.jsx
    │   │   ├── StatsCards.jsx
    │   │   ├── CoursesTab.jsx
    │   │   ├── CourseModal.jsx
    │   │   ├── ProfessorsTab.jsx
    │   │   ├── ProfessorModal.jsx
    │   │   ├── EnrollmentsTab.jsx
    │   │   └── EnrollModal.jsx
    │   │
    │   ├── professor/      # Composants professeur
    │   │   ├── HeaderProfessor.jsx
    │   │   ├── SideBarProfessor.jsx
    │   │   ├── StatsCardsProfessor.jsx
    │   │   ├── CoursesTabProfessor.jsx
    │   │   └── SessionsTab.jsx
    │   │
    │   └── student/        # Composants étudiant
    │       ├── HeaderStudent.jsx
    │       ├── SideBarStudent.jsx
    │       ├── StatsCardsStudent.jsx
    │       ├── ProfileTab.jsx
    │       └── AttendanceTab.jsx
    │
    ├── services/            # Services API
    │   ├── api.js          # Configuration Axios
    │   ├── authService.js  # Service authentification
    │   ├── adminService.js # Service admin
    │   ├── professorService.js # Service professeur
    │   ├── studentService.js   # Service étudiant
    │   └── attendanceService.js # Service présence
    │
    └── store/              # State management
        └── AuthContext.jsx # Contexte d'authentification
```

## 🚀 Installation

### Prérequis
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optionnel)

### Option 1 : Installation Classique

#### Backend

1. **Créer un environnement virtuel:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

2. **Installer les dépendances:**
```bash
pip install -r requirements.txt
```

3. **Configurer PostgreSQL:**
```bash
# Créer la base de données
createdb facetrack_db

# Initialiser les tables
psql -U postgres -d facetrack_db -f init_db.sql
```

4. **Configurer les variables d'environnement:**
```bash
# Créer le fichier .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/facetrack_db
SECRET_KEY=votre-clé-secrète-changez-en-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

5. **Lancer le serveur:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le backend sera accessible sur http://localhost:8000
Documentation API: http://localhost:8000/docs

#### Frontend

1. **Installer les dépendances:**
```bash
cd frontend
npm install
```

2. **Configurer les variables d'environnement:**
```bash
# Créer le fichier .env
VITE_API_URL=http://localhost:8000
```

3. **Lancer le serveur de développement:**
```bash
npm run dev
```

L'application sera accessible sur http://localhost:5173

### Option 2 : Installation avec Docker 🐳

**Plus simple et recommandé !**

1. **Démarrer tous les services:**
```bash
# À la racine du projet
docker compose up -d
```

Cette commande lance automatiquement :
- 🗄️ PostgreSQL (port 5432)
- 🔧 Backend FastAPI (port 8000)
- 🌐 Frontend React/Nginx (port 80)

2. **Accéder à l'application:**
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **Documentation API**: http://localhost:8000/docs

3. **Commandes utiles:**
```bash
# Voir les logs
docker compose logs -f

# Arrêter les services
docker compose down

# Reconstruire les images
docker compose up -d --build

# Supprimer tout (y compris les volumes)
docker compose down -v
```

📖 **Documentation Docker complète:** [DOCKER_README.md](DOCKER_README.md)

## ⚡ Fonctionnalités

### 🔐 Authentification & Sécurité
- Inscription et connexion sécurisées avec JWT
- Gestion des rôles (Admin, Professeur, Étudiant)
- Hachage des mots de passe avec bcrypt
- Protection des routes par rôle

### 👨‍💼 Interface Administrateur
- **Tableau de bord avec statistiques:**
  - Nombre total d'étudiants, professeurs, cours
  - Taux de présence global
  - Sessions aujourd'hui

- **Gestion des professeurs:**
  - Création de comptes professeurs
  - Attribution de cours
  - Modification et suppression

- **Gestion des cours:**
  - Création de cours (nom, code, crédits, description)
  - Attribution aux professeurs
  - Activation/désactivation

- **Gestion des inscriptions:**
  - Inscription d'étudiants aux cours
  - Vue d'ensemble des inscriptions
  - Gestion des statuts d'inscription

### 👨‍🏫 Interface Professeur
- **Tableau de bord:**
  - Mes cours
  - Nombre de sessions
  - Sessions à venir
  - Étudiants inscrits

- **Gestion des cours:**
  - Vue des cours assignés
  - Liste des étudiants par cours
  - Statistiques de présence par cours

- **Gestion des sessions:**
  - Création de sessions de cours
  - Planification (date, horaires, lieu)
  - Marquage des sessions comme terminées
  - Vue de la liste de présence

- **Suivi des présences:**
  - Liste de présence par session
  - Marquage automatique des absents
  - Export des présences

### 🎓 Interface Étudiant
- **Profil personnel:**
  - Informations personnelles
  - Numéro d'inscription
  - Email et téléphone

- **Enregistrement facial:**
  - Capture de visage via webcam
  - Upload d'images
  - Multiple photos pour meilleure précision

- **Marquage de présence:**
  - Scan facial automatique
  - Vérification d'identité instantanée
  - Confirmation de présence en temps réel

- **Historique des présences:**
  - Vue de toutes les présences
  - Filtrage par cours
  - Statistiques personnelles
  - Taux de présence par cours

### 🤖 Reconnaissance Faciale
- **Enregistrement:**
  - Capture via webcam ou upload
  - Traitement et encodage des visages
  - Stockage sécurisé des encodages

- **Vérification:**
  - Détection en temps réel
  - Correspondance avec la base de données
  - Précision élevée avec DeepFace

- **Entraînement:**
  - Modèle ML personnalisé
  - Amélioration continue avec nouveaux visages
  - Support de multiples visages par étudiant

## 📡 API Endpoints

### Authentification (`/api/auth`)
| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| POST | `/register` | Inscription utilisateur | Public |
| POST | `/login` | Connexion | Public |
| GET | `/me` | Profil utilisateur connecté | Authentifié |

### Administrateur (`/api/admin`)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/stats` | Statistiques globales |
| GET | `/professors` | Liste des professeurs |
| POST | `/professors` | Créer un professeur |
| PUT | `/professors/{id}` | Modifier un professeur |
| DELETE | `/professors/{id}` | Supprimer un professeur |
| GET | `/courses` | Liste des cours |
| POST | `/courses` | Créer un cours |
| PUT | `/courses/{id}` | Modifier un cours |
| DELETE | `/courses/{id}` | Supprimer un cours |
| POST | `/enroll` | Inscrire un étudiant à un cours |
| GET | `/enrollments` | Liste des inscriptions |
| DELETE | `/enrollments/{id}` | Supprimer une inscription |

### Professeur (`/api/professor`)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/stats` | Statistiques du professeur |
| GET | `/courses` | Mes cours |
| GET | `/courses/{id}/students` | Étudiants d'un cours |
| GET | `/sessions` | Mes sessions |
| POST | `/sessions` | Créer une session |
| GET | `/sessions/{id}/attendance` | Liste de présence |
| PUT | `/sessions/{id}/complete` | Terminer une session |

### Étudiant (`/api/students`)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/profile` | Mon profil |
| PUT | `/profile` | Modifier mon profil |
| POST | `/upload-face` | Upload photo de visage |
| POST | `/mark-attendance` | Marquer présence avec visage |
| GET | `/attendance` | Mon historique de présence |
| GET | `/courses` | Mes cours |
| GET | `/stats` | Mes statistiques |

### Présences (`/api/attendance`)
| Méthode | Endpoint | Description | Accès |
|---------|----------|-------------|-------|
| POST | `/` | Créer une présence | Authentifié |
| GET | `/` | Liste des présences | Admin |
| GET | `/session/{id}` | Présences d'une session | Prof/Admin |
| POST | `/verify-face` | Vérifier présence par visage | Étudiant |

## 🛠️ Technologies

### Backend
| Technologie | Version | Usage |
|------------|---------|-------|
| Python | 3.11+ | Langage principal |
| FastAPI | 0.109+ | Framework web |
| SQLAlchemy | 2.0+ | ORM |
| PostgreSQL | 15+ | Base de données |
| Pydantic | 2.5+ | Validation de données |
| OpenCV | 4.10+ | Traitement d'images |
| face_recognition | - | Reconnaissance faciale |
| DeepFace | 0.0.79+ | Deep learning facial |
| TensorFlow | 2.13+ | Machine learning |
| python-jose | 3.3+ | JWT tokens |
| passlib | 1.7+ | Hachage mots de passe |
| bcrypt | 3.2.2 | Cryptographie |
| Uvicorn | 0.27+ | Serveur ASGI |

### Frontend
| Technologie | Version | Usage |
|------------|---------|-------|
| React | 18.2 | Framework UI |
| Vite | 5.0+ | Build tool |
| React Router | 6.20+ | Routing |
| Axios | 1.6+ | HTTP client |
| Tailwind CSS | 3.3+ | Styling |
| Zustand | 4.4+ | State management |
| React Webcam | 7.2+ | Capture webcam |
| Lucide React | 0.294+ | Icônes |
| React Hot Toast | 2.4+ | Notifications |

### DevOps
| Technologie | Usage |
|------------|-------|
| Docker | Containerisation |
| Docker Compose | Orchestration |
| Nginx | Serveur web (frontend) |
| PostgreSQL | Base de données |

## 🗄️ Base de Données

### Schéma PostgreSQL

#### Table `roles`
Gestion des rôles utilisateurs
```sql
- role_id: INTEGER (PK)
- role_name: VARCHAR(50) UNIQUE
  • admin
  • prof (professeur)
  • etudiant
```

#### Table `users`
Informations utilisateurs de base
```sql
- user_id: INTEGER (PK)
- username: VARCHAR(50) UNIQUE
- password_hash: VARCHAR(255)
- full_name: VARCHAR(100)
- role_id: INTEGER (FK → roles)
- created_at: TIMESTAMP
```

#### Table `students`
Informations spécifiques aux étudiants
```sql
- student_id: INTEGER (PK)
- user_id: INTEGER (FK → users)
- enrollment_number: VARCHAR(50) UNIQUE
- email: VARCHAR(100)
- phone: VARCHAR(20)
- date_of_birth: DATE
- address: TEXT
- created_at: TIMESTAMP
```

#### Table `courses`
Cours disponibles
```sql
- course_id: INTEGER (PK)
- course_name: VARCHAR(100)
- course_code: VARCHAR(20) UNIQUE
- prof_id: INTEGER (FK → users)
- description: TEXT
- credits: INTEGER
- created_at: TIMESTAMP
- is_active: BOOLEAN
```

#### Table `course_enrollments`
Inscriptions étudiants ↔ cours
```sql
- enrollment_id: INTEGER (PK)
- student_id: INTEGER (FK → students)
- course_id: INTEGER (FK → courses)
- enrolled_at: TIMESTAMP
- status: VARCHAR(20) [active, dropped, completed]
```

#### Table `sessions`
Sessions de cours
```sql
- session_id: INTEGER (PK)
- course_id: INTEGER (FK → courses)
- session_date: DATE
- start_time: TIME
- end_time: TIME
- location: VARCHAR(100)
- created_at: TIMESTAMP
- is_completed: BOOLEAN
```

#### Table `attendance`
Enregistrements de présence
```sql
- attendance_id: INTEGER (PK)
- session_id: INTEGER (FK → sessions)
- student_id: INTEGER (FK → students)
- status: VARCHAR(20) [Présent, Absent, Retard]
- marked_at: TIMESTAMP
- face_verified: BOOLEAN
```

#### Table `training_images`
Images d'entraînement pour reconnaissance faciale
```sql
- image_id: INTEGER (PK)
- student_id: INTEGER (FK → students)
- image_path: VARCHAR(255)
- uploaded_at: TIMESTAMP
```

### Vues SQL

#### `student_attendance_stats`
Statistiques de présence par étudiant
```sql
- student_id
- full_name
- email
- total_sessions
- present_count
- absent_count
- attendance_percentage
```

#### `session_details`
Détails complets des sessions
```sql
- session: toutes les infos
- course: nom, code
- professor: nom du prof
```

## 🔒 Sécurité

### Authentification & Autorisation
- **JWT (JSON Web Tokens)** pour authentification stateless
- **Tokens expirables** (30 minutes par défaut)
- **Hachage bcrypt** pour les mots de passe
- **Protection CORS** configurée
- **Middleware de vérification de rôle** sur chaque route protégée

### Protection des Données
- **Validation Pydantic** sur toutes les entrées
- **Requêtes SQL paramétrées** (SQLAlchemy ORM)
- **Variables d'environnement** pour les secrets
- **HTTPS recommandé** en production

### Reconnaissance Faciale
- **Encodages faciaux** stockés de manière sécurisée
- **Vérification en temps réel** avant marquage de présence
- **Seuil de confiance** configurable
- **Logs d'activité** pour audit

## 🔧 Scripts Utilitaires

Le dossier `backend/` contient plusieurs scripts pratiques :

### `capture_faces.py`
Capture des images de visage pour un étudiant
```bash
python capture_faces.py
# Suit les instructions pour capturer 100+ images
```

### `train_model.py`
Entraînement du modèle de reconnaissance
```bash
python train_model.py
# Crée/met à jour face_model.yml
```

### `recognize_attendance.py`
Test de reconnaissance faciale en temps réel
```bash
python recognize_attendance.py
# Ouvre la webcam pour tests
```

### `create_test_users.py`
Création d'utilisateurs de test
```bash
python create_test_users.py
# Crée admin, profs, étudiants de démonstration
```

### `check_enrollments.py`
Vérification des inscriptions
```bash
python check_enrollments.py
# Affiche toutes les inscriptions
```

### `reset_users.py`
Réinitialisation de la base de données
```bash
python reset_users.py
# ⚠️ Supprime tous les utilisateurs !
```
## 🚦 Workflow Typique

### 1️⃣ Configuration Initiale (Admin)
1. Se connecter comme admin
2. Créer des professeurs
3. Créer des cours
4. Assigner les cours aux professeurs
5. Créer des étudiants ou permettre auto-inscription
6. Inscrire les étudiants aux cours

### 2️⃣ Enregistrement Facial (Étudiant)
1. Étudiant se connecte
2. Va dans son profil
3. Capture son visage (plusieurs photos)
4. Système entraîne le modèle

### 3️⃣ Planification (Professeur)
1. Professeur se connecte
2. Consulte ses cours
3. Crée des sessions de cours
4. Définit date, horaire, lieu

### 4️⃣ Marquage de Présence (Étudiant)
1. Étudiant arrive en cours
2. Ouvre l'application
3. Clique "Marquer présence"
4. Place son visage devant la caméra
5. ✅ Présence confirmée automatiquement

### 5️⃣ Suivi (Professeur)
1. Consulte la liste de présence de la session
2. Voit qui est présent/absent en temps réel
3. Termine la session
4. Étudiants non marqués = absents

## 📈 Statistiques & Rapports

### Pour les Étudiants
- Taux de présence global
- Présence par cours
- Historique complet
- Cours actifs

### Pour les Professeurs
- Taux de présence par cours
- Sessions planifiées vs complétées
- Étudiants par cours
- Export CSV des présences

### Pour les Administrateurs
- Statistiques globales
- Taux de présence institution
- Nombre total d'étudiants, profs, cours
- Vue d'ensemble des inscriptions

## 🐛 Dépannage

### Problème: Backend ne démarre pas
```bash
# Vérifier PostgreSQL
docker compose ps postgres  # ou service postgresql status

# Vérifier les variables d'environnement
cat backend/.env

# Logs détaillés
docker compose logs backend
```

### Problème: Reconnaissance faciale ne fonctionne pas
```bash
# Vérifier les images du dataset
ls -la backend/dataset/

# Réentraîner le modèle
cd backend
python train_model.py

# Tester la reconnaissance
python recognize_attendance.py
```

### Problème: Frontend ne se connecte pas au backend
```bash
# Vérifier VITE_API_URL dans frontend/.env
cat frontend/.env

# Vérifier CORS dans backend/config.py
# S'assurer que l'URL du frontend est dans CORS_ORIGINS
```

**⭐ Si ce projet vous a aidé, n'oubliez pas de lui donner une étoile sur GitHub !**
