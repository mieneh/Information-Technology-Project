import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwipeToRevealActions from 'react-swipe-to-reveal-actions';
import { FaHome, FaTruck, FaUserTie, FaRoute, FaUserCircle, FaAddressBook, FaPhone, FaEnvelope } from 'react-icons/fa';
import { Modal, Button, Form, Nav, Tab, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "../components/Header";
import Vehicle from './Transport/Vehicle';
import Driver from './Transport/Driver';
import Route from './Transport/Route';
import Order from './Order';

const Transport = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [role, setRole] = useState(null);
    const [transporters, setTransporters] = useState([]);
    const [connections, setConnections] = useState([]);
    const [selectedTransport, setSelectedTransport] = useState(null);
    const [showPhone, setShowPhone] = useState(false);
    const [showRequest, setShowRequest] = useState(false);
    const [showList, setShowList] = useState(false);
    const [message, setMessage] = useState('');
    const [activeTabList, setActiveTabList] = useState('Sent');

    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
        setRole(user.role);
        if (!user || (user.role !== 'Producer' && user.role !== 'Transport')) {
            alert('Bạn không có quyền truy cập vào trang này.');
            navigate('/');
        }
        fetchTransporters();
        fetchConnections();
    }, []);
    
    const fetchTransporters = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/users/transporter');
          setTransporters(response.data);
        } catch (err) {
          console.error(err);
        }
    };
    
    const fetchConnections = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/connection/transporter', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setConnections(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleShowPhone = (transporter = null) => {
        setShowPhone(true);
        window.location.href = `tel:${transporter.contactPhone}`;
    };
        
    const handleShowList = () => {
        setShowList(true);
    };
        
    const handleClose = () => {
        setShowRequest(false);
        setShowList(false);
    }
        
    const handleShowRequest = (transporter) => {
        setSelectedTransport(transporter);
        setShowRequest(true);
    };
    
    const handleSendRequest = async () => {
        const existingRequest = connections.find((connection) =>
            connection.transporterID?._id === selectedTransport._id && connection.status === 'Pending'
        );

        if (existingRequest) {
            alert("Đã có yêu cầu hợp tác.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3000/api/connection/send-transporter', {
                transporterID: selectedTransport._id,
                message: message,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(response.data.message);
            window.location.reload();
            handleClose();
        } catch (err) {
            console.error(err);
            alert('Gửi yêu cầu thất bại. Vui lòng thử lại.');
        }
    };
    
    const handleAcceptRequest = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/connection/accept-reject/${id}`, {status: 'Accepted',}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Yêu cầu hợp tác đã được chấp nhận.');
            setConnections(connections.map(connect => 
                connect._id === id ? { ...connect, status: 'Accepted' } : connect
            ));
        } catch (error) {
            console.error('Lỗi khi chấp nhận yêu cầu:', error);
        }
    };
    
    const handleRejectRequest = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/connection/accept-reject/${id}`, {status: 'Rejected',}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Yêu cầu hợp tác đã bị từ chối.');
            setConnections(connections.map(connect => 
                connect._id === id ? { ...connect, status: 'Rejected' } : connect
            ));
        } catch (error) {
            console.error('Lỗi khi từ chối yêu cầu:', error);
        }
    };

    const handleCancelRequest = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/connection/cancel/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Đã hủy yêu cầu hợp tác!');
            setConnections(prevState => prevState.filter(connect => connect._id !== id));
        } catch (error) {
            alert("Đã xảy ra lỗi, vui lòng thử lại!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thông tin thu hoạch này?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/api/connection/cancel/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Đã xóa hợp tác thành công!');
                setConnections(prevState => prevState.filter(connect => connect._id !== id));
            } catch (error) {
                alert("Đã xảy ra lỗi, vui lòng thử lại!");
            }
        }
    };
    
    return (
        <div>
            <Header/>
            {role === "Transport" ? (
                <div className='role'>
                    <Tab.Container id="transport-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                        <Row>
                            <Col sm={1}>
                                <Nav className="nav-tab flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="all"><FaHome/></Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="vehicles"><FaTruck/></Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="drivers"><FaUserTie/></Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="routes"><FaRoute/></Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={11}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="all">
                                        <Order/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="vehicles">
                                        <Vehicle/>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="drivers">
                                        <Driver/>
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="routes">
                                    <Route/>
                                    </Tab.Pane>

                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            ) : (
                <div style={{ padding: '20px' }}>
                    <div className="header-container">
                        <h2 className="header-title">Đơn Vị Vận Chuyển</h2>
                        <button className="add-button" onClick={() => handleShowList()}><FaAddressBook /></button>
                    </div>
                    {transporters.filter( (transporter) => !connections.some( (connection) => connection.status === 'Accepted' && connection.transporterID?._id === transporter._id ) ).length === 0 ? (
                        <p>Không có danh mục nào!</p>
                    ) : (
                        transporters
                        .filter( (transporter) => !connections.some( (connection) => connection.status === 'Accepted' && connection.transporterID?._id === transporter._id ) )
                        .map((transporter) => (
                            <div key={transporter._id} className="card">
                                <SwipeToRevealActions
                                    actionButtons={[
                                        {
                                            content: <FaEnvelope style={{ fontSize: '30px', color: 'green' }} />,
                                            onClick: () => handleShowRequest(transporter),
                                        },
                                        {
                                            content: <FaPhone style={{ fontSize: '30px', color: 'red' }} />,
                                            onClick: () => handleShowPhone(transporter),
                                        },
                                    ]}
                                    actionButtonMinWidth={60}
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <div className="info" onClick={() =>setSelectedTransport(transporter === selectedTransport ? null : transporter)}>
                                        <h3>{transporter.companyName}</h3>
                                        <p>{transporter.location}</p>
                                    </div>
                                </SwipeToRevealActions>
                                {selectedTransport && selectedTransport._id === transporter._id && (
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '18px', marginBottom: '-10px', fontSize: '16px', }}>
                                        <img src={transporter.image || '../../frontend/public/img/admin.jpg'} alt={transporter.fullname} style={{ width: '150px', height: '150px', borderRadius: '8px', objectFit: 'cover', marginRight: '16px', marginBottom: '10px' }}/>
                                        <div classsName='card'>
                                            <p><strong>Người đại diện:</strong> {transporter.fullname}</p>
                                            <p><strong>Email:</strong> {transporter.contactEmail}</p>
                                            <p><strong>Số điện thoại:</strong> {transporter.contactPhone}</p>
                                        </div>
                                    </div>
                                )}

                                <Modal show={showRequest} onHide={handleClose}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Yêu Cầu Hợp Tác</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {selectedTransport && (
                                            <Form>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Nhà Sản Xuất</Form.Label>
                                                    <Form.Control
                                                        value={selectedTransport.companyName}
                                                        readOnly
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Nội dung:</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={4}
                                                        value={message}
                                                        onChange={(e) => setMessage(e.target.value)}
                                                        placeholder="Nhập nội dung yêu cầu..."
                                                    />
                                                </Form.Group>
                                            </Form>
                                        )}
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="primary" onClick={handleSendRequest}>
                                            Gửi
                                        </Button>
                                    </Modal.Footer>
                                </Modal>

                                <Modal show={showList} onHide={handleClose} className="custom-modal">
                                    <Modal.Header closeButton>
                                        <Modal.Title>Danh Sách</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Tab.Container id="requests-tabs" activeKey={activeTabList} onSelect={k => setActiveTabList(k)}>
                                            <Row>
                                                <Col sm={12}>
                                                    <Nav variant="pills" className="flex-row justify-content-center">
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="Sent">Đã Gửi</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="Received">Đã Nhận</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link eventKey="Accepted">Đối Tác</Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col sm={12}>
                                                    <Tab.Content style={{boxShadow: 'none', padding: '0px'}}>
                                                        <Tab.Pane eventKey="Sent">
                                                            {connections.filter(c => c.status === 'Pending' && c.typeProducer === 'Sent').length === 0 ? (
                                                                <p>Chưa có yêu cầu đã gửi.</p>
                                                            ) : (
                                                                connections
                                                                .filter(c => c.status === 'Pending' && c.typeProducer === 'Sent')
                                                                .map((connection) => (
                                                                    <div key={connection._id}>
                                                                        <div className="connection-card">
                                                                            <div className="connection-header d-flex align-items-center justify-content-between">
                                                                                <div className="avatar d-flex align-items-center">
                                                                                    {connection.transporterID?.image ? (
                                                                                        <img src={connection.transporterID.image} alt={connection.transporterID.farmName} className="avatar-image" />
                                                                                    ) : (
                                                                                        <FaUserCircle size={40} style={{ color: '#4caf50' }} />
                                                                                    )}
                                                                                </div>
                                                                                <div className="connection-info">
                                                                                    <h5 className="connection-name">{connection.transporterID?.companyName}</h5>
                                                                                    <p className="connection-subinfo">{connection.transporterID?.location || "Địa chỉ không xác định"}</p>
                                                                                </div>
                                                                                <div className="connection-buttons">
                                                                                    <button className="btn-danger" onClick={() => handleCancelRequest(connection._id)}> Hủy </button>
                                                                                </div>
                                                                            </div>
                                                                            <div className="connection-message">
                                                                                <p className="message-label">Lời nhắn:</p>
                                                                                <p className="message-connection">{connection.message}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </Tab.Pane>

                                                        <Tab.Pane eventKey="Received">
                                                            {connections.filter(c => c.status === 'Pending' && c.typeProducer === 'Received').length === 0 ? (
                                                                <p>Chưa có yêu cầu đã nhận.</p>
                                                            ) : (
                                                                connections
                                                                .filter(c => c.status === 'Pending' && c.typeProducer === 'Received')
                                                                .map((connection) => (
                                                                    <div key={connection._id}>
                                                                        <div className="connection-card">
                                                                            <div className="connection-header d-flex align-items-center justify-content-between">
                                                                                <div className="avatar d-flex align-items-center">
                                                                                    {connection.transporterID?.image ? (
                                                                                        <img src={connection.transporterID.image} alt={connection.transporterID.farmName} className="avatar-image" />
                                                                                    ) : (
                                                                                        <FaUserCircle size={40} style={{ color: '#4caf50' }} />
                                                                                    )}
                                                                                </div>
                                                                                <div className="connection-info">
                                                                                    <h5 className="connection-name">{connection.transporterID?.companyName}</h5>
                                                                                    <p className="connection-subinfo">{connection.transporterID?.location || "Địa chỉ không xác định"}</p>
                                                                                </div>
                                                                                <div className="connection-buttons d-flex">
                                                                                    <button className="btn-success me-2" onClick={() => handleAcceptRequest(connection._id)}>Chấp nhận</button>
                                                                                    <button className="btn-danger" onClick={() => handleRejectRequest(connection._id)}>Từ chối</button>
                                                                                </div>
                                                                            </div>
                                                                            <div className="connection-message">
                                                                                <p className="message-label">Lời nhắn:</p>
                                                                                <p className="message-connection">{connection.message}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </Tab.Pane>

                                                        <Tab.Pane eventKey="Accepted">
                                                            {connections.filter(c => c.status === 'Accepted').length === 0 ? (
                                                                <p>Chưa có đối tác nào.</p>
                                                            ) : (
                                                                connections
                                                                .filter(c => c.status === 'Accepted')
                                                                .map((connection) => (
                                                                    <div key={connection._id}>
                                                                        <div className="connection-card">
                                                                            <div className="connection-header d-flex align-items-center justify-content-between">
                                                                                <div className="avatar d-flex align-items-center">
                                                                                    {connection.transporterID?.image ? (
                                                                                        <img src={connection.transporterID.image} alt={connection.transporterID.farmName} className="avatar-image" />
                                                                                    ) : (
                                                                                        <FaUserCircle size={40} style={{ color: '#4caf50' }} />
                                                                                    )}
                                                                                </div>
                                                                                <div className="connection-info">
                                                                                    <h5 className="connection-name">{connection.transporterID?.companyName}</h5>
                                                                                    <p className="connection-subinfo">{connection.transporterID?.location || "Địa chỉ không xác định"}</p>
                                                                                </div>
                                                                                <div className="connection-buttons">
                                                                                    <button className="btn-danger" onClick={() => handleDelete(connection._id)}>Xóa</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            )}
                                                        </Tab.Pane>
                                                    </Tab.Content>
                                                </Col>
                                            </Row>
                                        </Tab.Container>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
};

export default Transport;