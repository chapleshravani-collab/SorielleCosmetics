// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBq2u6CdWoHxiVGCGPPs0tcFnbRMnDz63M",
  authDomain: "luxe-1a5e9.firebaseapp.com",
  projectId: "luxe-1a5e9",
  storageBucket: "luxe-1a5e9.firebasestorage.app",
  messagingSenderId: "1033272949731",
  appId: "1:1033272949731:web:1e89332c7b6b298271fed6",
  measurementId: "G-N3T47HDQ7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { db, analytics, auth, googleProvider };
