import './Register.scss';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Register = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [objCheckInput, setObjCheckInput] = useState({
        isValidEmail: true,
        isValidUsername: true,
        isValidPassword: true,
        isValidAddress: true,
    });

    const history = useHistory();

    const handleLogin = () => {
        history.push('/login');
    };

    const isValidInputs = () => {
        setObjCheckInput({
            isValidEmail: true,
            isValidUsername: true,
            isValidPassword: true,
            isValidAddress: true,
        });

        let valid = true;

        if (!email) {
            toast.error('Email is required');
            setObjCheckInput(prev => ({ ...prev, isValidEmail: false }));
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email address');
            setObjCheckInput(prev => ({ ...prev, isValidEmail: false }));
            valid = false;
        }

        if (!username) {
            toast.error('Username is required');
            setObjCheckInput(prev => ({ ...prev, isValidUsername: false }));
            valid = false;
        }

        if (!password) {
            toast.error('Password is required');
            setObjCheckInput(prev => ({ ...prev, isValidPassword: false }));
            valid = false;
        } else if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
            toast.error('Please enter a valid password');
            setObjCheckInput(prev => ({ ...prev, isValidPassword: false }));
            valid = false;
        }

        if (!address) {
            toast.error('Address is required');
            setObjCheckInput(prev => ({ ...prev, isValidAddress: false }));
            valid = false;
        }

        return valid;
    };

    const handleRegister = async () => {
        if (isValidInputs()) {
            try {
                const response = await axios.post('http://localhost:8080/api/v1/register', {
                    email,
                    username,
                    password,
                    address,
                });
                if (response.status === 200) {
                    toast.success('Registration successful!');
                    history.push('/login');
                }
            } catch (error) {
                toast.error('Registration failed. Please try again.');
                console.error('Registration error:', error);
            }
        }
    };

    return (
        <div className="register-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className='brand'>
                            Shoppe
                        </div>
                        <div className='detail'>
                            Shoppe helps you connect and share with the people in your life
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
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label>Username:</label>
                            <input
                                type='text'
                                className={objCheckInput.isValidUsername ? 'form-control' : 'form-control is-invalid'}
                                placeholder='Username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <label>Address:</label>
                            <input
                                type='text'
                                className={objCheckInput.isValidAddress ? 'form-control' : 'form-control is-invalid'}
                                placeholder='Address'
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>
                        <button className='btn btn-primary' type='button' onClick={handleRegister}>Register</button>
                        <hr />
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={handleLogin}>
                                Already have an account? Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
