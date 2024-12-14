//frontend/src/pages/Login.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setSuccess('');
            setError('');
        }, 3000);

        return () => clearTimeout(timer);
    }, [success, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username: email,
                password,
            });

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                navigate('/');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Đăng nhập thất bại:', err);
            setError('Có lỗi xảy ra khi đăng nhập');
        }
    };

    return (
        <div className="body-login">
        <div className="login">
            <div className="inner-container">
                <div className="logo-login">
                    <a href="/login">
                        <img src='img/logo.png' alt="Logo" />
                    </a>
                </div>

                <div className="card-login">
                    <div className="card-body">
                        <div className="header-login">
                            <h5>Đăng Nhập</h5>
                            <p className="small">Nhập email và mật khẩu để đăng nhập</p>
                            {success && (
                                <div className="alert alert-success" id="success-notification">
                                    {success}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger" id="error-notification">
                                    {error}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-group">
                                    <span className='input-group-text'>@</span>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Mật Khẩu</label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    name="remember"
                                    checked={remember}
                                    onChange={() => setRemember(!remember)}
                                />
                                <label htmlFor="rememberMe">Ghi nhớ tài khoản</label>
                            </div>

                            <button type="submit" className="btn">Đăng Nhập</button>

                            <p className="small">
                                Chưa có tài khoản? <a href="https://zalo.me/0977896226" target="_blank" rel="noopener noreferrer">Liên hệ</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
     </div>
    );
};

export default Login;