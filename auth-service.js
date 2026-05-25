import { auth, googleProvider, db } from './firebase-config.js';
import { signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Login with Google
export const loginWithGoogle = async () => {
    try {
        console.log("Initiating Google Login from domain:", window.location.hostname);
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("Login successful:", user.email);
        
        // Save user to Firestore if new
        try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString()
                });
                console.log("New user profile created in Firestore");
            }
        } catch (dbError) {
            console.error("Firestore sync failed:", dbError);
        }
        
        return user;
    } catch (error) {
        console.error("Login failed detailed error:", error);
        
        if (error.code === 'auth/unauthorized-domain') {
            alert(`Error: Unauthorized Domain.\n\nYou MUST add "${window.location.hostname}" to your Firebase Console > Authentication > Settings > Authorized Domains.`);
        } else if (error.code === 'auth/popup-blocked') {
            alert("Error: Popup Blocked.\n\nPlease enable popups for this site or try a different browser.");
        } else {
            alert(`Login failed: ${error.message}`);
        }
        throw error;
    }
};

// Logout
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

// Auth State Listener
export const observeAuth = (callback) => {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
};
