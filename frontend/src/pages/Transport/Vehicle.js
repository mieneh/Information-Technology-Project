import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleData, setVehicleData] = useState({
    type: '',
    plateNumber: '',
    capacity: '',
    maintenanceStatus: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const timer = setTimeout(() => {
        setError('');
        setSuccess('');
    }, 3000);
    fetchVehicles();
    return () => clearTimeout(timer);
  }, [error, success]);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/vehicles/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách phương tiện.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!vehicleData.type || !vehicleData.plateNumber || !vehicleData.capacity || !vehicleData.maintenanceStatus) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    try {
        if (isEdit) {
          await axios.put(`http://localhost:3000/api/vehicles/${selectedVehicle._id}`, vehicleData, { 
            headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          await axios.post('http://localhost:3000/api/vehicles/', vehicleData, { 
            headers: { Authorization: `Bearer ${token}` } }
          );
        }
        setModalOpen(false);
        setSuccess('Lưu thông tin thành công!');
        fetchVehicles();
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phương tiện này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Đã xóa phương tiện thành công.');
        fetchVehicles();
      } catch (err) {
        console.error(err);
        setError(err.response ? err.response.data.message : err.message);
      }
    }
  };

  const openModal = () => {
    setVehicleData({
      type: '',
      plateNumber: '',
      capacity: '',
      maintenanceStatus: '',
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setVehicleData(vehicle);
    setSelectedVehicle(vehicle);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2>Quản Lý Phương Tiện</h2>
        <button className="add-role" style={{marginTop: '-10px'}} onClick={openModal}>
          <FaPlus />
        </button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}

      <div className='roleheader'>
        <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
          <thead>
            <tr style={{ textAlign: 'center', fontSize: '18px' }} >
              <th style={{width:'5%'}}>STT</th>
              <th style={{ width:'15%'}}>Loại Phương Tiện</th>
              <th style={{ width:'10%'}}>Biển Số</th>
              <th style={{ width:'10%'}}>Sức Chứa</th>
              <th style={{ width:'10%'}}>Trạng Thái Bảo Trì</th>
              <th style={{padding: '12px', width:'10%'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))        
            .map((vehicle, index) => (
              <tr key={vehicle._id}>
                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{vehicle.type}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{vehicle.plateNumber}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{vehicle.capacity} kg</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{vehicle.maintenanceStatus}</td>
                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                  <button className="edit-button" onClick={() => openEditModal(vehicle)}><FaEdit/></button>
                  <button className="delete-button"  onClick={() => handleDelete(vehicle._id)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Phương Tiện' : 'Thêm Phương Tiện'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Loại Phương Tiện</Form.Label>
              <Form.Select
                value={vehicleData.type}
                onChange={(e) => setVehicleData({ ...vehicleData, type: e.target.value })}
                required
              >
                <option value="">Chọn loại phương tiện</option>
                <option value="Xe tải nhỏ">Xe tải nhỏ</option>
                <option value="Xe tải lớn">Xe tải lớn</option>
                <option value="Xe container">Xe container</option>
                <option value="Xe bồn">Xe bồn</option>
                <option value="Xe đông lạnh">Xe đông lạnh</option>
                <option value="Xe bán tải">Xe bán tải</option>
                <option value="Xe ba gác">Xe ba gác</option>
                <option value="Xe máy giao hàng">Xe máy giao hàng</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Biển Số</Form.Label>
              <Form.Control
                type="text"
                value={vehicleData.plateNumber}
                onChange={(e) => setVehicleData({ ...vehicleData, plateNumber: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sức Chứa (kg)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={vehicleData.capacity}
                onChange={(e) => setVehicleData({ ...vehicleData, capacity: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng Thái Bảo Trì</Form.Label>
              <Form.Check
                type="radio"
                label="Có"
                name="maintenanceStatus"
                value="Có"
                checked={vehicleData.maintenanceStatus === 'Có'}
                onChange={(e) =>
                  setVehicleData({ ...vehicleData, maintenanceStatus: e.target.value })
                }
              />
              <Form.Check
                type="radio"
                label="Không"
                name="maintenanceStatus"
                value="Không"
                checked={vehicleData.maintenanceStatus === 'Không'}
                onChange={(e) =>
                  setVehicleData({ ...vehicleData, maintenanceStatus: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="contained" onClick={isEdit ? handleSubmit : handleSubmit}>
            {isEdit ? <FaSyncAlt style={{ color: 'white' }} /> : <FaSave style={{ color: 'white' }} />}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Vehicle;
