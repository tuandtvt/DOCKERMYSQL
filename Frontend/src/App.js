import './App.scss';
import Nav from './components/Navigation/Nav';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Products from './components/Product/Product';
import Cart from './components/Cart/Cart';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
    <div className='app-container'>
      {/* <Nav /> */}
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
          <Login/>
        </Route>
        <Route path="/register">
          <Register/>
        </Route>
        <Route path="/product">
          <Products/>
        </Route>
        <Route path="/cart">
          <Cart/>
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
      {/* Same as */}
    </Router>
  );
}

export default App;
