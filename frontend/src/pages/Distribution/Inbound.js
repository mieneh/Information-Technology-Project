import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, Alert } from 'react-bootstrap';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';

const Inbound = () => {
  const [inbounds, setInbounds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedInbound, setSelectedInbound] = useState(null);
  const [inboundData, setInboundData] = useState({
    batchID: '',
    entryDate: '',
    storageCondition: '',
  });
  const [batches, setBatches] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    fetchInbounds();
    fetchBatches();
    return () => clearTimeout(timer);
  }, [error, success]);

  const fetchInbounds = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/inbounds', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInbounds(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách nhập kho.');
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/harvests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBatches(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách lô hàng.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!inboundData.batchID || !inboundData.entryDate || !inboundData.storageCondition) {
      setError('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/api/inbounds/${selectedInbound._id}`, inboundData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:3000/api/inbounds', inboundData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      fetchInbounds();
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục nhập này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/inbounds/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Đã xóa mục nhập thành công.');
        fetchInbounds();
      } catch (err) {
        console.error(err);
        setError(err.response ? err.response.data.message : err.message);
      }
    }
  };

  const openModal = () => {
    setInboundData({
      batchID: '',
      entryDate: '',
      storageCondition: '',
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (inbound) => {
    setInboundData(inbound);
    setSelectedInbound(inbound);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2>Quản Lý Nhập Kho</h2>
        <button className="add-role" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
      </div>

      {success && <Alert variant="success">{success}</Alert>}

      <div className='roleheader'>
        <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
          <thead>
            <tr style={{ textAlign: 'center', fontSize: '18px', height: '50px' }} >
              <th style={{ width:'5%'}}>STT</th>
              <th style={{ width:'20%'}}>Lô Hàng</th>
              <th style={{ width:'10%'}}>Ngày Nhập</th>
              <th>Điều Kiện Bảo Quản</th>
              <th style={{ width:'10%'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inbounds
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((inbound, index) => (
              <tr key={inbound._id}>
                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{inbound.batchID?.batch || 'N/A'}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{new Date(inbound.entryDate).toLocaleDateString()}</td>
                <td style={{padding: '15px'}}>{inbound.storageCondition}</td>
                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                  <button className="edit-button" onClick={() => openEditModal(inbound)}><FaEdit/></button>
                  <button className="delete-button"  onClick={() => handleDelete(inbound._id)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Kho' : 'Nhập Kho'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Lô Hàng</Form.Label>
              <Form.Select
                value={inboundData.batchID}
                onChange={(e) => setInboundData({ ...inboundData, batchID: e.target.value })}
                required
              >
                <option value="">Chọn Lô Hàng</option>
                  {batches.map((harvest) => (
                    <option key={harvest._id} value={harvest._id}>
                      {harvest.batch}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày Nhập</Form.Label>
              <Form.Control
                type="date"
                value={inboundData.entryDate}
                onChange={(e) => setInboundData({ ...inboundData, entryDate: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Điều Kiện Bảo Quản</Form.Label>
              <Form.Control
                type="text"
                value={inboundData.storageCondition}
                onChange={(e) =>
                  setInboundData({ ...inboundData, storageCondition: e.target.value })
                }
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

export default Inbound;