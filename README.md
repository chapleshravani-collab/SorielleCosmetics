# 🌸 Sorielle Cosmetics — Premium Beauty & Skincare E-Commerce

Sorielle Cosmetics is a state-of-the-art, high-end cosmetics e-commerce platform featuring premium aesthetics, interactive shopping experiences, and cloud-synchronized client data management. 

Designed with a sleek rose-gold and charcoal palette, the platform delivers a luxurious user interface and micro-animations tailored for a premium brand feel.

---

## ✨ Features at a Glance

*   **Premium Brand Experience**: High-quality product showcases (Lips, Eyes, Face, and Skincare collections) featuring bespoke items like the *Sorielle Soothing Moisturizer*, *Ivory Silk Foundation*, *Honey Glow Foundation*, and *Beige Radiance Foundation*.
*   **Google Authentication**: Seamless integration via Firebase Auth with local profile persistence and real-time header UI updates.
*   **Real-time Cart & Database Synchronization**: Dual-layer architecture storing carts in Cloud Firestore for logged-in users and LocalStorage as a guest fallback.
*   **Interactive Client Dashboard**: A dedicated user area featuring a clean, fainted "Add Address" dashed placeholder card that triggers the address addition modal.
*   **Immersive Custom Lab (`lab.html`)**: A unique interactive space showcasing virtual customization and cosmetic product formulation details.
*   **Bespoke Interactive Checkout**: An elegant checkout page detailing order summaries and incorporating a beautiful custom payment verification modal.

---

## 🛠 Tech Stack

*   **Frontend**: Semantic HTML5, Vanilla CSS3 (curated HSL styling, glassmorphism, responsive grid layouts), and Modern JavaScript (ES6+ modular imports).
*   **Cloud Architecture (Firebase)**:
    *   **Firebase Authentication**: Manages secure, cross-device authentication sessions via Google Sign-In.
    *   **Cloud Firestore**: Real-time NoSQL database managing collections for `products`, `carts`, `addresses`, and `orders`.
    *   **Firebase Analytics**: Tracks platform pageviews and customer conversions.
*   **Deployment**: Hosted and deployed globally on **Vercel** (`soriellecosmetics.vercel.app`).

---

## 📂 Codebase Architecture

The project maintains a modular, decoupled file structure for clear separation of concerns:

```
SorielleCosmetics/
├── index.html                   # Homepage featuring hero sections, editorial banners & brand story
├── categories.html              # Central category hub for navigation
├── lips.html, eyes.html,        # Category-specific grid templates
│   face.html, skincare.html     
├── product.html                 # Dynamic product detail page with sizing and shade selectors
├── checkout.html                # Payment checkout flow with confirmation popups
├── dashboard.html               # Profile management dashboard with address registry
├── about.html, contact.html     # Brand identity and customer service pages
├── policy.html                  # Privacy and terms documentation
├── lab.html                     # Experimental customization page
├── style.css                    # Unified design system containing HSL variables and utility classes
├── products-data.js             # Static product listing configurations and metadata
├── firebase-config.js           # Firebase SDK initialization (Auth, Firestore, Analytics)
├── auth-service.js              # Authentication hooks, state listeners, and login/logout handlers
├── db-service.js                # Core Firestore operations (Cart sync, Address registry, Order logging)
├── cart.js                      # UI logic for cart drawers, badges, and calculations
├── script.js                    # Global page controller handling header, footer, and navigation
├── seed-db.js                   # CLI seed utility to populate Firestore database collections
└── vercel.json                  # Hosting configuration for Vercel deployment
```

---

## 🚀 Setup & Execution Guide

### 1. Prerequisites
Since this is a client-side module, it runs in any modern browser. You can execute local server environments using the preloaded Node bundle inside the project root:

```bash
# Verify local node version
.\node-v20.12.2-win-x64\node.exe -v
```

### 2. Seeding the Firestore Database
To populate your cloud database collections with standard Sorielle product inventory:

```bash
# Execute the seed utility
.\node-v20.12.2-win-x64\node.exe seed-db.js
```

### 3. Deploying updates to Vercel
To push changes live to your production domain:

```bash
# Deploy to Vercel (Production environment)
.\node-v20.12.2-win-x64\npx.cmd vercel --prod
```

---

## 💎 Core Logic Details

### User State & Header Management (`auth-service.js`)
Listens to Google Sign-In changes and updates headers across pages dynamically:
*   *Guest Mode*: Displays "Log In" with Google Auth popup triggers.
*   *Logged-in Mode*: Swaps authentication buttons for the user's Google profile picture, triggering a dropdown option to access the **Dashboard** or **Sign Out**.

### Cart Persistence & Syncing (`db-service.js` & `cart.js`)
*   Guests store shopping carts in browser LocalStorage.
*   Upon login, the cart is synced to Cloud Firestore, binding the cart array to the authenticated user ID.
*   Subsequent additions, deletions, or quantity adjustments update the firestore database immediately.

### Address & Profile Management (`dashboard.html` & `db-service.js`)
*   Displays active delivery addresses saved under the user's Firestore profile.
*   An elegant, dashed box labeled **"Add New Address"** with a faint inline plus icon provides an entry point to the add-address modal.
*   Supports full guest interaction: users can add mock addresses that persist locally when Firebase is not connected.
