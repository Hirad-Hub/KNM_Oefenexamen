// firebase.js - using modular Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiDIagU6zqq61MAssijBndlteFmXpInOg",
  authDomain: "knmtoest.firebaseapp.com",
  projectId: "knmtoest",
  storageBucket: "knmtoest.appspot.com",
  messagingSenderId: "754875829044",
  appId: "1:754875829044:web:c296b3e81823d00f7c7361",
  measurementId: "G-K0SXDGHGLV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export required modules
export { auth, provider, signInWithPopup };
