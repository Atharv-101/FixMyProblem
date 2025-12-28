
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

// Singleton initialization pattern for compatible environments
let app;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

// Explicitly derive and export services from the singleton app instance
export const auth = app.auth();
export const db = app.firestore();
export const storage = app.storage();

export default firebase;
