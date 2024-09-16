// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { EmailAuthProvider, getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, serverTimestamp } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1t_NQpwUg-kb9tquunuZrjHlJjmsUNFQ",
  authDomain: "tinderclone-ad905.firebaseapp.com",
  projectId: "tinderclone-ad905",
  storageBucket: "tinderclone-ad905.appspot.com",
  messagingSenderId: "209660747374",
  appId: "1:209660747374:web:f31a38a2d339d81ee3507f",
  measurementId: "G-0DB8SS3F96"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getFirestore();
const timestamp = serverTimestamp();
const provider = new EmailAuthProvider();

export { app, auth, provider, db, timestamp };