// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChyZPxAxaBmtjGFS08-36ntEbFldnLrB4",
  authDomain: "whatsdown-e147f.firebaseapp.com",
  projectId: "whatsdown-e147f",
  storageBucket: "whatsdown-e147f.appspot.com",
  messagingSenderId: "1005458887691",
  appId: "1:1005458887691:web:8464052746cf5e7c33a30e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export function FirebaseSignIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function FirebaseSignUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}
