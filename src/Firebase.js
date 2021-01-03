import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyB-SwLppEaG8N89i7KfBMkUayLrMBJkLyY",
        authDomain: "insta-clone-ee345.firebaseapp.com",
        databaseURL: "https://insta-clone-ee345.firebaseio.com",
        projectId: "insta-clone-ee345",
        storageBucket: "insta-clone-ee345.appspot.com",
        messagingSenderId: "922283294219",
        appId: "1:922283294219:web:219d228c6498ef8201110e"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};