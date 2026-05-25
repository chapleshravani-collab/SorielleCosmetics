# Step-by-Step Roadmap: Google Authentication with Firebase

Follow these steps to implement a premium Google Sign-In/Sign-Up experience for Sorielle Cosmetics.

---

## Phase 1: Firebase Console Setup (Action Required)
1.  **Open Console**: Go to [Firebase Console](https://console.firebase.google.com/) and select project `luxe-1a5e9`.
2.  **Enable Provider**:
    - Go to **Build > Authentication > Sign-in method**.
    - Click **Add new provider** > Select **Google**.
    - Enable it and set your support email. Click **Save**.
3.  **Authorize Domains**:
    - Under **Authentication > Settings > Authorized domains**.
    - Add `soriellecosmetics.vercel.app` and `localhost`.
4.  **Google Cloud Config**:
    - Go to [GCP Console](https://console.cloud.google.com/) > **APIs & Services > OAuth consent screen**.
    - Set to **External**.
    - App Name: `Sorielle Cosmetics`.
    - Support Email: [Your Email].
    - Authorized Domain: `soriellecosmetics.vercel.app`.

---

## Phase 2: Technical Implementation (Developer Side)

### 1. Update SDK Configuration (`firebase-config.js`)
Initialize and export the Auth instance and Google provider.
```javascript
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// ... (initialization)
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

### 2. Create Auth Service (`auth-service.js`)
Create a new file to manage authentication logic:
- `signIn()`: Triggers `signInWithPopup`.
- `signOutUser()`: Triggers `signOut`.
- `onAuthChange()`: Listens for user state changes.

### 3. Update Header UI (`index.html`, etc.)
Modify the navigation bar to include:
- **Login / Sign Up** buttons for guests.
- **User Profile / Logout** options for authenticated users.

### 4. User Data Persistence (`db-service.js`)
When a user signs in for the first time:
- Check if they exist in the `users` Firestore collection.
- If not, create a document with their Name, Email, and Photo URL.

---

## Phase 3: Testing & Deployment
1.  **Local Test**: Verify that the Google popup opens and returns user info.
2.  **Persistence Test**: Ensure the user remains logged in after a page refresh.
3.  **Vercel Deployment**:
    - Run `npx vercel --prod`.
    - Verify that the redirect works on the live domain.

---
**Current Status: Phase 1 (Console Setup) is pending your action.**
**Once Phase 1 is done, let me know to start Phase 2!**
