import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB41l1-RDg4haFRAK3zziVRSPA2JUqtZhM",
  authDomain: "time-scheduler-673a0.firebaseapp.com",
  projectId: "time-scheduler-673a0",
  storageBucket: "time-scheduler-673a0.appspot.com",
  messagingSenderId: "183291809493",
  appId: "1:183291809493:web:41d36179f9ade5e906dc5c",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
