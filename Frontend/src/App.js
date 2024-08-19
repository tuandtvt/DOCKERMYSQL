import './App.scss';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ProductList from './components/Product/ProductList';
import Cart from './components/Cart/Cart';
import { fetchToken, onMessageListener } from './firebase';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({ title: '', body: '' });
  const [isTokenFound, setTokenFound] = useState(false);
  const [currentToken, setCurrentToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      console.log("Dang lay token");
      const token = await fetchToken(setTokenFound);
      if (token) {
        setCurrentToken(token);
      } else {
        console.log("Khong lay duoc token.");
      }
    };

    getToken();
  }, []);

  useEffect(() => {
    const listenForMessages = async () => {
      try {
        console.log("Dang lang nghe thong bao");
        const payload = await onMessageListener();
        setNotification({ title: payload.notification.title, body: payload.notification.body });
        setShow(true);
        console.log("Thong bao da nhan: ", payload);
      } catch (err) {
        console.error('Lang nghe thong bao that bai: ', err);
      }
    };

    listenForMessages();
  }, []);

  return (
    <Router>
      <div className='app-container'>
        <Switch>
          <Route path="/news">
            news
          </Route>
          <Route path="/about">
            about
          </Route>
          <Route path="/contact">
            contact
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword />
          </Route>
          <Route path="/api/v1/reset-password/:token" component={ResetPassword} />
          <Route path="/products">
            <ProductList />
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/home" exact>
            home
          </Route>
          <Route path="*">
            404 not found
          </Route>
        </Switch>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;
