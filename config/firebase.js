// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAE5hZ54FxVcXX4_Vgt0h3t2dlzbcX7Jf8",
    authDomain: "frontend-2-3ed3d.firebaseapp.com",
    projectId: "frontend-2-3ed3d",
    storageBucket: "frontend-2-3ed3d.firebasestorage.app",
    messagingSenderId: "928181631453",
    appId: "1:928181631453:web:15b80cf20a55d1a6171e34"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export {db}; // Export db to use in other parts of your app

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();