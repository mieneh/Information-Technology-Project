//frontend/src/pages/Harvest.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwipeToRevealActions from 'react-swipe-to-reveal-actions';
import { FaPlus, FaCheck, FaSave, FaRedoAlt, FaEdit, FaTrash, FaTimes, FaMapMarkerAlt, FaThermometerHalf, FaTint, FaCheckCircle, FaClock, FaCalendarAlt, FaRegClock, FaHashtag } from 'react-icons/fa';
import '../components/product.css';
import Header from "../components/Header";

const AddHarvest = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    productID: '',
    batch: '',
    harvestDate: '',
    expirationDate: '',
    quantity: '',
    certification: '',
  });

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setProducts(response.data);
      } catch (error) {
        alert('Error fetching products!');
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));

    if (e.target.id === 'productID') {
      const selectedProduct = products.find(product => product._id === e.target.value);
      if (selectedProduct) {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        const batch = `${selectedProduct.name}_${formattedDate}`;
        setFormData(prev => ({
          ...prev,
          batch: batch
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => value === null || value === undefined || value === '')) {
      alert('Vui lòng điền vào tất cả các trường!');
      return;
    }
    onSave(formData);
  };  

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Mùa thu hoạch mới</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="productID" className="label">Sản phẩm</label>
          <select
            id="productID"
            value={formData.productID}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Chọn sản phẩm</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>

          <label htmlFor="batch" className="label">Lô sản phẩm</label>
          <input
            type="text"
            id="batch"
            value={formData.batch}
            onChange={handleChange}
            className="input-field"
            required
            readOnly
          />

          <label htmlFor="harvestDate" className="label">Ngày thu hoạch</label>
          <input
            type="date"
            id="harvestDate"
            value={formData.harvestDate}
            onChange={handleChange}
            className="input-field"
            required
          />

          <label htmlFor="expirationDate" className="label">Ngày hết hạn</label>
          <input
            type="date"
            id="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className="input-field"
          />

          <label htmlFor="quantity" className="label">Số lượng</label>
          <input
            type="text"
            id="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="input-field"
          />

          <label htmlFor="certification" className="label">Chứng nhận</label>
          <input
            type="text"
            id="certification"
            value={formData.certification}
            onChange={handleChange}
            className="input-field"
          />

          <div className="button-container">
            <button type="submit" className="save-button"><FaSave /></button>
            <button type="reset" className="reset-button" onClick={() => setFormData({ productID: '', batch: '', harvestDate: '', expirationDate: '', quantity: '', certification: '', })} > <FaRedoAlt /> </button>
            <button type="button" onClick={onClose} className="close-button"><FaTimes /></button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

const EditHarvest = ({ isOpen, onClose, onSave, harvest }) => {
  const [formData, setFormData] = useState({
    harvestDate: '',
    expirationDate: '',
    quantity: '',
    certification: '',
  });

  useEffect(() => {
    if (harvest) {
      setFormData({
        harvestDate: harvest.harvestDate.slice(0, 10),
        expirationDate: harvest.expirationDate.slice(0, 10),
        quantity: harvest.quantity,
        certification: harvest.certification,
      });
    }
  }, [harvest]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).some((value) => value === null || value === undefined || value === '')) {
      alert('Vui lòng điền vào tất cả các trường!');
      return;
    }
    onSave(formData);
  };  

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Chỉnh sửa đợt thu hoạch</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="harvestDate" className="label">Ngày thu hoạch</label>
          <input
            type="date"
            id="harvestDate"
            value={formData.harvestDate}
            onChange={handleChange}
            className="input-field"
            required
          />

          <label htmlFor="expirationDate" className="label">Ngày hết hạn</label>
          <input
            type="date"
            id="expirationDate"
            value={formData.expirationDate}
            onChange={handleChange}
            className="input-field"
          />

          <label htmlFor="quantity" className="label">Số lượng</label>
          <input
            type="text"
            id="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="input-field"
          />

          <label htmlFor="certification" className="label">Chứng nhận</label>
          <input
            type="text"
            id="certification"
            value={formData.certification}
            onChange={handleChange}
            className="input-field"
          />

          <div className="button-container">
            <button type="submit" className="save-button"><FaSave /></button>
            <button type="reset" className="reset-button" onClick={() => setFormData({ harvestDate: harvest?.harvestDate ? harvest.harvestDate.slice(0, 10) : '', expirationDate: harvest?.expirationDate ? harvest.expirationDate.slice(0, 10) : '', quantity: harvest?.quantity || '', certification: harvest?.certification || '', })}><FaRedoAlt /></button>
            <button type="button" onClick={onClose} className="close-button"><FaTimes /></button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

const DeleteHarvest = ({ isOpen, onClose, onDelete, harvest }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/harvests/${harvest._id}`);
      onDelete(harvest._id);
      onClose();
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert('Có lỗi xảy ra khi thêm sản phẩm!');
      }
    }
  };

  return isOpen ? (
    <div className="modal modal-delete">
      <div className="modal-content content-delete">
        <h2>Xóa mùa thu hoạch</h2>
        <p>Bạn có chắc chắn muốn xóa {harvest.batch} không?</p>
        <div className="button-container">
          <button type="button" onClick={handleDelete} className="save-button"><FaCheck /></button>
          <button type="button" onClick={onClose} className="close-button"><FaTimes /></button>
        </div>
      </div>
    </div>
  ) : null;
};

const Harvest = () => {
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedHarvest, setSelectedHarvest] = useState(null);
  
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [harvestToEdit, setHarvestToEdit] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [harvestToDelete, setHarvestToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/harvests');
        setHarvests(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          alert('Có lỗi xảy ra khi tải dữ liệu thu hoạch!');
        }
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleHarvestClick = (harvest) => {
    setSelectedHarvest(harvest === selectedHarvest ? null : harvest);
  };

  const handleAdd = () => {
    setAddModalOpen(true);
  };

  const handleSaveAdd = async (newHarvest) => {
    try {
      const response = await axios.post('http://localhost:3000/api/harvests', newHarvest);
      setHarvests([...harvests, response.data]);
      setAddModalOpen(false);
      alert('Đợt thu hoạch đã được thêm!');
      window.location.reload();
    } catch (error) {
      alert('Có lỗi xảy ra khi thêm thu hoạch!');
    }
  };

  const handleEdit = (harvest) => {
    setHarvestToEdit(harvest);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedHarvest) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/harvests/${harvestToEdit._id}`, updatedHarvest, { headers: { "Content-Type": "multipart/form-data" }, } );
      setHarvests((prev) => prev.map((h) => (h._id === harvestToEdit._id ? response.data : h )) );
      setEditModalOpen(false);
      alert('Thu hoạch đã được cập nhật!');
      window.location.reload();
    } catch (error) {
      alert('Có lỗi xảy ra khi cập nhật thu hoạch!');
    }
  };

  const handleDelete = (harvest) => {
    setHarvestToDelete(harvest);
    setDeleteModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <div className="header-container">
          <h2 className="header-title">Quản lý thu hoạch</h2>
          <button onClick={handleAdd} className="add-button">
            <FaPlus />
          </button>
        </div>
        {harvests.length === 0 ? (
          <p>Không có thu hoạch nào!</p>
        ) : (
          harvests.map((harvest) => (
            <div key={harvest._id} className="harvest-card">
              <SwipeToRevealActions
                actionButtons={[
                  {
                    content: <FaEdit className="edit-button" />,
                    onClick: () => handleEdit(harvest),
                  },
                  {
                    content: <FaTrash className="delete-button" />,
                    onClick: () => handleDelete(harvest),
                  },
                ]}
                actionButtonMinWidth={100}
                style={{ backgroundColor: 'white' }}
              >
                <div className="harvest-info" onClick={() => handleHarvestClick(harvest)}>
                  <h3>{harvest.batch}</h3>
                  <p>{harvest.product.type}</p>
                </div>
              </SwipeToRevealActions>
              {selectedHarvest === harvest && (
                <div className="harvest-details">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div> 
                      <p><FaCalendarAlt style={{ color: '#FF6347' }}/> <strong>Ngày thu hoạch:</strong> {new Date(harvest.harvestDate).toLocaleDateString()}</p>
                      <p><FaRegClock style={{ color: '#4682B4' }}/> <strong>Ngày hết hạn:</strong> {new Date(harvest.expirationDate).toLocaleDateString()}</p>
                      <p><FaHashtag style={{ color: '#32CD32' }}/> <strong>Số lượng:</strong> {harvest.quantity}</p>
                      <p><FaCheckCircle style={{ color: '#FFD700' }}/> <strong>Chứng nhận:</strong> {harvest.certification}</p>
                      <p><FaMapMarkerAlt style={{ color: '#8A2BE2' }}/> <strong>Thông tin theo dõi:</strong></p>
                    </div>
                    {harvest.qrCode && (
                      <div>
                        <img src={harvest.qrCode} alt="QR Code" style={{ maxWidth: '200px', height: 'auto' }} />
                      </div>
                    )}
                  </div>
                  {harvest.tracking.length > 0 ? (
                    <div className="tracking-container">
                      {harvest.tracking.map((track) => (
                        <div key={track._id} className="tracking-item">
                          <p><FaMapMarkerAlt style={{ color: '#1E90FF' }} /> <strong>Vị trí:</strong> {JSON.parse(track.location).lat}, {JSON.parse(track.location).lng}</p>
                          <p><FaThermometerHalf style={{ color: '#FF6347' }} /> <strong>Nhiệt độ:</strong> {track.temperature.$numberDecimal} °C</p>
                          <p><FaTint style={{ color: '#32CD32' }} /> <strong>Độ ẩm:</strong> {track.humidity.$numberDecimal} %</p>
                          <p><FaCheckCircle style={{ color: '#228B22' }} /> <strong>Trạng thái:</strong> {track.status}</p>
                          <p><FaClock style={{ color: '#FFD700' }} /> <strong>Cập nhật:</strong> {new Date(track.updated).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                  <p>Không có thông tin theo dõi nào cho đợt thu hoạch này.</p>
                )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <AddHarvest 
        isOpen={addModalOpen} 
        onClose={() => setAddModalOpen(false)} 
        onSave={handleSaveAdd}
      />
      {harvestToEdit && (
        <EditHarvest
          isOpen={editModalOpen}
          harvest={harvestToEdit}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
      <DeleteHarvest
        isOpen={deleteModalOpen}
        harvest={harvestToDelete}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Harvest;