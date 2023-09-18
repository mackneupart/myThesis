import { ConcertOne_400Regular } from "@expo-google-fonts/dev";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./Firebase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export function addUser(username, email, password) {
  const userDb = collection(db, "users");
  addDoc(userDb, {
    username: username,
    email: email,
    password: password,
  });
}

//register a user with firebase authentification
export const registerUser = (email, password) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user.email);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorcqode);
      // ..
    });
};

//sign in a user with firebase authentification
export const signInUser = (email, password) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user.email);
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(errorCode);
    });
};
