import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDW1wUBkaSyqx0mWYkNXIMC4VgAoVbPwEY",
  authDomain: "harsh-kavathiya-portfolio.firebaseapp.com",
  projectId: "harsh-kavathiya-portfolio",
  storageBucket: "harsh-kavathiya-portfolio.firebasestorage.app",
  messagingSenderId: "1067197088420",
  appId: "1:1067197088420:web:9a42f318a6702fcff05c31",
  measurementId: "G-6XDFF4J5T6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Attempting to connect to Firestore...");

try {
  console.log("Adding test document...");
  const docRef = await addDoc(collection(db, "messages"), {
    name: "Test User",
    email: "test@example.com",
    message: "Test message from CLI",
    timestamp: new Date()
  });
  console.log("Successfully wrote to Firestore! Document ID: ", docRef.id);
  process.exit(0);
} catch (error) {
  console.error("Write failed:", error.message);
  process.exit(1);
}
