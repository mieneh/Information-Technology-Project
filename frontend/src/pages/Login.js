import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Alert } from 'react-bootstrap';
import '../components/index.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    if (localStorage.getItem('token')) {
        alert("Bạn cần đăng xuất trước khi đăng nhập lại.");
        navigate('/');
        return;
    }
    return () => clearTimeout(timer);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      sessionStorage.getItem('token', response.data.token)

      if (rememberMe) {
        localStorage.setItem('email', email);
      } else {
        localStorage.removeItem('email');
      }
      navigate('/profile');

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Sai email hoặc mật khẩu');
    }
  };

  return (
    <div className="body">
      <div className="login-container">
        <div className="logo-log-res">
          <a href="/"> <img src='/img/logo.png' alt="Logo" /> </a>
        </div>
        <div className="header-res-log">
          <h5>Đăng Nhập</h5>
          <p>Nhập email và mật khẩu để đăng nhập</p>                    
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="form-group">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formRememberMe">
            <Form.Check
              type="checkbox"
              label="Ghi nhớ tài khoản"
              className="check-label"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
          </Form.Group>
          <button style={{color: 'white'}} type="submit" disabled={loading} className="button btn">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        </Form>
        <p className="small"> Chưa có tài khoản? <a href="https://zalo.me/0977896226" target="_blank" rel="noopener noreferrer">Liên hệ</a> | <a href="/register">Đăng ký</a> </p>
      </div>
    </div>
  );
};

export default Login;