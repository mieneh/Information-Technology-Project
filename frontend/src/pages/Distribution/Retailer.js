import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, Alert } from 'react-bootstrap';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Retailer = () => {
  const [retailers, setRetailers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [retailerData, setRetailerData] = useState({
    type: 'Siêu thị',
    fullname: '',
    address: '',
    phone: '',
    email: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    fetchRetailers();
    return () => clearTimeout(timer);
  }, [error, success]);

  const fetchRetailers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/retailers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRetailers(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách nhà bán lẻ.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!retailerData.type || !retailerData.fullname || !retailerData.address) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (!retailerData.phone || !/^\d{10,12}$/.test(retailerData.phone)) {
        setError('Số điện thoại không hợp lệ. Vui lòng nhập từ 10-12 chữ số.');
        return;
    }
    if (!retailerData.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(retailerData.email)) {
        setError('Email không hợp lệ.');
        return;
    }
    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/api/retailers/${selectedRetailer._id}`, retailerData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:3000/api/retailers', retailerData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      fetchRetailers();
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà bán lẻ này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/retailers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Đã xóa nhà bán lẻ thành công.');
        fetchRetailers();
      } catch (err) {
        console.error(err);
        setError(err.response ? err.response.data.message : err.message);
      }
    }
  };

  const openModal = () => {
    setRetailerData({
      type: '',
      fullname: '',
      address: '',
      phone: '',
      email: '',
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (retailer) => {
    setRetailerData(retailer);
    setSelectedRetailer(retailer);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2>Quản Lý Nhà Bán Lẻ</h2>
        <button className="add-role" onClick={openModal}><FaPlus /></button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}

      <div className='roleheader'>
        <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
          <thead>
            <tr style={{ textAlign: 'center', fontSize: '18px', height: '50px' }} >
              <th style={{ width:'5%'}}>STT</th>
              <th>Họ Và Tên</th>
              <th>Đối Tác</th>
              <th>Địa Chỉ</th>
              <th>Số Điện Thoại</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {retailers
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((retailer, index) => (
              <tr key={retailer._id}>
                <td style={{ textAlign: 'center', padding: '15px' }}>{index + 1}</td>
                <td style={{ padding: '15px' }}>{retailer.fullname}</td>
                <td style={{ padding: '15px' }}>{retailer.type}</td>
                <td style={{ padding: '15px' }}>{retailer.address}</td>
                <td style={{ padding: '15px' }}>{retailer.phone || 'N/A'}</td>
                <td>{retailer.email || 'N/A'}</td>
                <td style={{textAlign: 'center', verticalAlign: 'middle' }}>
                  <button className="edit-button" onClick={() => openEditModal(retailer)}><FaEdit /></button>
                  <button className="delete-button" onClick={() => handleDelete(retailer._id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Nhà Bán Lẻ' : 'Thêm Nhà Bán Lẻ'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="mb-3">
              <Form.Label>Đối Tác Kinh Doanh</Form.Label>
              <Form.Select
                value={retailerData.type}
                onChange={(e) => setRetailerData({ ...retailerData, type: e.target.value }) }
                required
              >
                <option value="Siêu thị">Siêu thị</option>
                <option value="Cửa hàng tiện lợi">Cửa hàng tiện lợi</option>
                <option value="Tạp hóa">Tạp hóa</option>
                <option value="Khách vãng lai">Khách vãng lai</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hạ Và Tên</Form.Label>
              <Form.Control
                type="text"
                value={retailerData.fullname}
                onChange={(e) => setRetailerData({ ...retailerData, fullname: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa Chỉ</Form.Label>
              <Form.Control
                type="text"
                value={retailerData.address}
                onChange={(e) => setRetailerData({ ...retailerData, address: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số Điện Thoại</Form.Label>
              <Form.Control
                type="text"
                value={retailerData.phone}
                onChange={(e) => setRetailerData({ ...retailerData, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={retailerData.email}
                onChange={(e) => setRetailerData({ ...retailerData, email: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSubmit}>
            {isEdit ? <FaSyncAlt /> : <FaSave />}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Retailer;