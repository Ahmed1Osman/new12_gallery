// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAFHWm3GvWfxvl7XR5-JVsMj7VS64V98TE",
    authDomain: "elnagarartgallery3.firebaseapp.com",
    projectId: "elnagarartgallery3",
    storageBucket: "elnagarartgallery3.firebasestorage.app",
    messagingSenderId: "626700976065",
    appId: "1:626700976065:web:ed924f0ef17af15ea43940"
  };

const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;