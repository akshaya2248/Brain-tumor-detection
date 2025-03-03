import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCv85Zc6Sj1ywi5z0KWgYH-BjK_zzp0UmM",
  authDomain: "brain-tumor-85fa3.firebaseapp.com",
  projectId: "brain-tumor-85fa3",
  storageBucket: "brain-tumor-85fa3.appspot.com",
  messagingSenderId: "36451776797",
  appId: "1:36451776797:web:05b740b88c82f596d689f4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);



export { app, auth, db, storage };