import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { DB } from "./api/firestore.js";
import config from './firebase-config.json';
const firebaseConfig = config; // used to run Google server operations when hosting locally

firebase.initializeApp(firebaseConfig);

// ---------------- SIGN UP/IN WITH GOOGLE ----------------
const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => {
  auth.signInWithPopup(provider)
  .then(credential => {
    DB.createUser(credential.user) // conditional method, won't create everytime
  })
};
 
// ---------------- SIGN UP WITH EMAIL ----------------
export const signUpWithEmail = async (user, additionalData) => {
  DB.createUser(user, additionalData)
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();