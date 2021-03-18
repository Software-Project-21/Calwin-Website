import {firebase} from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";



firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export { auth, firebase as default};