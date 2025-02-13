import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Alert } from 'react-bootstrap';
import '../components/index.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [role, setRole] = useState('Consumer');
    const [farmName, setFarmName] = useState('');
    const [farmLocation, setFarmLocation] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [location, setLocation] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
        }, 3000);

        const existingToken = localStorage.getItem('token');
        if (existingToken && existingToken.split) {
            alert("Bạn cần đăng xuất trước khi đăng ký người dùng mới.");
            navigate('/');
            return;
        }
        return () => clearTimeout(timer);
    }, [error]);

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        setError('Mật khẩu và xác nhận mật khẩu không khớp');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError('Email không hợp lệ.');
        return;
    }
      if (role === 'Producer') {
        if (!farmName || !farmLocation || !registrationNumber || !contactEmail || !contactPhone) {
          setError('Vui lòng điền đầy đủ thông tin cho nhà sản xuất');
          return;
        }
      } else if (role === 'Transport' || role === 'Distributor') {
        if (!companyName || !location || !registrationNumber || !contactEmail || !contactPhone) {
          setError(`Vui lòng điền đầy đủ thông tin cho ${role === 'Transport' ? 'đơn vị vận chuyển' : 'đơn vị phân phối'}`);
          return;
        }
      } else if (role === 'Producer' || role === 'Transport' || role === 'Distributor') {
        if (!/^\d{10,11}$/.test(contactPhone)) {
            setError('Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(contactEmail)) {
            setError('Email không hợp lệ.');
            return;
        }
        if (!/^\d{10}$/.test(registrationNumber)) {
            setError('Mã số thuế phải bao gồm 10 chữ số.');
            return;
        }
      }

      setLoading(true);
  
      try {
        await axios.post('http://localhost:3000/api/auth/register', {
          fullname,
          email,
          password,
          role,
          contactEmail: (role === 'Producer' || role === 'Transport' || role === 'Distributor') ? contactEmail : undefined,
          contactPhone: (role === 'Producer' || role === 'Transport' || role === 'Distributor') ? contactPhone : undefined,
          farmName: role === 'Producer' ? farmName : undefined,
          farmLocation: role === 'Producer' ? farmLocation : undefined,
          companyName: (role === 'Transport' || role === 'Distributor') ? companyName : undefined,
          location: (role === 'Transport' || role === 'Distributor') ? location : undefined,
          registrationNumber: (role === 'Producer' || role === 'Transport' || role === 'Distributor') ? registrationNumber : undefined,
        });
  
        navigate('/login');
  
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullname('');
        setFarmName('');
        setFarmLocation('');
        setRegistrationNumber('');
        setCompanyName('');
        setLocation('');
        setContactEmail('');
        setContactPhone('');
        setError('');
      } catch (err) {
        if (err.response && err.response.status === 400) {
            setError(err.response.data.message);
        } else {
            setError('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
        }
      } finally {
        setLoading(false);
      }
    };

    return (
        <div className="body">
            <div className="register-container">
                <div className="logo-log-res">
                    <a href="/"> <img src='/img/logo.png' alt="Logo" /> </a>
                </div>
                <div className="header-res-log">
                    <h5>Đăng Ký Tài Khoản</h5>
                    {error && <Alert variant="danger">{error}</Alert>}
                </div>
                <Form onSubmit={handleSubmit} >
                    <Form.Group controlId="formFullname" className="form-group">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nhập họ và tên"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            required
                        />
                    </Form.Group>
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
                    <Form.Group controlId="formConfirmPassword" className="form-group">
                        <Form.Label>Xác nhận mật khẩu</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formBasicRole" className="form-group">
                        <Form.Label>Nhu cầu sử dụng</Form.Label>
                        <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="Consumer">Tiêu dùng</option>
                            <option value="Producer">Sản xuất</option>
                            <option value="Transport">Vận chuyển</option>
                            <option value="Distributor">Phân phối</option>
                        </Form.Control>
                    </Form.Group>

                    {role === 'Producer' && (
                    <>
                        <Form.Group controlId="formFarmName" className="form-group">
                            <Form.Label>Tên trang trại</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên trang trại"
                                value={farmName}
                                onChange={(e) => setFarmName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formFarmLocation" className="form-group">
                            <Form.Label>Vị trí trang trại</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập vị trí trang trại"
                                value={farmLocation}
                                onChange={(e) => setFarmLocation(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </>
                    )}

                    {(role === 'Transport' || role === 'Distributor') && (
                    <>
                        <Form.Group controlId="formCompanyName" className="form-group">
                            <Form.Label>Tên công ty</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên công ty"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formLocation" className="form-group">
                            <Form.Label>Vị trí công ty</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập vị trí công ty"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </>
                    )}
                    {(role === 'Producer' || role === 'Transport' || role === 'Distributor') && (
                    <>
                        <Form.Group controlId="formRegistrationNumber" className="form-group">
                            <Form.Label>Mã số thuế</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập mã số thuế"
                                value={registrationNumber}
                                onChange={(e) => setRegistrationNumber(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formContactPhone" className="form-group">
                            <Form.Label>Số điện thoại liên hệ</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập số điện thoại liên hệ"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formContactEmail" className="form-group">
                            <Form.Label>Email liên hệ</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Nhập email liên hệ"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </>
                    )}
                    <button style={{color: 'white'}} className="button btn" type="submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đăng ký'}
                    </button>
                    <p className="small">
                        Đã có tài khoản? <a href="/login">Đăng nhập</a> 
                    </p>
                </Form>
            </div>
        </div>
    );
};

export default Register;