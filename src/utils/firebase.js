// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.AIzaSyDW1wUBkaSyqx0mWYkNXIMC4VgAoVbPwEY,
  authDomain: import.meta.env.harsh-kavathiya-portfolio.firebaseapp.com,
  projectId: import.meta.env.harsh-kavathiya-portfolio,
  storageBucket: import.meta.env.harsh-kavathiya-portfolio.firebasestorage.app,
  messagingSenderId: import.meta.env.1067197088420,
  appId: import.meta.env.1:1067197088420:web:9a42f318a6702fcff05c31,
  measurementId: import.meta.env.G-6XDFF4J5T6
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

export { app, analytics, db };