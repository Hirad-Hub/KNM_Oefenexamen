// firebase.js - updated to use global imports
const {
  initializeApp,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  getAnalytics,
} = window.firebase;

// Your Firebase config
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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export authentication functions
export { auth, provider, signInWithPopup, signOut };
