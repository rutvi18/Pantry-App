// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdRqiX9aRkXu99ITZFSu8MXavS5lxs06M",
  authDomain: "hspantryapp-c2bf2.firebaseapp.com",
  projectId: "hspantryapp-c2bf2",
  storageBucket: "hspantryapp-c2bf2.appspot.com",
  messagingSenderId: "475587191638",
  appId: "1:475587191638:web:46d0e359c6bf2606a5acf7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { app, firestore };
