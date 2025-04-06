import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyB9jYGbJmv5iOYvJpX01a1lXEBfPfonZXY",

  authDomain: "scholarship-d8b94.firebaseapp.com",

  projectId: "scholarship-d8b94",

  storageBucket: "scholarship-d8b94.appspot.com",

  messagingSenderId: "888325806377",

  appId: "1:888325806377:web:cf97894e882c096f13bf38",

  measurementId: "G-FXBTWHRTYB"

};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);



export { app, auth, db, storage };
