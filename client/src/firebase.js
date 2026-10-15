import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from  "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-25726.firebaseapp.com",
  projectId: "genwebai-25726",
  storageBucket: "genwebai-25726.firebasestorage.app",
  messagingSenderId: "800051821038",
  appId: "1:800051821038:web:57c68a1ef7a1c8796ef6ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider} 