import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0iJ754KAb6CFhgPJGk-CVLU8QF9fBgzI",
  authDomain: "nailmenager.firebaseapp.com",
  projectId: "nailmenager",
  storageBucket: "nailmenager.appspot.com",
  messagingSenderId: "161226514717",
  appId: "1:161226514717:web:3806d5e5b312b0a1d681f4",
};

const fireBase = initializeApp(firebaseConfig);

export const db = getFirestore(fireBase);
export const auth = getAuth(fireBase);