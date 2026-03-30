// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW1wUBkaSyqx0mWYkNXIMC4VgAoVbPwEY",
  authDomain: "harsh-kavathiya-portfolio.firebaseapp.com",
  projectId: "harsh-kavathiya-portfolio",
  storageBucket: "harsh-kavathiya-portfolio.firebasestorage.app",
  messagingSenderId: "1067197088420",
  appId: "1:1067197088420:web:9a42f318a6702fcff05c31",
  measurementId: "G-6XDFF4J5T6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);

export { app, analytics, db };