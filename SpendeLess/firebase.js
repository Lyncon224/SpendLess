import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC27699VeuiLLzrS2vmA84D0G4ADePusLs",
  authDomain: "spendless-47ee1.firebaseapp.com",
  projectId: "spendless-47ee1",
  storageBucket: "spendless-47ee1.firebasestorage.app",
  messagingSenderId: "134891808058",
  appId: "1:134891808058:web:106d0286ecdd3ea1149c03",
  measurementId: "G-L6D3DGWBB0"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const db = getFirestore(app);