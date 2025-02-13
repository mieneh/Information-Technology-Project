import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Harvest = () => {
  const [harvests, setHarvests] = useState([]);
  const [products, setProducts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [harvestData, setHarvestData] = useState({
    batch: '',
    harvestDate: '',
    expirationDate: '',
    product: '',
    location: '',
    process: '',
    quantity: '',
    note: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedHarvest, setSelectedHarvest] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [maxday, setMaxday] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
    fetchHarvests();
    fetchProducts();
    fetchRegions();
    fetchProcesses();
    return () => clearTimeout(timer);
  }, [error, success]);

  const fetchHarvests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/harvests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHarvests(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách thu hoạch.');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      if (response.data.length > 0) {
        setMaxday((response.data)[0].category.maxday || 0);
      }
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách sản phẩm.');
    }
  };

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

  const fetchProcesses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/processes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProcesses(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách quy trình.');
    }
  };

  const slugify = (text) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const handleProductChange = (e) => {
    const selectedProduct = products.find(product => product._id === e.target.value);
    if (selectedProduct) {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}${currentDate.getMonth() + 1}${currentDate.getFullYear()}`;
      const batch = `${slugify(selectedProduct.name)}-${formattedDate}`;
      setMaxday(selectedProduct.category.maxday || 0);
      setHarvestData(prevState => ({
        ...prevState,
        product: e.target.value,
        batch: batch,
      }));
    }
  };

  const handleExpirationDate = (e) => {
    const harvestDate = e.target.value;
    if (maxday && harvestDate) {
      const calculatedExpirationDate = new Date(harvestDate);
      calculatedExpirationDate.setDate(calculatedExpirationDate.getDate() + maxday);
  
      setHarvestData(prevState => ({
        ...prevState,
        harvestDate: harvestDate,
        expirationDate: calculatedExpirationDate.toISOString().split('T')[0],
      }));
    } else {
      setHarvestData(prevState => ({
        ...prevState,
        harvestDate: harvestDate,
        expirationDate: '',
      }));
    }
  };  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!harvestData.harvestDate || !harvestData.product || !harvestData.location || !harvestData.process || !harvestData.quantity) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/api/harvests/${selectedHarvest._id}`, harvestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:3000/api/harvests', harvestData, {
          headers: { Authorization: `Bearer ${token}` },
        });        
      }
      setModalOpen(false);
      setSuccess('Lưu thông tin thành công!');
      fetchHarvests();
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data.message : 'Có lỗi xảy ra.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông tin thu hoạch này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/harvests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess('Đã xóa một lô hàng thành công.')
        fetchHarvests();
      } catch (err) {
        console.error(err);
        setError(err.response ? err.response.data.message : err.message);
      }
    }
  };

  const openModal = () => {
    setHarvestData({
      batch: '',
      harvestDate: '',
      expirationDate: '',
      product: '',
      location: '',
      process: '',
      quantity: '',
      note: '',
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (harvest) => {
    setHarvestData({
      batch: harvest.batch,
      harvestDate: harvest.harvestDate.split('T')[0],
      expirationDate: harvest.expirationDate.split('T')[0],
      product: harvest.product?._id || '',
      location: harvest.location?._id || '',
      process: harvest.process?._id || '',
      quantity: harvest.quantity,
      note: harvest.note || '',
    });
    setSelectedHarvest(harvest);
    setIsEdit(true);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 style={{fontSize: '30px', fontWeight: 'bold'}}>Quản Lý Lô Hàng</h2>
        <button className="add-role" style={{marginTop: '-10px'}} onClick={openModal}>
          <FaPlus />
        </button>
      </div>
      
      {success && <Alert variant="success">{success}</Alert>}
      
      <div className='roleheader'>
        <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
          <thead>
            <tr style={{textAlign: 'center', fontSize: '18px'}} >
              <th style={{padding: '12px', width:'2.5%'}}>STT</th>              
              <th style={{padding: '12px', width:'12%'}}>Lô</th>
              <th style={{padding: '12px', width:'10%'}}>Sản Phẩm</th>
              <th style={{padding: '12px', width:'10.25%'}}>Ngày Sản Xuất</th>
              <th style={{padding: '12px', width:'10.25%'}}>Ngày Hết Hạn</th>
              <th style={{padding: '12px', width:'13.5%'}}>Khu Vực</th>
              <th style={{padding: '12px', width:'13.5%'}}>Quy Trình</th>
              <th style={{padding: '12px', width:'8%'}}>Số Lượng</th>
              <th style={{padding: '12px', width:'10%'}}>Ghi Chú</th>
              <th style={{padding: '12px', width:'10%'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {harvests
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((harvest, index) => (
              <tr key={harvest._id}>
                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>
                  <p>{harvest.batch}</p>
                  {harvest.qrCode && <img src={harvest.qrCode} alt={harvest.qrCode} style={{ width: '150px', height: '150px' }} />}
                </td>                
                <td style={{textAlign: 'center', padding: '15px'}}>
                  <p>{harvest.product?.name}</p>
                  {harvest.product?.image && <img src={harvest.product?.image} alt={harvest.product?.image} style={{ width: '150px', height: '150px' }} />}
                </td> 
                <td style={{textAlign: 'center', padding: '15px'}}>{new Date(harvest.harvestDate).toLocaleDateString()}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{new Date(harvest.expirationDate).toLocaleDateString()}</td>
                <td style={{padding: '15px'}}>{harvest.location?.name || 'Không rõ'}</td>
                <td style={{padding: '15px'}}>{harvest.process?.name || 'Không rõ'}</td>
                <td style={{textAlign: 'center', padding: '15px'}}>{harvest.quantity} kg</td>
                <td style={{padding: '15px'}}>{harvest.note}</td>
                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                  <button className="edit-button" onClick={() => openEditModal(harvest)}><FaEdit/></button>
                  <button className="delete-button"  onClick={() => handleDelete(harvest._id)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa Lô Hàng' : 'Thêm Mới Lô Hàng'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Lô</Form.Label>
              <Form.Control
                type="text"
                value={harvestData.batch}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sản Phẩm</Form.Label>
              <Form.Select
                value={harvestData.product}
                onChange={handleProductChange}
                required
              >
                <option value="">Chọn sản phẩm</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Khu Vực</Form.Label>
              <Form.Select
                value={harvestData.location}
                onChange={(e) =>
                  setHarvestData({ ...harvestData, location: e.target.value })
                }
                required
              >
                <option value="">Chọn khu vực</option>
                {regions.map((region) => (
                  <option key={region._id} value={region._id}>
                    {region.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quy Trình</Form.Label>
              <Form.Select
                value={harvestData.process}
                onChange={(e) =>
                  setHarvestData({ ...harvestData, process: e.target.value })
                }
                required
              >
                <option value="">Chọn quy trình</option>
                {processes.map((process) => (
                  <option key={process._id} value={process._id}>
                    {process.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày Sản Xuất</Form.Label>
              <Form.Control
                type="date"
                value={harvestData.harvestDate}
                onChange={handleExpirationDate}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày Hết Hạn</Form.Label>
              <Form.Control
                type="date"
                value={harvestData.expirationDate}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Số Lượng</Form.Label>
              <Form.Control
                type="number"
                value={harvestData.quantity}
                onChange={(e) =>
                  setHarvestData({ ...harvestData, quantity: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ghi Chú</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={harvestData.note}
                onChange={(e) =>
                  setHarvestData({ ...harvestData, note: e.target.value })
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

export default Harvest;