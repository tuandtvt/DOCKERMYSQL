require("dotenv").config();
import express from 'express';
import initWebRoutes from './route/web';
import initApiRoutes from './route/api';
import bodyParser from 'body-parser'; 
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import configCors from './config/cors';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

configCors(app);

initWebRoutes(app);
initApiRoutes(app);

app.use((req, res) => {
    return res.status(404).json({ error: 'NOT_FOUND', message: '404 not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
