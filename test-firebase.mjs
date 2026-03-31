// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey) {
  console.error("\x1b[31mError: Firebase API Key is missing.\x1b[0m");
  console.log("Run the script like this: \x1b[32mnode --env-file=.env test-firebase.mjs\x1b[0m");
  process.exit(1);
}

// Initialize Firebase
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
