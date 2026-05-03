import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASIs92YhxcMPYW6WmeLCcjMygq-i6eTQQ",
  authDomain: "pushnotificationtesting-d8ef8.firebaseapp.com",
  projectId: "pushnotificationtesting-d8ef8",
  storageBucket: "pushnotificationtesting-d8ef8.firebasestorage.app",
  messagingSenderId: "120536515466",
  appId: "1:120536515466:web:31a0705ce9c7f017447e73",
  measurementId: "G-ZPB1PN4C6V"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
