import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables
// Create a .env file in the root directory with your Firebase credentials
// See .env.example for the required variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDSeDOjcjewUZFNdUeCXv49fuaQiREkGIQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "little-tunia.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "little-tunia",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "little-tunia.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "351918619719",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:351918619719:web:3d40c012d347049acd4562"
};

// Debug: Log to verify config is loaded
console.log('Firebase Config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore with explicit database ID
export const db = getFirestore(app);

// Log to verify Firestore is initialized
console.log('Firestore initialized:', db.type);
