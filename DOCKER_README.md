# Guide Docker - FaceTrack Absence System

## 📋 Prérequis

- Docker Desktop installé ([Télécharger](https://www.docker.com/products/docker-desktop))
- Docker Compose (inclus avec Docker Desktop)

## 🚀 Démarrage rapide

### 1. Cloner le projet (si ce n'est pas déjà fait)
```bash
git clone <repository-url>
cd FaceTrackFoAbsenceProject
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` dans le dossier `backend` :
```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/facetrack_db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:80
```

Créer un fichier `.env` dans le dossier `frontend` :
```env
VITE_API_URL=http://localhost:8000
```

### 3. Construire et démarrer les conteneurs

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. Accéder à l'application

- **Frontend** : http://localhost (port 80)
- **Backend API** : http://localhost:8000
- **API Documentation** : http://localhost:8000/docs
- **pgAdmin** (optionnel) : http://localhost:5050

## 🛠️ Commandes utiles

### Gestion des conteneurs

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v

# Redémarrer un service spécifique
docker-compose restart backend
docker-compose restart frontend

# Reconstruire les images
docker-compose build

# Reconstruire et redémarrer
docker-compose up -d --build
```

### Logs et debugging

```bash
# Voir tous les logs
docker-compose logs -f

# Voir les logs d'un service
docker-compose logs -f backend

# Voir les dernières 100 lignes
docker-compose logs --tail=100 backend

# Exécuter une commande dans un conteneur
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Base de données

```bash
# Accéder à PostgreSQL
docker-compose exec postgres psql -U postgres -d facetrack_db

# Importer un fichier SQL
docker-compose exec -T postgres psql -U postgres -d facetrack_db < backup.sql

# Exporter la base de données
docker-compose exec postgres pg_dump -U postgres facetrack_db > backup.sql
```

### Gestion des volumes

```bash
# Lister les volumes
docker volume ls

# Supprimer un volume spécifique
docker volume rm facetrackfoabsenceproject_postgres_data

# Nettoyer tous les volumes non utilisés
docker volume prune
```

## 🐛 Démarrer pgAdmin (optionnel)

pgAdmin est défini dans un profil optionnel. Pour le démarrer :

```bash
docker-compose --profile tools up -d pgadmin
```

Accédez ensuite à http://localhost:5050 avec :
- Email : `admin@facetrack.com`
- Mot de passe : `admin`

## 📦 Structure des images Docker

### Backend (Python/FastAPI)
- Image de base : `python:3.11-slim`
- Port : 8000
- Dépendances : OpenCV, TensorFlow, FastAPI, etc.

### Frontend (React/Vite)
- Image de base : `node:20-alpine` (build), `nginx:alpine` (production)
- Port : 80
- Build avec Vite, servi par Nginx

### Base de données
- Image : `postgres:15-alpine`
- Port : 5432

## 🔧 Configuration avancée

### Modifier les ports

Éditez `docker-compose.yml` :
```yaml
services:
  frontend:
    ports:
      - "3000:80"  # Changer le premier nombre pour le port hôte
  
  backend:
    ports:
      - "8080:8000"  # Changer le premier nombre pour le port hôte
```

### Utiliser un environnement de production

1. Créez un `docker-compose.prod.yml`
2. Modifiez les variables d'environnement pour la production
3. Désactivez le mode debug et reload

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Persister les données

Les volumes Docker sont utilisés pour persister :
- Base de données PostgreSQL : `postgres_data`
- Modèles de reconnaissance faciale : `backend_models`
- Dataset d'images : `backend_dataset`
- Fichiers de présence : `backend_attendance`

## 🐳 Build et push des images

### Build des images

```bash
# Backend
docker build -t facetrack-backend:latest ./backend

# Frontend
docker build -t facetrack-frontend:latest ./frontend
```

### Tag et push vers Docker Hub (optionnel)

```bash
# Tag
docker tag facetrack-backend:latest username/facetrack-backend:latest
docker tag facetrack-frontend:latest username/facetrack-frontend:latest

# Push
docker push username/facetrack-backend:latest
docker push username/facetrack-frontend:latest
```

## ⚠️ Problèmes courants

### Le backend ne démarre pas
```bash
# Vérifier les logs
docker-compose logs backend

# Reconstruire l'image
docker-compose build backend
docker-compose up -d backend
```

### La base de données ne se connecte pas
```bash
# Vérifier que PostgreSQL est prêt
docker-compose ps postgres

# Tester la connexion
docker-compose exec postgres pg_isready -U postgres
```

### Le frontend ne charge pas
```bash
# Vérifier les logs Nginx
docker-compose logs frontend

# Rebuild du frontend
docker-compose build frontend
docker-compose up -d frontend
```

### Problèmes de permissions
```bash
# Sur Linux/Mac, ajuster les permissions
chmod -R 755 backend/dataset backend/models backend/attendance
```

## 🧹 Nettoyage complet

Pour tout supprimer et repartir de zéro :

```bash
# Arrêter et supprimer les conteneurs, réseaux et volumes
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Nettoyer le système Docker
docker system prune -a --volumes
```

## 📝 Notes

- Le mode développement utilise le hot-reload pour le backend et le frontend
- Les données sont persistées dans des volumes Docker
- Le frontend est configuré pour proxy les requêtes API vers le backend
- pgAdmin est optionnel et peut être démarré avec `--profile tools`
