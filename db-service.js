import { db } from './firebase-config.js';
import { 
    collection, 
    getDocs, 
    addDoc, 
    query, 
    where, 
    doc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Data Service for Sorielle Cosmetics
 * Handles all Firestore operations efficiently
 */

// --- Products ---

export const getAllProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting products: ", error);
        return [];
    }
};

export const getProductsByCategory = async (categoryId) => {
    try {
        const q = query(collection(db, "products"), where("categoryId", "==", categoryId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting products by category: ", error);
        return [];
    }
};

export const getProductById = async (productId) => {
    try {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting product: ", error);
        return null;
    }
};

// --- Reviews ---

export const getProductReviews = async (productId) => {
    try {
        const q = query(collection(db, "reviews"), where("productId", "==", productId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting reviews: ", error);
        return [];
    }
};

export const addProductReview = async (reviewData) => {
    try {
        const docRef = await addDoc(collection(db, "reviews"), {
            ...reviewData,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding review: ", error);
        throw error;
    }
};

// --- Orders ---

export const createOrder = async (orderData) => {
    try {
        const docRef = await addDoc(collection(db, "orders"), {
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating order: ", error);
        throw error;
    }
};

// --- Newsletter ---

export const subscribeNewsletter = async (email) => {
    try {
        await addDoc(collection(db, "newsletter"), {
            email,
            subscribedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error subscribing: ", error);
        throw error;
    }
};

// --- User Addresses ---

export const getUserAddresses = async (userId) => {
    try {
        if (!userId) return [];
        const q = query(collection(db, "users", userId, "addresses"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting user addresses: ", error);
        return [];
    }
};

export const addUserAddress = async (userId, addressData) => {
    try {
        if (!userId) throw new Error("User ID is required to save an address");
        const docRef = await addDoc(collection(db, "users", userId, "addresses"), {
            ...addressData,
            createdAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding user address: ", error);
        throw error;
    }
};
