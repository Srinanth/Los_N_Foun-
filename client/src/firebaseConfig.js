import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyAeH1zRH8nrNxP5QxFadiyJhzoVT-j1qSk",
  authDomain: "match-making-a1c79.firebaseapp.com",
  projectId: "match-making-a1c79",
  storageBucket: "match-making-a1c79.firebasestorage.app",
  messagingSenderId: "1003305083842",
  appId: "1:1003305083842:web:63ffb634836d41780c2c5b",
  measurementId: "G-0GKW8800LZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);