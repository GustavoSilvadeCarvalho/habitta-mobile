// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYdnUVRd4A41UfB4TMWfAhzjBYk7JDrEs",
  authDomain: "habittamobile-d6281.firebaseapp.com",
  projectId: "habittamobile-d6281",
  storageBucket: "habittamobile-d6281.firebasestorage.app",
  messagingSenderId: "494986324172",
  appId: "1:494986324172:web:f1168c160ab47b3fe1fa69",
  measurementId: "G-5NQ3N2M2HG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

export { storage, firestore, app as firebaseApp };