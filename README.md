# Tsena — Marketplace mobile (React Native / Expo)

> **Tsena** ("marché" en malgache) est une application e-commerce mobile :
> catalogue de produits, fiche détaillée, panier et favoris. Conçue et développée
> avec React Native + Expo et TypeScript, prix en Ariary (MGA).

<p>
  <img alt="Expo SDK 52" src="https://img.shields.io/badge/Expo-SDK%2052-000?logo=expo">
  <img alt="React Native" src="https://img.shields.io/badge/React%20Native-0.76-61dafb?logo=react">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-green">
</p>

## ✨ Fonctionnalités

- 🛍️ Catalogue de produits en grille avec barre de recherche et filtres par catégorie
- 🔄 Pull-to-refresh et états `loading` / `erreur` gérés via **React Query**
- 📦 Fiche produit détaillée : image, prix, description, stock, sélecteur de quantité
- 🛒 Panier persistant : ajout/retrait, gestion des quantités, sous-totaux et total
- ❤️ Favoris persistants avec badge sur l'onglet
- 📳 Retour haptique à l'ajout au panier et aux interactions clés
- 🌗 Thème clair / sombre automatique
- 🇲🇬 Formatage monétaire en **Ariary (MGA)**

## 🧱 Stack technique

| Domaine        | Choix |
|----------------|-------|
| Framework      | React Native 0.76 + Expo SDK 52 (New Architecture) |
| Langage        | TypeScript (mode `strict`) |
| Navigation     | expo-router (typed routes) |
| Données serveur| @tanstack/react-query (couche API mockée, remplaçable par Supabase/REST) |
| State local    | Zustand (panier + favoris) persisté via AsyncStorage |
| Images         | expo-image (cache, placeholder, transition) |
| Animations     | Reanimated 3 |
| Qualité        | Jest + Testing Library, ESLint, GitHub Actions |

## 🏗️ Architecture

```
app/                      # Routes (expo-router)
  _layout.tsx             # Stack racine + QueryClientProvider + GestureHandlerRootView
  (tabs)/                 # Onglets : Boutique 🛍️, Favoris ❤️, Panier 🛒 (badges)
    index.tsx             # Catalogue : recherche, filtres, grille, pull-to-refresh
    favorites.tsx         # Produits favoris (store Zustand)
    cart.tsx              # Lignes de panier, quantités, total, commander
  product/[id].tsx        # Fiche produit : quantité, ajout panier (haptics), favori
src/
  api/                    # Couche API mockée (products) + hooks React Query (queries)
  components/             # UI réutilisable (Card, ProductCard, QuantityStepper)
  store/                  # Zustand (useCart, useFavorites) + couche de persistance
  lib/                    # Helpers (format Ariary, calculs panier) + tests
  theme/                  # Design tokens + hook de thème
```

Le catalogue est servi par une **couche API mockée locale** (`src/api/products.ts`)
qui simule un backend : chaque fonction renvoie une `Promise` avec une latence
artificielle. Les signatures (`fetchProducts`, `fetchProduct`, `searchProducts`)
sont pensées pour être remplacées par un vrai backend (Supabase / REST) sans
toucher aux écrans ni aux hooks React Query.

## 🚀 Démarrage

```bash
npm install
npm start          # puis 'i' (iOS), 'a' (Android) ou scanner le QR avec Expo Go
```

### Scripts

```bash
npm run typecheck  # vérification TypeScript
npm run lint       # ESLint
npm test           # tests unitaires (Jest)
```

## 🗺️ Roadmap

- [ ] Authentification et comptes clients (Supabase Auth)
- [ ] Paiement en ligne (Stripe)
- [ ] Backend réel (Supabase / REST) en remplacement de la couche mockée
- [ ] Notifications push (suivi de commande, promotions)
- [ ] Historique des commandes et suivi de livraison

## 📄 Licence

MIT © [ADH Studio](https://github.com/adh-studio) — Henintsoa Andriamaholy
