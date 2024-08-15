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

export const fetchToken = async (setTokenFound) => {
    try {
        console.log("Dang yeu cau quyen thong bao");
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.log("Khong co quyen thong bao");
            setTokenFound(false);
            return;
        }

        console.log("Da duoc cap quyen thong bao");
        console.log("Dang yeu cau token");
        const currentToken = await getToken(messaging, {
            vapidKey: "BIfCh91B51XR7eeHX5MyRGVy7HpQOlA0GWkSYJsWuINuHNckNGGC6H8OD4LjgYOj2sM0yN9WYw9QYUnb80mH47c",
        });

        if (currentToken) {
            console.log("Token hien tai cua client: ", currentToken);
            setTokenFound(true);
            return currentToken;
        } else {
            console.log("Khong co token dang ky nao. Yeu cau quyen de tao token");
            setTokenFound(false);
        }
    } catch (err) {
        console.error("Da xay ra loi khi lay token. Chi tiet: ", err);
        setTokenFound(false);
    }
};

export const onMessageListener = () =>
    new Promise((resolve, reject) => {
        onMessage(messaging, (payload) => {
            console.log("Thong bao nhan duoc: ", payload);
            resolve(payload);
        }, reject);
    });
