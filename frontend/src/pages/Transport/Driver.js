import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Driver = () => {
  const [drivers, setDrivers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [driverData, setDriverData] = useState({
    name: '',
    sdt: '',
    GPLX: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
    
  const token = localStorage.getItem('token');

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    fetchDrivers();
    return () => clearTimeout(timer);
  }, [error, success]);
  
  const fetchDrivers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/drivers/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDrivers(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách tài xế.');
    }
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!driverData.name || !driverData.sdt || !driverData.GPLX) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/api/drivers/${selectedDriver._id}`, driverData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:3000/api/drivers', driverData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      fetchDrivers();
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data.message : err.message);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài xế này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/drivers/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Đã xóa tài xế thành công.');
        fetchDrivers();
      } catch (err) {
        console.error(err);
        setError(err.response ? err.response.data.message : err.message);
      }
    }
  };
  
  const openModal = () => {
    setDriverData({
      name: '',
      sdt: '',
      GPLX: '',
    });
    setIsEdit(false);
    setModalOpen(true);
  };
  
  const openEditModal = (driver) => {
    setDriverData(driver);
    setSelectedDriver(driver);
    setIsEdit(true);
    setModalOpen(true);
  };
  
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2>Quản Lý Tài Xế</h2>
        <button className="add-role" style={{marginTop: '-10px'}} onClick={openModal}>
          <FaPlus />
        </button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}
  
      <div className='roleheader'>
        <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
          <thead>
            <tr style={{textAlign: 'center', fontSize: '18px'}} >
              <th style={{width:'5%'}}>STT</th>
              <th style={{width:'10%'}}>Họ Và Tên</th>
              <th style={{width:'10%'}}>Số Điện Thoại</th>
              <th style={{width:'10%'}}>GPLX</th>
              <th style={{padding: '12px', width:'10%'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((driver, index) => (
              <tr key={driver._id}>
                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{driver.name}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{driver.sdt}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{driver.GPLX}</td>
                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                  <button className="edit-button" onClick={() => openEditModal(driver)}><FaEdit/></button>
                  <button className="delete-button"  onClick={() => handleDelete(driver._id)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Tài Xế' : 'Thêm Tài Xế'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Tên Tài Xế</Form.Label>
              <Form.Control
                type="text"
                value={driverData.name}
                onChange={(e) => setDriverData({ ...driverData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số Điện Thoại</Form.Label>
              <Form.Control
                type="text"
                value={driverData.sdt}
                onChange={(e) => setDriverData({ ...driverData, sdt: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>GPLX</Form.Label>
              <Form.Control
                type="text"
                value={driverData.GPLX}
                onChange={(e) => setDriverData({ ...driverData, GPLX: e.target.value })}
                required
              />
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
  );
};
    
export default Driver;