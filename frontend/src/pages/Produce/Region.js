import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Form, Alert } from 'react-bootstrap';
import { FaSave, FaPlus, FaEdit, FaTrash, FaSyncAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Region = () => {
  const [regions, setRegions] = useState([]);
  const [regionData, setRegionData] = useState({
    type: '',
    name: '',
    address: {
      province: '',
      district: '',
      commune: '',
      street: '',
    },
    area: '',
    description: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    fetchRegions();
    return () => clearTimeout(timer);
  }, [error, success]);

  const fetchRegions = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/regions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegions(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách khu vực.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!regionData.name || !regionData.type || !regionData.address.province) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }
    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:3000/api/regions/${selectedRegion._id}`,
          regionData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post('http://localhost:3000/api/regions', regionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      fetchRegions();
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khu vực này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/regions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Đã xóa một khu vực thành công.')
        fetchRegions();
      } catch (err) {
        console.error(err);
        setError(err.response ? err.response.data.message : err.message);
      }
    }
  };

  const openModal = () => {
    setRegionData({
      type: '',
      name: '',
      address: {
        province: '',
        district: '',
        commune: '',
        street: '',
      },
      area: '',
      description: '',
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (region) => {
    setRegionData(region);
    setSelectedRegion(region);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 style={{fontSize: '30px', fontWeight: 'bold'}}>Quản Lý Vùng Sản Xuất</h2>
        <button className="add-role" style={{marginTop: '-10px'}} onClick={openModal}>
          <FaPlus />
        </button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}

      <div className='roleheader'>
        <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
          <thead>
            <tr style={{ textAlign: 'center', fontSize: '18px' }} >
              <th style={{padding: '12px', width:'5%'}}>STT</th> 
              <th style={{padding: '12px', width:'10%'}}>Loại Đất</th>      
              <th style={{padding: '12px', width:'10%'}}>Tên Khu Vực</th>
              <th style={{padding: '12px', width:'15%'}}>Địa Chỉ</th>
              <th style={{padding: '12px'}}>Mô Tả</th>
              <th style={{padding: '12px', width:'10%'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {regions
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((region, index) => (
              <tr key={region._id}>
                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                <td style={{ padding: '15px'}}>{region.type}</td>
                <td style={{ padding: '15px'}}>{region.name}</td>
                <td style={{ padding: '15px'}}>
                  {region.address.street}, {region.address.commune},{' '}
                  {region.address.district}, {region.address.province}
                </td>
                <td style={{ padding: '15px'}}>{region.description}</td>
                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                  <button className="edit-button" onClick={() => openEditModal(region)}><FaEdit/></button>
                  <button className="delete-button"  onClick={() => handleDelete(region._id)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Vùng Sản Xuất' : 'Thêm Mới Vùng Sản Xuất'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Loại</Form.Label>
              <Form.Control
                type="text"
                value={regionData.type}
                onChange={(e) =>
                  setRegionData({ ...regionData, type: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên Khu Vực</Form.Label>
              <Form.Control
                type="text"
                value={regionData.name}
                onChange={(e) =>
                  setRegionData({ ...regionData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Địa Chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tỉnh/Thành phố"
                value={regionData.address.province}
                onChange={(e) =>
                  setRegionData({
                    ...regionData,
                    address: { ...regionData.address, province: e.target.value },
                  })
                }
                required
              />
              <Form.Control
                type="text"
                placeholder="Quận/Huyện"
                className="mt-2"
                value={regionData.address.district}
                onChange={(e) =>
                  setRegionData({
                    ...regionData,
                    address: { ...regionData.address, district: e.target.value },
                  })
                }
                required
              />
              <Form.Control
                type="text"
                placeholder="Xã/Phường"
                className="mt-2"
                value={regionData.address.commune}
                onChange={(e) =>
                  setRegionData({
                    ...regionData,
                    address: { ...regionData.address, commune: e.target.value },
                  })
                }
                required
              />
              <Form.Control
                type="text"
                placeholder="Đường"
                className="mt-2"
                value={regionData.address.street}
                onChange={(e) =>
                  setRegionData({
                    ...regionData,
                    address: { ...regionData.address, street: e.target.value },
                  })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Diện tích</Form.Label>
              <Form.Control
                type="text"
                value={regionData.area}
                onChange={(e) =>
                  setRegionData({ ...regionData, area: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={regionData.description}
                onChange={(e) =>
                  setRegionData({ ...regionData, description: e.target.value })
                }
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

export default Region;