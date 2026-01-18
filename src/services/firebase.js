// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAb7NVhYwgE7tcm_hN21TuSa-vnorjU5Yc",
  authDomain: "sapc-wiki.firebaseapp.com",
  projectId: "sapc-wiki",
  storageBucket: "sapc-wiki.firebasestorage.app",
  messagingSenderId: "744786600748",
  appId: "1:744786600748:web:5186e9d9f708f4f9654289"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// FIX: Define auth FIRST
export const auth = getAuth(app); 

// FIX: Now you can use auth
setPersistence(auth, browserLocalPersistence);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});