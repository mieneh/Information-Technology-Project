import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    expiry: '',
    maxday: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    fetchCategories();
    return () => clearTimeout(timer);
  }, [error, success]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách danh mục.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!categoryData.name) {
      setError('Vui lòng nhập tên danh mục.');
      return;
    }
    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/api/categories/${selectedCategory._id}`, categoryData, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
      } else {
        await axios.post('http://localhost:3000/api/categories', categoryData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Đã xóa một loại sản phẩm thành công.')
        fetchCategories();
      } catch (err) {
        console.error(err);
        setError(err.response ? err.response.data.message : err.message);
      }
    }
  };

  const openModal = () => {
    setCategoryData({
      name: '',
      description: '',
      expiry: '',
      maxday: '',
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setCategoryData(category);
    setSelectedCategory(category);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 style={{fontSize: '30px', fontWeight: 'bold'}}>Quản Lý Phân Loại</h2>
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
                        <th style={{padding: '12px', width:'15%'}}>Tên Danh Mục</th>
                        <th style={{padding: '12px', width:'30%'}}>Mô Tả</th>
                        <th style={{padding: '12px',  width:'30%'}}>Điều Kiện Sử Dụng</th>
                        <th style={{padding: '12px', width:'10%'}}>Giới Hạn</th>
                        <th style={{padding: '12px', width:'10%'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((category, index) => (
                        <tr key={category._id}>
                            <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                            <td style={{textAlign: 'center', padding: '15px'}}>{category.name}</td>
                            <td style={{padding: '15px'}}>{category.description}</td>
                            <td style={{padding: '15px'}}>{category.expiry}</td>
                            <td style={{textAlign: 'center', padding: '15px'}}>{category.maxday} ngày</td>
                            <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                              <button className="edit-button" onClick={() => openEditModal(category)}><FaEdit/></button>
                              <button className="delete-button"  onClick={() => handleDelete(category._id)}><FaTrash/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Phân Loại' : 'Thêm Mới Phân Loại'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Tên Loại</Form.Label>
              <Form.Control
                type="text"
                value={categoryData.name}
                onChange={(e) =>
                  setCategoryData({ ...categoryData, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={categoryData.description}
                onChange={(e) =>
                  setCategoryData({
                    ...categoryData,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Điều Kiện Sử Dụng</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={categoryData.expiry}
                onChange={(e) =>
                  setCategoryData({
                    ...categoryData,
                    expiry: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số Ngày Giới Hạn</Form.Label>
              <Form.Control
                type="number"
                value={categoryData.maxday}
                onChange={(e) =>
                  setCategoryData({
                    ...categoryData,
                    maxday: e.target.value,
                  })
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

export default Category;