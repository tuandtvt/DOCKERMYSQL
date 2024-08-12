import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyD1rHK6SwiRsJy5R73YDc-5Spgb9OzLz6w",
    authDomain: "dockermysql.firebaseapp.com",
    projectId: "dockermysql",
    storageBucket: "dockermysql.appspot.com",
    messagingSenderId: "968089977666",
    appId: "1:968089977666:web:5fd7b20d71a70a6d07fedb",
    measurementId: "G-DGYDFE85PV"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };
