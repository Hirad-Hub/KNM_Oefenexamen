firebase.js;
// firebase.js - using compatibility version
// Initialize Firebase directly from the window object
const app = firebase.initializeApp({
  apiKey: "AIzaSyBiDIagU6zqq61MAssijBndlteFmXpInOg",
  authDomain: "knmtoest.firebaseapp.com",
  projectId: "knmtoest",
  storageBucket: "knmtoest.appspot.com",
  messagingSenderId: "754875829044",
  appId: "1:754875829044:web:c296b3e81823d00f7c7361",
  measurementId: "G-K0SXDGHGLV",
});

// Get auth from the firebase namespace
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Get Firestore database reference
const db = firebase.firestore();

// Export what we need
export { auth, provider, db };
