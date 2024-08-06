require("dotenv").config();
import express from 'express';
import initWebRoutes from './route/web';
import bodyParser from 'body-parser'; 
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

initWebRoutes(app);

app.use((req, res) => {
    return res.status(404).json({ error: 'NOT_FOUND', message: '404 not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_URL);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
