import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    category: '',
    name: '',
    description: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    fetchProducts();
    fetchCategories();
    return () => clearTimeout(timer);
  }, [error, success]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách sản phẩm.');
    }
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductData({ ...productData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!productData.name || !productData.category) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    const formData = new FormData();
    formData.append('category', productData.category);
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    if (productData.image) {
      formData.append('image', productData.image);
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/api/products/${selectedProduct._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
        );
      } else {
        await axios.post('http://localhost:3000/api/products', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      setPreviewImage(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Đã xóa một sản phẩm thành công.')
        fetchProducts();
      } catch (err) {
        console.error(err);
        setError(err.response ? err.response.data.message : err.message);
      }
    }
  };
  
  const openModal = () => {
    setProductData({
      category: '',
      name: '',
      description: '',
      image: null,
    });
    setPreviewImage(null);
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setProductData({
      category: product.category?._id || '',
      name: product.name,
      description: product.description,
      image: null,
    });
    setPreviewImage(product.image);
    setSelectedProduct(product);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 style={{fontSize: '30px', fontWeight: 'bold'}}>Quản Lý Sản Phẩm</h2>
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
              <th style={{padding: '12px', width:'10%'}}>Loại</th>      
              <th style={{padding: '12px', width:'20%'}}>Sản Phẩm</th>
              <th style={{padding: '12px'}}>Mô Tả</th>
              <th style={{padding: '12px', width:'10%'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((product, index) => (
              <tr key={product._id}>
                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                <td style={{ padding: '15px'}}>{product.category?.name || 'Không rõ'}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>
                  <p>{product.name}</p>
                  {product.image && <img src={product.image} alt={product.name} style={{ width: '150px', height: '150px' }} />}
                </td>
                <td style={{ padding: '15px'}}>{product.description}</td>
                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                  <button className="edit-button" onClick={() => openEditModal(product)}><FaEdit/></button>
                  <button className="delete-button"  onClick={() => handleDelete(product._id)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Loại</Form.Label>
              <Form.Select
                value={productData.category}
                onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                required
              >
                <option value="">Chọn loại</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tên Sản Phẩm</Form.Label>
              <Form.Control
                type="text"
                value={productData.name}
                onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mô Tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={productData.description}
                onChange={(e) => setProductData({...productData, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ảnh</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/*"
              />
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Xem trước"
                    style={{ width: '100px', height: '100px' }}
                  />
                </div>
              )}
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

export default Product;