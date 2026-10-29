# 🛍️ LuxeStore — Frontend React

Interface utilisateur complète pour l'API Spring Boot e-commerce.

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm start
```

L'application sera disponible sur **http://localhost:3000**

## ⚙️ Configuration

L'API est configurée pour pointer vers `http://localhost:8089/api`.  
Pour changer l'URL, modifiez `src/services/api.js` :

```js
const BASE = 'http://localhost:8089/api'; // ← Changez ici
```

## 📁 Structure du projet

```
src/
├── components/
│   ├── Navbar.jsx / .css        → Barre de navigation
│   ├── ProductCard.jsx / .css   → Carte produit
│   ├── ProtectedRoute.jsx       → Guards de routes
│   └── Toast.jsx                → Notifications
├── context/
│   ├── AuthContext.jsx          → État authentification
│   └── CartContext.jsx          → État panier
├── pages/
│   ├── Home.jsx / .css          → Boutique (liste produits)
│   ├── Login.jsx                → Connexion
│   ├── Register.jsx             → Inscription
│   ├── Cart.jsx / .css          → Panier + commande
│   ├── Admin.jsx / .css         → Dashboard admin
│   └── Auth.css                 → Styles communs auth
├── services/
│   └── api.js                   → Appels API (axios)
├── App.jsx                      → Routeur principal
├── index.js                     → Point d'entrée
└── index.css                    → Design system global
```

## 🔐 Rôles & accès

| Route       | USER | ADMIN | Non connecté |
|-------------|------|-------|--------------|
| `/`         | ✅   | ✅    | ✅           |
| `/cart`     | ✅   | ✅    | ❌ → login   |
| `/admin`    | ❌   | ✅    | ❌ → login   |
| `/login`    | ✅   | ✅    | ✅           |
| `/register` | ✅   | ✅    | ✅           |

## ✨ Fonctionnalités

- 🔑 Authentification JWT (login / register)
- 🛒 Panier dynamique avec quantités
- 📦 Liste produits avec recherche en temps réel
- 🛡️ Dashboard admin : ajouter / supprimer produits
- 📱 Design responsive (mobile-first)
- 🔔 Notifications toast
- 🌙 Thème sombre élégant

## 🎨 Stack technique

- **React 18** + React Router v6
- **Axios** pour les requêtes HTTP
- **Lucide React** pour les icônes
- **Google Fonts** : Playfair Display + DM Sans
- CSS pur avec variables CSS (pas de framework)
