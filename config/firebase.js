import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCufnRhMzXmxmzTPPTWRQILMgHYSUf6Xt8",
  authDomain: "ride-mate-ea3ac.firebaseapp.com",
  databaseURL:
    "https://ride-mate-ea3ac-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ride-mate-ea3ac",
  storageBucket: "ride-mate-ea3ac.appspot.com",
  messagingSenderId: "105939869599",
  appId: "1:105939869599:web:db74bf1b6da4396fa167aa",
};

firebase.initializeApp(firebaseConfig);

export default firebase.app();
