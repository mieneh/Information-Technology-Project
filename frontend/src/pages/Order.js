import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Modal } from 'react-bootstrap';
import TemperatureHumidityChart from './ChartTemperatureHumidityLight';
import TemperatureMapChart from './ChartMap';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');
    
    useEffect(() => {
        if (localStorage.getItem('token')) {
            const _user = JSON.parse(atob(token.split('.')[1]));
            setUser(_user);
        }
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/harvests/order', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data);
        } catch (err) {
            console.error(err);
            setError('Không thể lấy danh sách đơn hàng.');
        }
    };

    const handleClick = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };
    
    const getStatusDescription = (status) => {
        switch (status) {
          case 'Pending':
            return 'Đang chờ vận chuyển';
          case 'Processing':
            return 'Đang vận chuyển';
          case 'Completed':
            return 'Đã giao hàng thành công';
          default:
            return 'Đơn hàng chưa có lên đơn';
        }
    };

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2>Theo Dõi Lô Hàng</h2>
            </div>
            <div>
                {orders.length === 0 ? (
                    <p className="text-muted text-center">Chưa có yêu cầu đã nhận.</p>
                ) : (
                    orders.map((order) => (
                        <Card key={order._id} className="mb-2 shadow-sm" onClick={() => handleClick(order)}>
                            <Row className="g-0">
                                <Col md={3} className="d-flex align-items-center justify-content-center">
                                    <img src={order.product?.image || '/path/to/default-image.jpg'} alt="Hình ảnh mặt hàng" className="img-fluid rounded" style={{ maxHeight: '220px', objectFit: 'cover', borderRadius: '12px' }} />
                                </Col>
                                <Col md={9}>
                                    <Card.Header style={{ color: 'green', fontWeight: 'bold' }}>
                                        <div style={{ marginTop: '10px' }}>
                                            <h5>Lô Hàng: {order?.batch}</h5>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        {user.role === 'Producer' ? (
                                            <>
                                                <p><strong>Nhà Phân Phối:</strong> {order.distributorID?.companyName}</p>
                                                <p><strong>Địa Chỉ:</strong> {order.distributorID?.location}</p>
                                                <p><strong>Nhà Vận Chuyển:</strong> {order.transporterID?.companyName}</p>
                                                <p><strong>Địa Chỉ:</strong> {order.transporterID?.location}</p>
                                                <p><strong>Tình Trạng Đơn Hàng:</strong> {getStatusDescription(order.routeStatus)}</p>
                                            </>
                                        ) : user.role === 'Transport' ? (
                                            <>
                                                <p><strong>Nhà Phân Phối:</strong> {order.distributorID?.companyName}</p>
                                                <p><strong>Địa Chỉ:</strong> {order.distributorID?.location}</p>
                                                <p><strong>Nhà Sản Xuất:</strong> {order.userID?.farmName}</p>
                                                <p><strong>Địa Chỉ:</strong> {order.userID?.farmLocation}</p>
                                                <p><strong>Tình Trạng Đơn Hàng:</strong> {getStatusDescription(order.routeStatus)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p><strong>Nhà Sản Xuất:</strong> {order.userID?.farmName}</p>
                                                <p><strong>Địa Chỉ:</strong> {order.userID?.farmLocation}</p>
                                                <p><strong>Nhà Vận Chuyển:</strong> {order.transporterID?.companyName}</p>
                                                <p><strong>Địa Chỉ:</strong> {order.transporterID?.location}</p>
                                                <p><strong>Tình Trạng Đơn Hàng:</strong> {getStatusDescription(order.routeStatus)}</p>
                                            </>
                                        )}
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    ))
                )}
            </div>

            <Modal show={showModal} onHide={handleClose} className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Theo dõi đơn hàng</Modal.Title>
                </Modal.Header>
                {selectedOrder && selectedOrder.sensors && selectedOrder.sensors.length > 0 ? (
                    <>
                        <TemperatureHumidityChart data={selectedOrder.sensors} />
                        <TemperatureMapChart data={selectedOrder.sensors} />
                    </>
                ) : (
                    <div style={{marginTop: '30px'}}className="no-notifications ">
                        <p>Không có dữ liệu cảm biến nào có sẵn.</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Order;