import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAA4sC2mvNHeLeFKSHqWYw7ohtAM0BY6XU",
  authDomain: "pocket-cv-37cb1.firebaseapp.com",
  projectId: "pocket-cv-37cb1",
  storageBucket: "pocket-cv-37cb1.firebasestorage.app",
  messagingSenderId: "305040346936",
  appId: "1:305040346936:web:760f1ee86f0e6dd51f3bcd",
  measurementId: "G-LXHCNP4605",
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
