import './ResetPassword.scss';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams, useHistory } from 'react-router-dom';

const ResetPassword = () => {
    const { token } = useParams();
    const history = useHistory();
    const [newPassword, setNewPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!newPassword) {
            toast.error('Mật khẩu mới là bắt buộc');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post('http://localhost:8080/api/v1/reset-password', { token, newPassword });
            if (response.status === 200) {
                toast.success('Mật khẩu đã được đặt lại thành công');
                history.push('/login');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Đặt lại mật khẩu không thành công');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-8 col-md-6">
                        <h2 className="text-center">Đặt lại mật khẩu</h2>
                        <div className="form-group">
                            <label>Mật khẩu mới:</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-primary w-100 mt-3"
                            onClick={handleResetPassword}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang gửi...' : 'Đặt lại mật khẩu'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
