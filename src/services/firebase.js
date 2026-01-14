// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAb7NVhYwgE7tcm_hN21TuSa-vnorjU5Yc",
  authDomain: "sapc-wiki.firebaseapp.com",
  projectId: "sapc-wiki",
  storageBucket: "sapc-wiki.firebasestorage.app",
  messagingSenderId: "744786600748",
  appId: "1:744786600748:web:5186e9d9f708f4f9654289"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export only the Database tool
export const db = getFirestore(app);