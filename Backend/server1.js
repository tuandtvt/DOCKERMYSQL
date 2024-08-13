const express = require("express");
const admin = require("firebase-admin");

const app = express();
app.use(express.json());

const serviceAccount = require("./src/config/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

app.post('/send-noti', (req, res) => {
    console.log("Received notification request");
    try {
        const { title, content, token } = req.body;

        if (!token) {
            return res.status(400).send({ message: 'Token is required' });
        }

        const message = {
            token: token,
            notification: {
                title: title,
                body: content,
            },
        };

        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
                res.status(200).send({ message: response });
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                res.status(500).send({ message: error });
            });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

app.listen(5000, () => {
    console.log(`Server 1 running on port 5000`);
});
