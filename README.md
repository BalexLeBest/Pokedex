# Pokédex - Projet Fullstack

## Description du Projet
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

## Structure du Projet
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

## Installation et Lancement

### 🛠️ Prérequis
- **Node.js** v16+
- **MongoDB** (local ou cloud)
- **npm** ou **yarn**

### ⚙️ Installation du Backend
1. **Cloner le projet**  
   ```sh
   git clone https://github.com/BalexLeBest/Pokedex.git
   cd pokedex/pokedex-api
   ```
2. **Installer les dépendances**  
   ```sh
   npm install
   ```
3. **Configurer l’environnement**  
   Créer un fichier **`.env`** et y ajouter :
   ```
   MONGO_URI=mongodb://localhost:27017/td
   TOKEN_SECRET=0a9aa4b49857f594eacb04e3df6b53a60e6cb909166d0757f694a0e903fa9b1891e703093b53f6ba5286c4dd38c71df4d9a6ae136e4384abed6fcdafd786c196
   PORT=3000
   ```
4. **Démarrer le serveur**  
   ```sh
   npm run dev
   ```
   L'API sera accessible à `http://localhost:3000`

---

### Lancer le serveur MongoDB
Allez dans `MongoDB_portable` et exécutez la commande suivante :
```bash
.\bin\mongod.exe --dbpath data
```
Laissez le serveur tourner.

---

### Installation du Frontend
1. **Se déplacer dans le dossier frontend**  
   ```sh
   cd pokedex-front
   ```
2. **Installer les dépendances**  
   ```sh
   npm install
   ```
3. **Lancer l’application**  
   ```sh
   npm run dev
   ```
   L’interface sera accessible sur `http://localhost:5173` (ou un autre port si déjà utilisé).

---

## API - Routes Disponibles (Visible dans pokemonRouter.js et trainerRouter.js)

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/checkUser` - Vérifier l'état de connexion

### Pokémon
- `GET /api/pokemon` - Récupérer tous les Pokémon
- `GET /api/pokemon/:id` - Récupérer un Pokémon par ID
- `POST /api/pokemon` - Ajouter un Pokémon (ADMIN)
- `PUT /api/pokemon/:id` - Modifier un Pokémon (ADMIN)
- `DELETE /api/pokemon/:id` - Supprimer un Pokémon (ADMIN)
- `POST /api/pokemon/pkmn/region` - Ajouter une région à un Pokémon (ADMIN)
- `DELETE /api/pokemon/pkmn/region/:pkmnID/:regionName` - Supprimer une région d’un Pokémon (ADMIN)

### Dresseurs
- `GET /api/trainer/me` - Récupérer son propre profil
- `PUT /api/trainer` - Modifier son profil
- `DELETE /api/trainer/:trainerId` - Supprimer un compte (ADMIN)
- `POST /api/trainer/mark` - Marquer un Pokémon comme vu ou capturé
---

## Importer tous les Pokémon

Le script **`resources/import_pokemon.js`** importe automatiquement **1025 Pokémon**.

1. Aller sur `http://localhost:3000/`
2. Faites `F12` pour ouvrir la console développeur
3. Allez dans l'onglet `Console`
4. Copiez le script contenu dans `Ressources/script_add_pkmn_to_db.js`
5. Collez-le dans la console et appuyez sur `Entrée`
6. Les Pokémon sont ajoutés à MongoDB.

---

## 🛠️ Technologies Utilisées
- **Backend** : Node.js, Express, MongoDB, Mongoose
- **Frontend** : React, React Router
- **Auth** : JWT (JSON Web Tokens)
- **UI** : CSS, animations et interface Gameboy
