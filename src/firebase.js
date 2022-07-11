import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1N3FZ1xq2SpYipUM03MG54-nwq00WvqA",
  authDomain: "netflix-clone-b334e.firebaseapp.com",
  projectId: "netflix-clone-b334e",
  storageBucket: "netflix-clone-b334e.appspot.com",
  messagingSenderId: "234640759914",
  appId: "1:234640759914:web:ba6c10ca7ce1c2955abe13"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth }
export default db