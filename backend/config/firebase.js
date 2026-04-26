const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");

// Node.js compatibility polyfill
if (typeof fetch === "undefined") {
  global.fetch = require("cross-fetch");
}

const firebaseConfig = {
  apiKey: "AIzaSyCRaohPy9a12KyBwwQyJX96iefX_uNTngM",
  authDomain: "caresetu-8a15d.firebaseapp.com",
  projectId: "caresetu-8a15d",
  storageBucket: "caresetu-8a15d.firebasestorage.app",
  messagingSenderId: "1086295476299",
  appId: "1:1086295476299:web:879ca679210cc1ff69a5ce",
  measurementId: "G-TYJCQXZ540"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { app, db, auth };
