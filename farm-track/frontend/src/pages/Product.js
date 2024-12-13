import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwipeToRevealActions from "react-swipe-to-reveal-actions";
import { FaPlus, FaSave, FaEdit, FaSyncAlt, FaTrash, FaRedoAlt, FaTimes, FaCheck} from 'react-icons/fa';
import '../components/product.css';

const AddProduct = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Rau',
    description: '',
    image: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('description', formData.description);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    onSave(formDataToSend);
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Thêm Sản Phẩm Mới</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="name" className="lable">Tên sản phẩm</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />

          <label htmlFor="type" className="lable">Loại sản phẩm</label>
          <select
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="Rau">Rau</option>
            <option value="Củ">Củ</option>
            <option value="Quả">Quả</option>
            <option value="Hạt">Hạt</option>
            <option value="Trái cây">Trái cây</option>
          </select>

          <label htmlFor="description" className="lable">Mô tả</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea"
            required
          />

          <label htmlFor="image" className="lable">Hình ảnh</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="input-field"
          />
          
          {formData.image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Product Preview"
                className="image-thumbnail"
              />
              
            </div>
          )}

          <div className="button-container">
            <button type="submit" className="save-button"><FaSave /></button>
            <button type="reset" className="reset-button" onClick={() =>  setFormData({ name: '', type: 'Rau', description: '', image: null }) }><FaRedoAlt /> </button>
            <button type="button" onClick={onClose} className="close-button"><FaTimes /></button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

const EditProduct = ({ isOpen, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    type: product?.type || 'Rau',
    description: product?.description || '',
    image: null,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        type: product.type,
        description: product.description,
        image: null,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('description', formData.description);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    onSave(formDataToSend);
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>Sửa Sản Phẩm</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label htmlFor="name" className="label">Tên sản phẩm</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />

          <label htmlFor="type" className="label">Loại sản phẩm</label>
          <select
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="Rau">Rau</option>
            <option value="Củ">Củ</option>
            <option value="Quả">Quả</option>
            <option value="Hạt">Hạt</option>
            <option value="Trái cây">Trái cây</option>
          </select>

          <label htmlFor="description" className="label">Mô tả</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleChange}
            className="textarea"
            required
          />

          <label htmlFor="image" className="label">Hình ảnh</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="input-field"
          />

          {formData.image ? (
            <div className="image-preview">
              <p>Ảnh mới chọn</p>
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Product Preview"
                className="image-thumbnail"
              />
              
            </div>
          ) : product?.image ? (
            <div className="image-preview">
              <p>Ảnh hiện tại</p>
              <img
                src={product.image}
                alt="Current Product"
                className="image-thumbnail"
              />
              
            </div>
          ) : null}

          <div className="button-container">
            <button type="submit" className="save-button"><FaSyncAlt /></button>
            <button type="reset" className="reset-button" onClick={() => setFormData({ name: product?.name || '', type: 'Rau', description: product?.description || '', image: null })}><FaRedoAlt /> </button>
            <button type="button" onClick={onClose} className="close-button"><FaTimes /></button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

const DeleteProduct = ({ isOpen, onClose, onDelete, product }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${product._id}`);
      onDelete(product._id);
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
        <h2>Xóa sản phẩm</h2>
        <p>Bạn có chắc chắn muốn xóa {product.name} không?</p>
        <div className="button-container">
          <button type="button" onClick={handleDelete} className="save-button"><FaCheck /></button>
          <button type="button" onClick={onClose} className="close-button"><FaTimes /></button>
        </div>
      </div>
    </div>
  ) : null;
};

const ProductModal = ({ isOpen, product, onClose }) => {
    const [selectedHarvest, setSelectedHarvest] = useState(null);
    const handleHarvestClick = (harvest) => {
        setSelectedHarvest(harvest === selectedHarvest ? null : harvest);
    };
      
    if (!product) return null;
  
    return isOpen ? (
      <div className="modal">
        <div className="modal-content content-product">
        <div className="modal-header">
        <h2>{product.name}</h2>
        <button type="button" onClick={onClose} className="close-button-product">
          <FaTimes />
        </button>
      </div>
          <div className="product-container">
            <div>
                <p><strong>Loại:</strong> {product.type}</p>
                <p><strong>Mô tả:</strong> {product.description}</p>
                <p><strong>Ngày tạo:</strong> {new Date(product.created).toLocaleDateString()}</p>
            </div>
            <img src={product.image} alt={product.name} className="product-image" />
        </div>
          <h4>Các đợt thu hoạch:</h4>
              {product.harvests.length > 0 ? (
                <ul className="harvest-list">
                  {product.harvests.map((harvest) => (
                    <li
                      key={harvest._id}
                      className="harvest-item"
                      onClick={() => handleHarvestClick(harvest)}
                    >
                      <p><strong>Lô hàng:</strong> {harvest.batch}</p>
                      <p><strong>Ngày thu hoạch:</strong> {new Date(harvest.harvestDate).toLocaleDateString()}</p>
                      <p><strong>Ngày hết hạn:</strong> {new Date(harvest.expirationDate).toLocaleDateString()}</p>
                      <p><strong>Số lượng:</strong> {harvest.quantity}</p>
                      <p><strong>Chứng nhận:</strong> {harvest.certification}</p>

                      {selectedHarvest === harvest && (
                        <div className="harvest-detail">
                          <p><strong>Thông tin theo dõi:</strong></p>
                          {harvest.tracking.length > 0 ? (
                            <div className="tracking-container">
                              {harvest.tracking.map((track) => (
                                <div key={track._id} className="tracking-item">
                                  <p><strong>Vị trí:</strong> {JSON.parse(track.location).lat}, {JSON.parse(track.location).lng}</p>
                                  <p><strong>Nhiệt độ:</strong> {track.temperature.$numberDecimal} °C</p>
                                  <p><strong>Độ ẩm:</strong> {track.humidity.$numberDecimal} %</p>
                                  <p><strong>Trạng thái:</strong> {track.status}</p>
                                  <p><strong>Cập nhật:</strong> {new Date(track.updated).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>Không có thông tin theo dõi nào cho đợt thu hoạch này.</p>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Chưa có đợt thu hoạch nào.</p>
              )}
        </div>
      </div>
    ) : null;
};
  
const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const [addModalOpen, setAddModalOpen] = useState(false);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [selectedProductModalOpen, setSelectedProductModalOpen] = useState(false);
    const [productDetails, setProductDetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            if (error.response && error.response.data) {
            alert(error.response.data.message);
            } else {
            alert('Có lỗi xảy ra khi thêm sản phẩm!');
            }
            setLoading(false);
        }
        };

        fetchData();
    }, []);

        const handleProductClick = (product) => {
            setProductDetails(product);
            setSelectedProductModalOpen(true);
        };

    const handleAdd = () => {
        setAddModalOpen(true);
    };

    const handleSaveAdd = async (newProduct) => {
        try {
        const response = await axios.post('http://localhost:3000/api/products', newProduct);
        setProducts([...products, response.data]);
        setAddModalOpen(false);
        alert('Sản phẩm đã được thêm!');      
        window.location.reload();
        } catch (error) {
        if (error.response && error.response.data) {
            alert(error.response.data.message);
        } else {
            alert('Có lỗi xảy ra khi thêm sản phẩm!');
        }
        }
    };  

    const handleEdit = (product) => {
        setProductToEdit(product);
        setEditModalOpen(true);
    };

    const handleSaveEdit = async (updatedProduct) => {
        const isNoChange = updatedProduct.name === productToEdit.name && updatedProduct.type === productToEdit.type && updatedProduct.description === productToEdit.description;
        if (isNoChange) {
        alert('Không có thay đổi nào để lưu!');
        return;
        }
        const isNameDuplicate = products.some(product => product.name === updatedProduct.name && product._id !== updatedProduct._id);
        if (isNameDuplicate) {
        alert('Tên sản phẩm đã tồn tại!');
        return;
        }
    
        try {
        await axios.put(`http://localhost:3000/api/products/${updatedProduct._id}`, updatedProduct);
        setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
        setEditModalOpen(false);
        alert('Sản phẩm đã được cập nhật!');
        window.location.reload();
        } catch (error) {
        if (error.response && error.response.data) {
            alert(error.response.data.message);
        } else {
            alert('Có lỗi xảy ra khi thêm sản phẩm!');
        }
        }
    };

    const handleDelete = (product) => {
        setProductToDelete(product);
        setDeleteModalOpen(true);
    };

    if (loading) return <p>Loading...</p>;

    return (
    <div>
      <header className="header">
        <div className="header-logo">
          <img src='img/logo.png' alt="Logo" />
        </div>
      </header>
      <nav className="navbar-tmp">
        <div className="navbar-tmp-section">
            <div className="navbar-logo">
                <h1>Farm Track</h1>
            </div>
            <div className="navbar-links">
              <a href="/product">Nông sản</a>
              <a href="/harvest">Mùa thu hoạch</a>
              <a href="#contact">Liên hệ</a>
            </div>
            <div className="navbar-search">
                <input type="search" placeholder="Search..." />
            </div>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        <div className="header-container">
          <h2 className="header-title">Quản lý nông sản</h2>
          <button onClick={handleAdd} className="add-button">
            <FaPlus />
          </button>
        </div>
        {products.length === 0 ? (
          <p>Không có sản phẩm nào!</p>
        ) : (
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                  <img src={product.image} alt={product.name} onClick={() => handleProductClick(product)}/>
                  <SwipeToRevealActions
                  actionButtons={[
                      {
                        content: <FaEdit className="edit-button" />,
                        onClick: () => handleEdit(product),
                      },
                      {
                        content: <FaTrash className="delete-button" />,
                        onClick: () => handleDelete(product),
                      },
                  ]}
                  actionButtonMinWidth={90}
                  >
                  <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-type">{product.type || "Chưa có loại cây trồng"}</p>
                  </div>
                  </SwipeToRevealActions>
              </div>
            ))}
          </div>
        )}
      </div>

    <AddProduct
      isOpen={addModalOpen}
      onClose={() => setAddModalOpen(false)}
      onSave={handleSaveAdd}
    />

    {productToEdit && (
      <EditProduct
        isOpen={editModalOpen}
        product={productToEdit}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    )}

    <DeleteProduct
      isOpen={deleteModalOpen}
      product={productToDelete}
      onClose={() => setDeleteModalOpen(false)}
      onDelete={handleDelete}
    />

    <ProductModal
      isOpen={selectedProductModalOpen}
      product={productDetails}
      onClose={() => setSelectedProductModalOpen(false)}
    />

  </div>
  );
};

export default Product;