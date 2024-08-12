import './ForgotPassword.scss';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error('Email is required');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:8080/api/v1/forgot-password', { email });
            if (response.status === 200) {
                toast.success('Password reset email sent successfully');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to send reset email');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6">
                        <h2 className="text-center">Forgot Password</h2>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={handleForgotPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Email'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
