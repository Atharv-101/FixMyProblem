// FIX: Switched to firebase/compat imports to support the v8 namespaced API (e.g., firebase.auth()) with a newer Firebase SDK version.
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Configuration uses environment variables. 
// In a real deployment, ensure these are set in your CI/CD or .env file.
const firebaseConfig = {
  apiKey: "AIzaSyAFd9JmHS1VOoA7B6ehvSAMJqbQRKuBYBg",
  authDomain: "trymyproblem.firebaseapp.com",
  projectId: "trymyproblem",
  storageBucket: "trymyproblem.firebasestorage.app",
  messagingSenderId: "727832355682",
  appId: "1:727832355682:web:c3f7ce0d095db1c2cac23b",
  measurementId: "G-80K1XVWDCF"
};

// Initialize Firebase only if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export default firebase;