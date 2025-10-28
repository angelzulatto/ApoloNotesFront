// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "apolonotes.firebaseapp.com",
  projectId: "apolonotes",
  storageBucket: "apolonotes.firebasestorage.app",
  messagingSenderId: "889113811171",
  appId: "1:889113811171:web:f68162811b335662e60dd6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
