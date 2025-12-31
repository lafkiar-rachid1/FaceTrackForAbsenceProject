# FaceTrack Absence System - Frontend

Application React avec Tailwind CSS pour le système de présence par reconnaissance faciale.

## 🚀 Installation

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration

Le fichier `.env` est déjà configuré avec:
```env
VITE_API_URL=http://localhost:8000
```

### 3. Lancer l'application

```bash
npm run dev
```

L'application sera accessible sur: http://localhost:5173

## 📁 Structure du projet

```
src/
├── services/              # Services API
│   ├── api.js            # Configuration Axios
│   ├── authService.js    # Service d'authentification
│   ├── studentService.js # Service étudiants
│   └── attendanceService.js # Service présence
├── store/                # State Management
│   └── AuthContext.jsx   # Context d'authentification
├── components/           # Composants réutilisables
│   ├── Navbar.jsx       # Barre de navigation
│   ├── LoadingSpinner.jsx # Spinner de chargement
│   ├── ProtectedRoute.jsx # Route protégée
│   └── CameraCapture.jsx  # Capture de caméra
├── pages/                # Pages
│   ├── Home.jsx         # Page d'accueil
│   ├── Login.jsx        # Page de connexion
│   ├── Register.jsx     # Page d'inscription
│   └── StudentDashboard.jsx # Dashboard étudiant
├── App.jsx               # Composant principal
└── main.jsx             # Point d'entrée
```

## 🎯 Fonctionnalités implémentées

### ✅ Authentification
- [x] Login pour étudiants et admin/prof
- [x] Inscription des étudiants
- [x] Gestion des tokens JWT
- [x] Routes protégées
- [x] Déconnexion

### ✅ Inscription avec capture faciale
- [x] Formulaire d'inscription
- [x] Capture automatique/manuelle de 10-30 images
- [x] Prévisualisation des images capturées
- [x] Envoi des images en base64 au backend
- [x] Validation des données

### ✅ Dashboard Étudiant
- [x] Affichage des statistiques (total, présent, absent, taux)
- [x] Liste des présences récentes
- [x] Informations du profil
- [x] Statut de la reconnaissance faciale

### ✅ Composants
- [x] Navbar avec menu utilisateur
- [x] LoadingSpinner
- [x] ProtectedRoute
- [x] CameraCapture (capture vidéo avec countdown)

## 🎨 Workflow d'utilisation

### Pour un nouvel étudiant:

1. **Inscription** (`/register`)
   - Remplir le formulaire avec nom, email, username, password
   - Cliquer sur "Continuer vers la capture 📸"

2. **Capture faciale**
   - La caméra s'ouvre automatiquement
   - Choisir entre capture automatique ou manuelle
   - Capturer 10-30 images en bougeant légèrement la tête
   - Cliquer sur "Terminer"

3. **Connexion** (`/login`)
   - Se connecter avec username et password
   - Redirection vers le dashboard

4. **Dashboard** (`/dashboard`)
   - Voir ses statistiques de présence
   - Consulter l'historique des présences

### Pour un étudiant existant:

1. **Connexion** (`/login`)
   - Choisir "🎓 Étudiant"
   - Entrer username et password

2. **Dashboard**
   - Consulter ses statistiques
   - Voir l'historique des présences

## 🛠️ Technologies utilisées

- **React 18** - Framework UI
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Context API** - State management
- **React Hot Toast** - Notifications
- **Vite** - Build tool

## 📱 Pages disponibles

| Route | Description | Accès |
|-------|-------------|-------|
| `/` | Page d'accueil | Public |
| `/login` | Connexion | Public |
| `/register` | Inscription | Public |
| `/dashboard` | Dashboard | Protégé |

## 🔐 Authentification

Le système utilise JWT (JSON Web Tokens) stockés dans `localStorage`:
- `token` - Token JWT
- `userType` - Type d'utilisateur ('student' ou 'user')
- `user` - Données de l'utilisateur

## 📸 Capture de caméra

Le composant `CameraCapture` offre:
- **Capture automatique**: Capture continue d'images toutes les 200ms
- **Capture manuelle**: Bouton pour capturer une image à la fois
- **Countdown**: Compte à rebours de 3 secondes avant le début
- **Prévisualisation**: Galerie des images capturées
- **Suppression**: Possibilité de supprimer des images individuelles
- **Validation**: Minimum 10 images requises

## 🎨 Personnalisation

### Changer l'URL de l'API

Modifier dans `.env`:
```env
VITE_API_URL=http://votre-api-url
```

### Modifier le nombre d'images requises

Dans `Register.jsx`:
```jsx
<CameraCapture
  minImages={10}  // Minimum
  maxImages={30}  // Maximum
/>
```

## 🐛 Dépannage

### La caméra ne s'ouvre pas
- Vérifier les permissions du navigateur
- Utiliser HTTPS ou localhost
- Vérifier que la caméra n'est pas utilisée par une autre application

### Erreur CORS
- Vérifier que le backend autorise l'origine frontend dans `CORS_ORIGINS`
- Backend: `http://localhost:5173` doit être dans la liste

### Token expiré
- Les tokens expirent après 30 minutes par défaut
- Se reconnecter pour obtenir un nouveau token

## 📝 À faire

- [ ] Dashboard Admin/Professeur
- [ ] Gestion des cours
- [ ] Gestion des sessions
- [ ] Reconnaissance faciale en temps réel
- [ ] Export des statistiques
- [ ] Notifications en temps réel

## 👥 Auteurs

- Équipe FaceTrack - ENSET

---

**Note**: Assurez-vous que le backend est démarré avant de lancer le frontend!
