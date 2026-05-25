import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, writeBatch, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/**
 * Seed Data Script
 * Run this once to populate your Firestore with the existing project data
 */

const categories = [
    { name: "Lips", subtitle: "Lipstick, Gloss, Balm", gradient: "linear-gradient(135deg, #FFF0F0, #F5C6C6)", image: "assets/cat_lips.png" },
    { name: "Eyes", subtitle: "Kajal, Eyeliner, Mascara, Eyeshadow", gradient: "linear-gradient(135deg, #F5F5F5, #E8DCD5)", image: "assets/cat_eyes.png" },
    { name: "Face", subtitle: "Foundation, Compact, Blush, Highlighter", gradient: "linear-gradient(135deg, #FFF9F5, #FADCD9)", image: "assets/cat_face.png" },
    { name: "Skincare", subtitle: "Facewash, Serum, Moisturizer", gradient: "linear-gradient(135deg, #F0F8FF, #E0F2F1)", image: "assets/cat_skincare.png" }
];

const products = [
    { 
        name: "Lumière Face Serum", 
        price: 899, 
        comparePrice: 1299, 
        discount: "30% OFF", 
        rating: 4.9, 
        reviewsCount: 124, 
        category: "Skincare",
        image: "assets/product_serum_1777119333775.png",
        description: "Indulge in the ultimate radiance. Our Lumière Face Serum is meticulously crafted with rare botanical extracts and hyaluronic acid to deliver a weightless, luminous glow that lasts all day.",
        skinTypes: ["Dry", "Oily", "Combination"],
        ingredients: "Hyaluronic Acid, Vitamin C, Organic Rosehip Oil, Niacinamide, Squalane, Green Tea Extract, Frankincense Essential Oil."
    },
    { 
        name: "Rose Glow Lip Gloss", 
        price: 499, 
        comparePrice: 699, 
        discount: "28% OFF", 
        rating: 4.9, 
        category: "Lips",
        image: "assets/lip_gloss.png" 
    },
    { 
        name: "Nude Dream Palette", 
        price: 799, 
        comparePrice: 999, 
        discount: "20% OFF", 
        rating: 4.8, 
        category: "Eyes",
        image: "assets/eye_palette.png" 
    },
    { 
        name: "Silk Cloud Moisturizer", 
        price: 549, 
        comparePrice: 699, 
        discount: "21% OFF", 
        rating: 4.7, 
        category: "Skincare",
        image: "assets/product_moisturizer_1777119378878.png" 
    },
    { 
        name: "Velvet Rose Lipstick", 
        price: 349, 
        comparePrice: 499, 
        discount: "30% OFF", 
        rating: 4.8, 
        category: "Lips",
        image: "assets/product_lipstick_1777119354515.png" 
    }
];

export const seedDatabase = async () => {
    try {
        console.log("Starting database seeding...");
        
        // 1. Seed Categories
        for (const cat of categories) {
            await addDoc(collection(db, "categories"), cat);
        }
        console.log("Categories seeded.");

        // 2. Seed Products
        for (const prod of products) {
            await addDoc(collection(db, "products"), prod);
        }
        console.log("Products seeded.");
        
        alert("Database initialized successfully!");
    } catch (error) {
        console.error("Error seeding database: ", error);
        alert("Error seeding database. Check console for details.");
    }
};
