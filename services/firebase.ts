
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAFd9JmHS1VOoA7B6ehvSAMJqbQRKuBYBg",
  authDomain: "trymyproblem.firebaseapp.com",
  projectId: "trymyproblem",
  storageBucket: "trymyproblem.firebasestorage.app",
  messagingSenderId: "727832355682",
  appId: "1:727832355682:web:c3f7ce0d095db1c2cac23b",
  measurementId: "G-80K1XVWDCF"
};

// Singleton initialization for compat SDK
const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();

export default app;
