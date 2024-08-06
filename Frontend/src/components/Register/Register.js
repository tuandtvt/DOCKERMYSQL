import './Register.scss'
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useEffect, useState } from 'react';


const Register = (props) => {

    const [email, setEmail] = useState("");
    const [usename, setUsename] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
   
    let history = useHistory()
    const handleLogin = () => {
        history.push('/login');
    }

    useEffect(() => {
        // axios.get('https://reqres.in/api/register').then(data =>{
        //     console.log('>>> check data', data)
        // })
    }, []);

    const handleRegister = () => {
        let useData = {email, usename, password, confirmPassword};
        console.log('>>> check userData', useData)
    }

    return (
        <div className="register-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="content-left col-12 d-none col-sm-7 d-sm-block">
                        <div className='brand'>
                            Facebook
                        </div>
                        <div className='detail'>
                            Facebook help you connect and share with the people in your life
                        </div>
                    </div>
            
                    <div className="content-right col-sm-5 col-12 d-flex flex-column gap-3 py-3">
                        <div className='brand d-sm-none'>
                            Facebook
                        </div>
                        <div className='form-group'>
                            <label>Email:</label>
                            <input type='text' className='form-control' placeholder='Email address'
                                value={email} onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Tên người dùng:</label>
                            <input type='text' className='form-control' placeholder='Username'
                                value={usename} onChange={(event) => setUsename(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Mật khẩu:</label>
                            <input type='password' className='form-control' placeholder='Password'
                                value={password} onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Nhập lại mật khẩu:</label>
                            <input type='password' className='form-control' placeholder='Re-enter password'
                                value={confirmPassword} onChange={(event) => setconfirmPassword(event.target.value)}
                            />
                        </div>
                        <button className='btn btn-primary' onClick={()=> handleRegister()}>Register</button>
                       
                        <hr/>
                        <div className='text-center'>
                            <button className='btn btn-success' onClick={() => handleLogin()}>
                                Already have accout. Login
                            </button>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
    )
}

export default Register;