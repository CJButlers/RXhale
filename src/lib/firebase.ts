import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_shgu8mTR76bbjYExAtd9cnCto-bFtOk",
  authDomain: "rxhalefirebase.firebaseapp.com",
  projectId: "rxhalefirebase",
  storageBucket: "rxhalefirebase.firebasestorage.app",
  messagingSenderId: "707683759378",
  appId: "1:707683759378:web:7cc5e701fe6a4dc32eafcb",
  measurementId: "G-FXNHPQNK89"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);