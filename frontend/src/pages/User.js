import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash, FaRedoAlt } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';

const User = () => {
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState({
        fullname: '',
        email: '',
        password: '',
        role: 'Admin',
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
        if (!user || user.role !== 'Admin') {
            alert('Bạn không có quyền truy cập vào trang này.');
            navigate('/');
        }
        const timer = setTimeout(() => {
            setError('');
            setSuccess('');
        }, 3000);
        fetchUsers();

        return () => clearTimeout(timer);
    }, [error, success, navigate]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (err) {
            console.error(err);
            setError('Không thể lấy danh sách danh mục.');
        }
    };

    const convertToSlug = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, '');
    };  

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!userData.fullname) {
            setError('Vui lòng nhập đủ họ và tên.');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            let newUserData = { ...userData };
            
            // Chỉ tạo mật khẩu nếu không phải chỉnh sửa và người dùng chưa cung cấp mật khẩu
            if (!isEdit && !userData.password) {
                newUserData.password = convertToSlug(userData.fullname);
            }

            if (isEdit) {
                // Đảm bảo không cập nhật mật khẩu khi chỉ chỉnh sửa các trường khác
                delete newUserData.password; 
                await axios.put(`http://localhost:3000/api/users/${selectedUser._id}`, newUserData, { 
                    headers: { Authorization: `Bearer ${token}` } 
                });
            } else {
                await axios.post('http://localhost:3000/api/users', newUserData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setModalOpen(false);
            setSuccess('Lưu thông tin thành công!');
            fetchUsers();
        } catch (err) {
            console.error(err);
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess('Đã xóa một loại sản phẩm thành công.')
            fetchUsers();
        } catch (err) {
            console.error(err);
            setError(err.response ? err.response.data.message : err.message);
        }
        }
    };

    const handleResetPassword = async (fullname) => {
        try {
            await axios.post('http://localhost:3000/api/users/reset-password', { fullname });
            setSuccess(`Mật khẩu cho ${fullname} đã được reset.`);
        } catch (err) {
            setError(`Lỗi khi reset mật khẩu cho ${fullname}`);
            setSuccess('');
        }
    };

    const openModal = () => {
        setUserData({
            fullname: '',
            email: '',
            password: '',
            role: '',
        });
        setIsEdit(false);
        setModalOpen(true);
    };

    const openEditModal = (user) => {
        setUserData(user);
        setSelectedUser(user);
        setIsEdit(true);
        setModalOpen(true);
    };

    return (
        <div>
            <Header />
            <div style={{ padding: '20px' }}>
                <div className="header-container">
                    <h2 className="header-title">Quản Lý Người Dùng</h2>
                    <button className="add-button" onClick={openModal}><FaPlus /></button>
                </div>
            
                {success && <Alert variant="success">{success}</Alert>}
                
                <div className='roleheader' style={{ marginTop: '-25px' }}>
                    <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
                        <thead>
                            <tr style={{ textAlign: 'center', fontSize: '18px' }} >
                                <th style={{padding: '12px', width:'5%'}}>STT</th>
                                <th>Họ Và tên</th>
                                <th>Email</th>
                                <th>Vai Trò</th>
                                <th style={{padding: '12px', width:'10%'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map((user, index) => (
                                <tr key={user._id}>
                                    <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                                    <td style={{ padding: '15px'}}>{user.fullname}</td>
                                    <td style={{ padding: '15px'}}>{user.email}</td>
                                    <td style={{ padding: '15px'}}>{user.role}</td>
                                    <td style={{textAlign: 'center', verticalAlign: 'middle', width:'15%'}}>
                                        <button className="edit-button" onClick={() => openEditModal(user)}><FaEdit/></button>
                                        <button className="delete-button"  onClick={() => handleDelete(user._id)}><FaTrash/></button>
                                        <button className="reset-button" onClick={() => handleResetPassword(user.fullname)}><FaRedoAlt/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEdit ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form.Group className="mb-3">
                                <Form.Label>Họ Và Tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={userData.fullname}
                                    onChange={(e) => setUserData({ ...userData, fullname: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => setUserData({...userData, email: e.target.value,})}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Vai Trò</Form.Label>
                                <Form.Select
                                    as="select"
                                    value={userData.role}
                                    onChange={(e) => setUserData({...userData, role: e.target.value,})}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Producer">Nhà sản xuất</option>
                                    <option value="Transport">Nhà vận chuyển</option>
                                    <option value="Distributor">Nhà phân phối</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="contained" onClick={isEdit ? handleSubmit : handleSubmit}>
                            {isEdit ? <FaSyncAlt style={{ color: 'white' }} /> : <FaSave style={{ color: 'white' }}/>}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default User;