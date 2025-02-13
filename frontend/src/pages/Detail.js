import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaUserCircle, FaWarehouse, FaCalendarAlt, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import Header from '../components/Header';
import '../components/index.css';

import TemperatureHumidityChart from './ChartTemperatureHumidityLight';
import TemperatureMapChart from './ChartMap';

function getIconByStep(stepIndex) {
  switch (stepIndex) {
    case 1:
      return '🧑‍🌾';
    case 2:
      return ' 🌱';
    case 3:
      return '💧';
    case 4:
      return '🐛';
    case 5:
      return '🧺';
    case 6:
      return '📦';
    default:
      return null;
  }
}

const Detail = () => {
    const { id } = useParams();
    const [harvest, setHarvest] = useState(null);
    const [sensor, setSensor] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('detail');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchHarvestDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/harvests/${id}`);
                setHarvest(response.data);
            } catch (err) {
                setError('Lỗi khi lấy chi tiết thu hoạch');
            } finally {
                setLoading(false);
            }
        };

        const fetchSensors = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/sensor/${id}`);
                setSensor(response.data);
            } catch (err) {
                setError('Lỗi khi lấy chi tiết thu hoạch');
            } finally {
                setLoading(false);
            }
        };

        fetchHarvestDetails();
        fetchSensors();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Header />
            <div className="detail-container">
                <h1 className="title-detail">Thông Tin Sản Phẩm</h1>
                <div className="info-container">
                    <div className="image-section">
                        <img src={harvest.product?.image} alt="Product" className="product-image" />
                    </div>
                    <div className="details-section">
                        <h1><strong>Sản phẩm:</strong> {harvest.product?.name}</h1>
                        <p><strong><FaWarehouse className="icon-detail" style={{color: '#e4cf15'}}/> Lô hàng:</strong> {harvest.batch}</p>
                        <p><strong><FaCalendarAlt className="icon-detail" style={{color: '#2196F3'}}/> Ngày thu hoạch:</strong> {new Date(harvest.harvestDate).toLocaleDateString()}</p>
                        <p><strong><FaCalendarAlt className="icon-detail" style={{color: '#2196F3'}}/> Ngày hết hạn:</strong> {new Date(harvest.expirationDate).toLocaleDateString()}</p>
                        <p><strong><FaExclamationCircle className="icon-detail" style={{color: '#FF5722'}}/> Số lượng:</strong> {harvest.quantity} kg</p>
                        <p><strong><FaCheckCircle className="icon-detail" style={{color: '#8BC34A'}}/> Chứng nhận:</strong> {harvest.certification}</p>
                    </div>
                </div>

                <div className="tabs-container">
                    <span
                        className={`tab ${activeTab === 'detail' ? 'active-tab' : ''}`}
                        onClick={() => handleTabClick('detail')}
                    >
                        Mô tả sản phẩm
                    </span>
                    <span
                        className={`tab ${activeTab === 'about' ? 'active-tab' : ''}`}
                        onClick={() => handleTabClick('about')}
                    >
                        Doanh nghiệp
                    </span>
                    <span
                        className={`tab ${activeTab === 'tracking' ? 'active-tab' : ''}`}
                        onClick={() => handleTabClick('tracking')}
                    >
                        Quy trình vận hành
                    </span>
                </div>

                    {activeTab === 'detail' && (
                        <div className="tab-content">
                            <div className="detail">
                                {harvest.product.description.split('.').map((sentence, index) => {
                                    if (!sentence.trim()) return null;
                                        return (
                                        <span key={index} style={{ display: 'block', marginBottom: '5px' }}>
                                            {sentence.includes(':') ? (
                                                <><strong>{sentence.split(':')[0]}:</strong>{sentence.split(':')[1]}</>
                                            ) : (
                                                sentence
                                            )}
                                        </span>
                                    );
                                })}
                                <br/><span style={{display: 'block', marginTop: '-20px', marginBottom: '-20px'}}><strong>Sản phẩm thuộc loại:</strong> {harvest.product.category.name}</span>
                                <br/><span style={{display: 'block'}}><strong>Điều kiện bảo quản:</strong> {harvest.product.category.expiry}</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div>
                            <div className="modal-detail">
                                <div className="modal-detail-header">
                                    <h5>Thông tin Nông trại</h5>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {harvest.userID?.image ? (
                                        <img src={harvest.userID?.image} alt={harvest.userID?.fullname} style={{ width: 'auto', height: '220px', borderRadius: '8px', objectFit: 'cover', marginLeft: '25px', marginTop: '15px', marginBottom: '33px'}}/>
                                    ):(
                                        <FaUserCircle size={40} style={{ width: 'auto', height: '220px', borderRadius: '8px', objectFit: 'cover', marginLeft: '25px', marginTop: '15px', marginBottom: '33px', color: '#4caf50' }} />
                                    )}
                                    <div className="detail-info">
                                        <p><strong>Người đại diện:</strong> {harvest.userID?.fullname || "Chưa có thông tin"}</p>
                                        <p><strong>Tên nông trại:</strong> {harvest.userID?.farmName || "Chưa có thông tin"}</p>
                                        <p><strong>Địa chỉ:</strong> {harvest.userID?.farmLocation || "Chưa có thông tin"}</p>
                                        <p><strong>Mã số thuế:</strong> {harvest.userID?.registrationNumber || "Chưa có thông tin"}</p>
                                        <p><strong>Liên hệ:</strong> {harvest.userID?.contactPhone || "Chưa có thông tin"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-detail">
                                <div className="modal-detail-header">
                                    <h5>Thông Tin Vùng Sản xuất</h5>
                                </div>
                                <div className="detail-info">
                                    <p><strong>Khu vực: </strong> {harvest.location?.name || "Chưa có thông tin"} {'thuộc vùng '+ harvest.location?.type}</p> 
                                    <p><strong>Địa chỉ:</strong> {harvest.location?.address?.province}, {harvest.location?.address?.district}, {' '} {harvest.location?.address?.commune}, {harvest.location?.address?.street}</p>
                                    <p><strong>Diện tích:</strong> {harvest.location?.area || "Chưa có thông tin"}</p>
                                    <p><strong>Mô tả: </strong>{harvest.location?.description || "Chưa có thông tin"}</p>
                                </div>
                            </div>
                            <div className="modal-detail">
                                <div className="modal-detail-header">
                                    <h5>Thông Tin Đơn Vị Vận Chuyển</h5>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {harvest.transporterID?.image ? (
                                        <img src={harvest.transporterID?.image} alt={harvest.transporterID?.fullname} style={{ width: 'auto', height: '220px', borderRadius: '8px', objectFit: 'cover', marginLeft: '25px', marginTop: '15px', marginBottom: '33px'}}/>
                                    ):(
                                        <FaUserCircle size={40} style={{ width: 'auto', height: '220px', borderRadius: '8px', objectFit: 'cover', marginLeft: '25px', marginTop: '15px', marginBottom: '33px', color: '#4caf50' }} />
                                    )}
                                    <div className="detail-info">
                                        <p><strong>Người đại diện:</strong> {harvest.transporterID?.fullname || "Chưa có thông tin"}</p>
                                        <p><strong>Tên công ty:</strong> {harvest.transporterID?.companyName || "Chưa có thông tin"}</p>
                                        <p><strong>Mã số thuế:</strong> {harvest.transporterID?.registrationNumber || "Chưa có thông tin"}</p>
                                        <p><strong>Địa chỉ:</strong> {harvest.transporterID?.location || "Chưa có thông tin"}</p>
                                        <p><strong>Liên hệ:</strong> {harvest.transporterID?.contactPhone || "Chưa có thông tin"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-detail">
                                <div className="modal-detail-header">
                                    <h5>Thông Tin Đơn Vị Phân Phối</h5>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {harvest.distributorID?.image ? (
                                        <img src={harvest.distributorID?.image} alt={harvest.distributorID?.fullname} style={{ width: 'auto', height: '220px', borderRadius: '8px', objectFit: 'cover', marginLeft: '25px', marginTop: '15px', marginBottom: '33px'}}/>
                                    ):(
                                        <FaUserCircle size={40} style={{ width: 'auto', height: '220px', borderRadius: '8px', objectFit: 'cover', marginLeft: '25px', marginTop: '15px', marginBottom: '33px', color: '#4caf50' }} />
                                    )}
                                    <div className="detail-info">
                                        <p><strong>Người đại diện:</strong> {harvest.distributorID?.fullname || "Chưa có thông tin"}</p>
                                        <p><strong>Tên công ty:</strong> {harvest.distributorID?.companyName || "Chưa có thông tin"}</p>
                                        <p><strong>Mã số thuế:</strong> {harvest.distributorID?.registrationNumber || "Chưa có thông tin"}</p>
                                        <p><strong>Địa chỉ:</strong> {harvest.distributorID?.location || "Chưa có thông tin"}</p>
                                        <p><strong>Liên hệ:</strong> {harvest.distributorID?.contactPhone || "Chưa có thông tin"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tracking' && (
                        <div>
                            <div className="tab-content"> 
                                <section className="process">
                                    <div className="process-header">
                                        <span className="line"></span>
                                        <h2 className="process-title">Quá Trình Sản Xuất</h2>
                                        <span className="line"></span>
                                    </div>
                                    <div className="steps">
                                        {harvest.process?.steps?.length ? (
                                        harvest.process.steps.map((step, index) => (
                                            <div className="step-item" key={index}>
                                            <div className="step-icon">
                                                {getIconByStep(index + 1)} {/* Hàm chọn icon theo thứ tự */}
                                            </div>
                                            <div className="step-content">
                                                <h3>{step.name}</h3>
                                                <p>{step.content}</p>
                                            </div>
                                            </div>
                                        ))
                                        ) : (
                                        <p>Chưa có thông tin</p>
                                        )}
                                    </div>
                                </section>
                            </div>
                            <div className="tab-content"> 
                                <section className="process">
                                    <div className="process-header">
                                        <span className="line"></span>
                                        <h2 className="process-title">Lộ Trình Vận Chuyển</h2>
                                        <span className="line"></span>
                                    </div>
                                    <TemperatureHumidityChart data={sensor} />
                                    <TemperatureMapChart data={sensor}/>
                                </section>
                            </div>
                        </div>
                    )}
                </div>
        </div>
    );
};

export default Detail;