# 🏆 Pokédex - Projet Fullstack

## 📌 Description du Projet
Ce projet est une implémentation complète d'un **Pokédex** interactif permettant aux utilisateurs de :
- Naviguer dans la liste des Pokémon
- Consulter leurs **types, descriptions, images et régions d'apparition**
- **S'inscrire et se connecter** pour marquer les Pokémon comme **vus** ou **capturés**
- Ajouter, modifier ou supprimer des Pokémon en tant qu'**administrateur**
- Utiliser une **interface Gameboy** pour une navigation immersive 🎮

Le projet est divisé en **deux parties principales** :
1. **Backend** : Une API REST construite avec **Node.js, Express & MongoDB**.
2. **Frontend** : Une application React affichant le Pokédex.

---

## 📂 Structure du Projet
```
pokedex/
├── backend/                # API Node.js + Express + MongoDB
│   ├── controllers/        # Contrôleurs des routes
│   ├── models/             # Modèles MongoDB (Pokémon, Dresseur)
│   ├── routes/             # Routes API
│   ├── services/           # Services (auth, pokémon, dresseurs)
│   ├── middlewares/        # Middlewares JWT et Auth
│   ├── server.js           # Point d’entrée du serveur
│   ├── .env                # Variables d’environnement
│   ├── package.json        # Dépendances backend
│   └── README.md           # Documentation backend
│
├── frontend/               # Interface utilisateur React
│   ├── src/
│   │   ├── components/     # Composants React (Gameboy, Profile, etc.)
│   │   ├── pages/          # Pages principales (Home, Detail, Login)
│   │   ├── services/       # Appels API vers le backend
│   │   ├── styles/         # Fichiers CSS
│   │   ├── App.js          # Entrée principale React
│   │   └── index.js        # Point d’entrée React
│   ├── public/             # Images et assets statiques
│   ├── package.json        # Dépendances frontend
│   └── README.md           # Documentation frontend
│
├── resources/              # Fichiers utilitaires
│   ├── import_pokemon.js   # Script pour importer tous les Pokémon
│   └── README.md           # Explication des fichiers utilitaires
│
└── README.md               # Documentation générale du projet
```

---

## 🚀 Installation et Lancement

### 🛠️ Prérequis
- **Node.js** v16+
- **MongoDB** (local ou cloud)
- **npm** ou **yarn**

### ⚙️ Installation du Backend
1. **Cloner le projet**  
   ```sh
   git clone https://github.com/tonrepo/pokedex.git
   cd pokedex/backend
   ```
2. **Installer les dépendances**  
   ```sh
   npm install
   ```
3. **Configurer l’environnement**  
   Créer un fichier **`.env`** et y ajouter :
   ```
   MONGO_URI=mongodb://localhost:27017/pokedex
   TOKEN_SECRET=supersecret
   PORT=3000
   ```
4. **Démarrer le serveur**  
   ```sh
   npm run dev
   ```
   L'API sera accessible à `http://localhost:3000`

---

### 🎨 Installation du Frontend
1. **Se déplacer dans le dossier frontend**  
   ```sh
   cd ../frontend
   ```
2. **Installer les dépendances**  
   ```sh
   npm install
   ```
3. **Lancer l’application**  
   ```sh
   npm start
   ```
   L’interface sera accessible sur `http://localhost:5173` (ou un autre port si déjà utilisé).

---

## 🌍 API - Routes Disponibles

### 📌 Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/checkUser` - Vérifier connexion

### 🔥 Pokémon
- `GET /api/pokemon` - Liste des Pokémon
- `GET /api/pokemon/:id` - Infos d'un Pokémon
- `POST /api/pokemon` - Ajouter un Pokémon (ADMIN)
- `PUT /api/pokemon/:id` - Modifier un Pokémon (ADMIN)
- `DELETE /api/pokemon/:id` - Supprimer un Pokémon (ADMIN)

### 👤 Dresseur
- `GET /api/trainer/me` - Récupérer son profil
- `PUT /api/trainer` - Modifier son profil
- `DELETE /api/trainer/:id` - Supprimer son compte
- `POST /api/trainer/mark` - Marquer un Pokémon vu/capturé

---

## 📚 Importer tous les Pokémon

Le script **`resources/import_pokemon.js`** importe automatiquement **1025 Pokémon**.

### 🛠️ Utilisation du script
1. **Démarrer l'API** (`npm run dev`)
2. **Exécuter le script** :
   ```sh
   node resources/import_pokemon.js
   ```
3. **Les Pokémon sont ajoutés à MongoDB**.

---

## 🛠️ Technologies Utilisées
- **Backend** : Node.js, Express, MongoDB, Mongoose
- **Frontend** : React, React Router
- **Auth** : JWT (JSON Web Tokens)
- **UI** : CSS, animations et interface Gameboy

---

## 🎮 Interface Gameboy
- ⬆️🔽 : Naviguer entre les Pokémon
- 🔄 **Bouton A/B** : Voir la fiche d'un Pokémon

---

## 🚀 Contribution
1. **Fork le repo**
2. **Crée une branche** (`git checkout -b feature-nouvelle-fonction`)
3. **Ajoute tes modifications** (`git commit -m "Ajout d'une feature"`)
4. **Fais une pull request** 🎉

---

## 📢 Contact & Support
**Problème ?** Ouvre une **issue** ou contacte-moi sur **Discord/GitHub** !

🚀 **Attrapez-les tous !** 🎮🔥

