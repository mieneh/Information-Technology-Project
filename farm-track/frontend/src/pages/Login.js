//frontend/src/pages/Login.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
        }, 3000);

        const token = localStorage.getItem('token');
        if (token) {
            navigate('/product');
        }

        return () => clearTimeout(timer);
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                email,
                password,
            });
            
            if (remember) {
                localStorage.setItem('token', response.data.token);
            } else {
                sessionStorage.setItem('token', response.data.token);
            }

            navigate('/product');
        } catch (error) {
            setError(error.response?.data?.message || 'Đã xảy ra lỗi');
        } finally {
            setLoading(false);
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

                                <button type="submit" className="btn" disabled={loading}>{loading ? 'Đăng Nhập vào...' : 'Đăng Nhập'}</button>

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