import './Login.scss';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const defaultValidInput = {
        isValidEmail: true,
        isValidPassword: true,
    };
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);
    
    let history = useHistory();

    const handleCreateNewAccount = () => {
        history.push('/register');
    };

    const isValidInputs = () => {
        setObjCheckInput(defaultValidInput);

        if (!email) {
            toast.error('Email is required');
            setObjCheckInput({...defaultValidInput, isValidEmail: false});
            return false;
        }
        let regx = /\S+@\S+\.\S+/;
        if (!regx.test(email)) {
            setObjCheckInput({...defaultValidInput, isValidEmail: false});
            toast.error('Please enter a valid email address');
            return false;
        }
        if (!password) {
            setObjCheckInput({...defaultValidInput, isValidPassword: false});
            toast.error('Password is required');
            return false;
        }
        // let regxx = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        // if(!regxx.test(password)) {
        //     setObjCheckInput({...defaultValidInput, isValidPassword: false});
        //     toast.error('Please enter a valid password');
        //     return false;
        // }
        
        return true;
    };

    const handleLogin = () => {
        let check = isValidInputs();

        if (check) {
            axios.post('http://localhost:8080/api/v1/login', {
                email, password
            }).then(response => {
                console.log('Login response:', response);
                if (response.status === 200) {
                    toast.success('Login successful!');
                    history.push('/home'); 
                }
            }).catch(error => {
                console.error('Login error:', error);
                if (error.response) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error('Login failed');
                }
            });
        }
    };

    return (
        <div className="login-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className='brand'>
                            Facebook
                        </div>
                        <div className='detail'>
                            Facebook helps you connect and share with the people in your life.
                        </div>
                    </div>

                    <div className="content-right col-sm-5 col-12 d-flex flex-column gap-3 py-3">
                        <div className='brand d-sm-none'>
                            Facebook
                        </div>
                        <div className='form-group'>
                            <label>Email:</label>
                            <input
                                type='text'
                                className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'}
                                placeholder='Email address'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label>Password:</label>
                            <input
                                type='password'
                                className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'}
                                placeholder='Password'
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <button className='btn btn-primary' type='button' onClick={handleLogin}>Login</button>
                       
                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={handleCreateNewAccount}>
                                Create new account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
