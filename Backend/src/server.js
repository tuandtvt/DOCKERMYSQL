require("dotenv").config();
import express from 'express';
import initWebRoutes from './route/web';
import initApiRoutes from './route/api';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';
import configCors from './config/cors';
import { connectQueue } from './services/queueService';

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

const PORTS = [
  process.env.PORT0 || 8080,
  process.env.PORT1 || 8081,
  process.env.PORT2 || 8082,
  process.env.PORT3 || 8083,
  process.env.PORT4 || 8084,
  process.env.PORT5 || 8085,
];

const startServer = async () => {
  try {
    await connectQueue();
    console.log("Connected to RabbitMQ and Kafka");

    PORTS.forEach((PORT) => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
