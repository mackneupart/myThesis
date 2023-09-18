import {
  CaveatBrush_400Regular,
  ConcertOne_400Regular,
} from "@expo-google-fonts/dev";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  QuerySnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "./Firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export const getUser = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return user;
  } else {
    console.log("No user is signed in");
  }
};

export const getUserDetails = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.log("No user is signed in");
    return null;
  }

  const userId = user.uid;
  console.log("UserID:", userId);

  const userRef = doc(db, "users", userId);

  try {
    const userSnap = await getDoc(userRef);
    console.log("my userSnap " + userSnap.exists());
    if (userSnap.exists()) {
      const userData = userSnap.data();
      console.log("Document data:", userData);
      return userData; // Return user data if the document exists
    } else {
      console.log("Document does not exist.");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null; // Handle the error and return null
  }
};

// Register a  user
export const registerUser = async (email, password, username) => {
  const auth = getAuth();
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    const uid = auth.currentUser.uid;
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      username: username,
      email: email,
    });

    return true;
  } catch (error) {
    console.log("Registration error: " + error.code);

    switch (error.code) {
      case "auth/email-already-in-use":
        alert("Email already in use");
        break;
      case "auth/invalid-email":
        alert("Invalid email address");
        break;
      case "auth/weak-password":
        alert("Password is too weak, should be above 6 characters");
        break;
      default:
        console.log("Couldn't create user, try again");
        alert("Couldn't create user, try again");
        break;
    }

    return false;
  }
};

//sign in a user with firebase authentification
export const signInUser = async (email, password) => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("signed in ");
    return true;
  } catch (error) {
    console.log("error in signin: " + error);

    switch (error.code) {
      case "auth/invalid-email":
        alert("Invalid email address");
        break;
      default:
        console.log("Couldn't log in, try again");
        alert("Couldn't log in, try again");
        break;
    }
    return false;
  }
};

export const signOutUser = async () => {
  const auth = getAuth();

  try {
    await signOut(auth);
    console.log("User signed out");
    return true;
  } catch (error) {
    console.log("Error signing out: " + error.code);
    return false;
  }
};
