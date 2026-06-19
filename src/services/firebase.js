import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";

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
let auth;
try {
  const ReactNativeAsyncStorage = require('@react-native-async-storage/async-storage');
  const persistence = getReactNativePersistence(ReactNativeAsyncStorage);
  auth = initializeAuth(fireBase, { persistence });
} catch (e) {
  console.warn('AsyncStorage not available, falling back to memory persistence for Firebase Auth.', e?.message || e);
  auth = getAuth(fireBase);
}

export { auth };