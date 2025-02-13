import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import { FaEdit, FaSyncAlt, FaRedoAlt, FaKey } from 'react-icons/fa';
import Header from "../components/Header";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatedUser, setUpdatedUser] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    const user = JSON.parse(atob(token.split('.')[1]));
    if (!user) {
      alert('Bạn không có quyền truy cập vào trang này.');
      navigate('/');
    }

    setTimeout(() => {
      setError('');
      setMessage('');
      setPasswordError('');
    }, 3000);

    fetchUserProfile();
  }, [error, message, passwordError]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/profile', {
        headers: {'Authorization': `Bearer ${token}`,},
      });
      setUser(response.data.user);
      setUpdatedUser(response.data.user);
    } catch (err) {
      setError('Không thể lấy thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!/^\d{10,11}$/.test(updatedUser.contactPhone)) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(updatedUser.contactEmail)) {
      setError('Email không hợp lệ.');
      return;
    }
    if (!/^\d{10}$/.test(updatedUser.registrationNumber)) {
      setError('Mã số thuế phải bao gồm 10 chữ số.');
      return;
    }

    const formData = new FormData();

    for (const key in updatedUser) {
      formData.append(key, updatedUser[key]);
    }

    try {
      const response = await axios.put('http://localhost:3000/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }, 'Content-Type': 'multipart/form-data',
      });
      setUser(response.data.user);
      setMessage('Cập nhật thông tin thành công!');
      setShowEditModal(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      await axios.put('http://localhost:3000/api/auth/change-password', passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Đổi mật khẩu thành công!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError('');
      setShowPasswordModal(false);
    } catch (err) {
      setPasswordError('Có lỗi xảy ra khi đổi mật khẩu.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Không có thông tin người dùng</div>;

  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <div className="header-container">
          <h2 className="header-title">Hồ sơ cá nhân</h2>
        </div>
        <div className="profile-container">
          <div className="profile-image">
            <img src={user.image ? user.image : "/img/admin.jpg"} alt="Profile" />
          </div>
          <div className="profile-info">
            {message && <Alert variant="success">{message}</Alert>}
            <p><strong>Họ và tên:</strong> {user.fullname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Vai trò:</strong> {user.role}</p>
            {user.role === 'Producer' && (
              <>
                <p><strong>Tên trang trại:</strong> {user.farmName}</p>
                <p><strong>Vị trí trang trại:</strong> {user.farmLocation}</p>
              </>
            )}
            {(user.role === 'Transport' || user.role === 'Distributor') && (
              <>
                <p><strong>Tên công ty:</strong> {user.companyName}</p>
                <p><strong>Vị trí công ty:</strong> {user.location}</p>
              </>
            )}
            {(user.role === 'Producer' || user.role === 'Transport' || user.role === 'Distributor') && (
              <>
                <p><strong>Mã số thuế:</strong> {user.registrationNumber || "Chưa có thông tin"}</p>
                <p><strong>Số điện thoại:</strong> {user.contactPhone || "Chưa có thông tin"}</p>
                <p><strong>Email:</strong> {user.contactEmail || "Chưa có thông tin"}</p>
              </>
            )}
            <Button className="button" variant="primary" onClick={() => setShowEditModal(true)}><FaEdit /></Button>
            <Button className="button" variant="secondary" onClick={() => setShowPasswordModal(true)}><FaKey/></Button>
          </div>
          {/* Modal Chỉnh sửa thông tin */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Chỉnh sửa hồ sơ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form>
                <Form.Group controlId="formFullname" className="form-group">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser.fullname}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, fullname: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmail" className="form-group">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={updatedUser.email}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                    disabled
                  />
                </Form.Group>
                
                {user.role === 'Producer' && (
                  <>
                    <Form.Group controlId="formFarmName" className="form-group">
                      <Form.Label>Tên trang trại</Form.Label>
                      <Form.Control
                        type="text"
                        value={updatedUser.farmName || ''}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, farmName: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="formFarmLocation" className="form-group">
                      <Form.Label>Vị trí trang trại</Form.Label>
                      <Form.Control
                        type="text"
                        value={updatedUser.farmLocation || ''}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, farmLocation: e.target.value })}
                      />
                    </Form.Group>
                  </>
                )}

                {(user.role === 'Transport' || user.role === 'Distributor') && (
                  <>
                    <Form.Group controlId="formCompanyName" className="form-group">
                      <Form.Label>Tên công ty</Form.Label>
                      <Form.Control
                        type="text"
                        value={updatedUser.companyName || ''}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, companyName: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="formLocation" className="form-group">
                      <Form.Label>Vị trí công ty</Form.Label>
                      <Form.Control
                        type="text"
                        value={updatedUser.location || ''}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, location: e.target.value })}
                      />
                    </Form.Group>
                  </>
                )}
                  
                {(user.role === 'Producer' || user.role === 'Transport' || user.role === 'Distributor') && (
                  <>
                    <Form.Group controlId="formRegistrationNumber" className="form-group">
                      <Form.Label>Mã số thuế</Form.Label>
                      <Form.Control
                        type="text"
                        value={updatedUser.registrationNumber || ''}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, registrationNumber: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="formContactPhone" className="form-group">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        type="text"
                        value={updatedUser.contactPhone || ''}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, contactPhone: e.target.value })}
                      />
                    </Form.Group>
                    <Form.Group controlId="formContactEmail" className="form-group">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={updatedUser.contactEmail || ''}
                        onChange={(e) => setUpdatedUser({ ...updatedUser, contactEmail: e.target.value })}
                      />
                    </Form.Group>
                  </>
                )}
                  
                <Form.Group controlId="formProfileImage" className="form-group">
                  <Form.Label>Ảnh hồ sơ</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setUpdatedUser({ ...updatedUser, image: e.target.files[0] })}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="contained" onClick={handleUpdate}>
                <FaSyncAlt style={{ color: 'white' }} />
              </Button>
              <Button variant="contained" onClick={() => setUpdatedUser(user)}>
                <FaRedoAlt style={{ color: 'white' }} />
              </Button>
            </Modal.Footer>
          </Modal>
          
          {/* Modal Đổi mật khẩu */}
          <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Đổi mật khẩu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {passwordError && <Alert variant="danger">{passwordError}</Alert>}
              <Form>
                <Form.Group controlId="formOldPassword" className="form-group">
                  <Form.Label>Mật khẩu cũ</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formNewPassword"className="form-group">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword" className="form-group">
                  <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="contained" onClick={handlePasswordChange}>
                <FaSyncAlt style={{ color: 'white' }} />
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Profile;