import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyD1rHK6SwiRsJy5R73YDc-5Spgb9OzLz6w",
    authDomain: "dockermysql.firebaseapp.com",
    projectId: "dockermysql",
    storageBucket: "dockermysql.appspot.com",
    messagingSenderId: "968089977666",
    appId: "1:968089977666:web:5fd7b20d71a70a6d07fedb",
    measurementId: "G-DGYDFE85PV"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const fetchToken = (setTokenFound) => {
    return getToken(messaging, {
        vapidKey:
            "BIfCh91B51XR7eeHX5MyRGVy7HpQOlA0GWkSYJsWuINuHNckNGGC6H8OD4LjgYOj2sM0yN9WYw9QYUnb80mH47c",
    })
        .then((currentToken) => {
            if (currentToken) {
                console.log("current token for client: ", currentToken);
                setTokenFound(true);
            } else {
                console.log(
                    "No registration token available. Request permission to generate one."
                );
                setTokenFound(false);
            }
        })
        .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
        });
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
