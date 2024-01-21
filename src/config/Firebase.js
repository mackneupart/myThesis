// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4M26Jox8Su6mOAjbDGhDSKq9aHfBJzz0",
  authDomain: "queer-story.firebaseapp.com",
  projectId: "queer-story",
  storageBucket: "queer-story.appspot.com",
  messagingSenderId: "325662038611",
  appId: "1:325662038611:web:5c087fd7bafdf0c91504a6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const storageRef = ref(storage);
