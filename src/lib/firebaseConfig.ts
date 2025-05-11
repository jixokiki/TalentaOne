// src/lib/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAR8w6cIWcg7tgT-OlOH_evqqzuN6FHTcQ",
  authDomain: "layananjasa-8ed57.firebaseapp.com",
  projectId: "layananjasa-8ed57",
  storageBucket: "layananjasa-8ed57.appspot.com",
  messagingSenderId: "306221228089",
  appId: "1:306221228089:web:902ad16b4bedd833beede8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { auth, db, storage };
