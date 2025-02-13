import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SwipeToRevealActions from "react-swipe-to-reveal-actions";
import { FaShoppingCart, FaSave, FaCheck, FaTimes, FaEye, FaTruck, FaEnvelope } from 'react-icons/fa';
import { Card, Modal, Button, Form, Nav, Tab, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import '../components/index.css';

const Product = () => {
  const [produces, setProduces] = useState([]);
  const [requests, setRequests] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showList, setShowList] = useState(false);
  const [activeTabList, setActiveTabList] = useState('Unprocessed');
  
  const [transporters, setTransporters] = useState([]);
  const [showTransport, setShowTransport] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const _user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
      setUser(_user);
      if (!_user || (_user.role !== 'Producer' && _user.role !== 'Distributor')) {
        alert('Bạn không có quyền truy cập vào trang này.');
        navigate('/');
      }
    }

    fetchProduces();
    fetchRequests();
    fetchTransporters();
  }, []);

  useEffect(() => {
    console.log('showTransport:', showTransport);
  }, [showTransport]);
  
  const fetchProduces = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/harvests/harvest");
      setProduces(response.data.data);
      console.log("API Response:", response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (err) {
      console.error(err);
      setError('Không thể lấy danh sách yêu cầu.');
    }
  };

  const fetchTransporters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/connection/transporter', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransporters(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageClick = (produce) => {
    setSelectedProduce(produce);
    setShowModal(true);
  };

  const handleShowList = () => {
    setShowList(true);
  };

  const handleShowTransporter = async (requestID) => {
    setSelectedRequest(requestID);
    setShowTransport(true);
  };
  
  const handleClose = () => {
    setShowModal(false);
    setSelectedProduce(null);
    setShowList(false);
  };

  const handleContact = async () => {
    const existingRequest = requests.find((request) =>
      request.harvestID?._id === selectedProduce._id && request.status === 'Pending'
    );

    if (existingRequest) {
        alert("Bạn đã gửi yêu cầu với sản phẩm này trước đó.");
        return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/requests/send',{
          harvestID: selectedProduce._id,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert(response.data.message);
      window.location.reload();
      handleClose();
    } catch (err) {
      alert('Đã xảy ra lỗi khi liên hệ. Vui lòng thử lại.');
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
        const token = localStorage.getItem('token');
        await axios.put(`http://localhost:3000/api/requests/accept/${id}`,{ status: 'Accepted' }, {
          headers: { Authorization: `Bearer ${token}` },
        }      
      );
      alert('Yêu cầu đã được chấp nhận.');
      setRequests(requests.map(request => 
        request._id === id ? { ...request, status: 'Accepted' } : request
      ));
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleRejectRequest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/requests/${id}`,{ status: 'Rejected' , message: 'Yêu cầu đã bị từ chối bởi Nhà sản xuất.'}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Yêu cầu đã bị từ chối.');
      setRequests(requests.map(request => 
        request._id === id ? { ...request, status: 'Rejected' , message: 'Yêu cầu đã bị từ chối bởi Nhà sản xuất.' } : request
      ));
    } catch (err) {
      console.error(err);
    }
  };
    
  const handleCancelRequest = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/requests/${id}`,{ status: 'Rejected' , message: 'Yêu cầu đã bị hủy bởi Nhà phân phối.'}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Yêu cầu đã bị hủy thành công!');
      setRequests(requests.map(request => 
        request._id === id ? { ...request, status: 'Rejected' , message: 'Yêu cầu đã bị hủy bởi Nhà phân phối.'} : request
      ));
    } catch (err) {
      console.error(err);
    }
  };
  
  // Hàm xử lý khi bấm submit trong form chọn nhà vận chuyển
  const handleSubmitTransport = async () => {
    if (!selectedTransporter) {
      alert('Vui lòng chọn nhà vận chuyển!');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/api/requests/assign-transporter/`,{
          requestID: selectedRequest,
          transporterID: selectedTransporter,
        },{
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert(response.data.message);
      handleCloseTransport();
      fetchRequests();
    } catch (error) {
      console.error(error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('Có lỗi xảy ra khi gán nhà vận chuyển.');
      }
    }
  };
  
  const handleCloseTransport = () => {
    setSelectedTransporter(null);
    setShowTransport(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Có lỗi xảy ra: {error}</p>;

  return (
    <div>
      <Header/>
      <div style={{ padding: '20px' }}>
        <div className="header-container">
          <h2 className="header-title">Nông Sản</h2>
          <button className="add-button" onClick={() => handleShowList()}><FaShoppingCart /></button>
        </div>
        {produces.length === 0 ? (
          <p>Không có sản phẩm nào!</p>
        ) : (
          <div className="product-list">
            {produces.map((produce) => (
              <div key={produce._id}>
                <Card style={{ width: '20rem' }}>
                  <Card.Img
                    variant="top"
                    src={produce.product.image}
                    alt={produce.product.name}
                    onClick={() => handleImageClick(produce)}
                  />
                  <Card.Body>
                    <SwipeToRevealActions
                      actionButtons={[{
                        content: <FaEnvelope size={20}/>,
                        onClick: () => handleContact,
                      }]}
                      actionButtonMinWidth={90}
                    >
                      <div className="product-info">
                        <Card.Title>{produce.product?.name}</Card.Title>
                        <Card.Text>{produce.userID?.farmName || "Chưa có loại cây trồng"}</Card.Text>
                      </div>
                    </SwipeToRevealActions>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}

        <Modal show={showModal} onHide={handleClose} className="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết sản phẩm</Modal.Title>
          </Modal.Header>
            <Modal.Body>
            {selectedProduce && (
              <div>
                <div className="modal-content-container">
                  <img src={selectedProduce.product.image} alt={selectedProduce.product.name} className="modal-product-image"/>
                  <div className="modal-product-details">
                    <div className="modal-product-header">
                      <h5>Sản phẩm: {selectedProduce.product?.name || "Chưa có thông tin"}</h5>
                    </div>
                    <div className="modal-info">
                      <p><strong>Lô hàng</strong> {selectedProduce?.batch}</p>
                      <p><strong>Ngày sản xuất</strong> {new Date(selectedProduce?.harvestDate).toLocaleDateString()}</p>
                      <p><strong>Ngày hết hạn</strong> {new Date(selectedProduce?.expirationDate).toLocaleDateString()}</p>
                      <p><strong>Số lượng:</strong> {selectedProduce?.quantity} kg</p>
                    </div>
                  </div>
                </div>
                <div className="modal-product">
                  <div className="modal-product-header">
                    <h5>Thông tin Nông trại</h5>
                  </div>
                  <div className="modal-info">
                    <p><strong>Người đại diện:</strong> {selectedProduce.userID?.fullname || "Chưa có thông tin"}</p>
                    <p><strong>Tên nông trại:</strong> {selectedProduce.userID?.farmName || "Chưa có thông tin"}</p>
                    <p><strong>Địa chỉ:</strong> {selectedProduce.userID?.farmLocation || "Chưa có thông tin"}</p>
                    <p><strong>Số đăng ký:</strong> {selectedProduce.userID?.registrationNumber || "Chưa có thông tin"}</p>
                    <p><strong>Liên hệ:</strong> {selectedProduce.userID?.contactPhone || "Chưa có thông tin"}</p>
                  </div>
                </div>
                <div className="modal-product">
                  <div className="modal-product-header">
                    <h5>Thông tin Sản xuất</h5>
                  </div>
                  <div className="modal-info">
                    <p><strong>Vùng sản xuất:</strong> {selectedProduce.location?.name || "Chưa có thông tin"} thuộc vùng {selectedProduce.location?.type}</p> 
                    <p>{selectedProduce.location?.description || "Chưa có thông tin"}</p>
                    <p>
                      <strong>Địa chỉ:</strong> {selectedProduce.location?.address?.province}, {selectedProduce.location?.address?.district}, {' '} {selectedProduce.location?.address?.commune}, {selectedProduce.location?.address?.street}
                    </p>
                    <p><strong>Diện tích:</strong> {selectedProduce.location?.area || "Chưa có thông tin"}</p>
                    <p><strong>Quy trình:</strong>
                      <p style={{ listStyleType: 'square', paddingLeft: '20px', margin: '0' }}>
                        {selectedProduce.process?.steps.map((step, index) => (
                          <li key={index} style={{ padding: '8px 0px'}}>
                          <strong>{step.name}: </strong> {step.content}
                          </li>
                        )) || "Chưa có thông tin"}
                      </p>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          {user.role === "Distributor" && (
            <Modal.Footer>
              <Button variant="primary" onClick={handleContact}>
                Yêu cầu
              </Button>
            </Modal.Footer>
          )}
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
                    {user.role === "Producer" ? (
                      <>
                        <Nav.Item>
                          <Nav.Link eventKey="Unprocessed">Chưa xử lý</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="Processed">Đã xử lý</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="Cancel">Đã hủy</Nav.Link>
                        </Nav.Item>
                      </>
                    ) : (
                      <>
                        <Nav.Item>
                          <Nav.Link eventKey="Unprocessed">Yêu cầu</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="Processed">Đơn hàng</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="Cancel">Đã hủy</Nav.Link>
                        </Nav.Item>
                      </>
                    )}
                  </Nav>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <Tab.Content style={{ boxShadow: 'none', padding: '0px' }}>
                    <Tab.Pane eventKey="Unprocessed">
                      {requests.filter((r) => r.status === 'Pending').length === 0 ? (
                        <p className="text-muted text-center">Chưa có yêu cầu chưa xử lý.</p>
                      ) : (
                        requests
                        .filter((r) => r.status === 'Pending')
                        .map((request) => (
                        <Card key={request._id} className="mb-4 shadow-sm">
                          <Row className="g-0">
                            <Col md={3} className="d-flex align-items-center justify-content-center">
                              <img src={request.harvestID?.product.image || '/path/to/default-image.jpg'} alt="Hình ảnh mặt hàng" className="img-fluid rounded" style={{ maxHeight: '180px', objectFit: 'cover', borderRadius: '12px' }} />
                            </Col>
                            <Col md={9}>
                              <Card.Header style={{ color: 'green', fontWeight: 'bold' }}>
                                <div style={{ marginTop: '10px' }}>
                                  <h5>Lô Hàng: {request.harvestID?.batch}</h5> 
                                </div>
                              </Card.Header>
                              <Card.Body>
                                {user.role === 'Producer' ? (
                                  <>
                                    <p><strong>Nhà Phân Phối:</strong> {request.distributorID?.companyName}</p>
                                    <p><strong>Địa Chỉ: </strong> {request.distributorID?.location}</p>
                                  </>
                                ):(
                                  <>
                                    <p><strong>Nhà Sản Xuất:</strong> {request.harvestID.userID?.farmName}</p>
                                    <p><strong>Địa Chỉ:</strong> {request.harvestID.userID?.farmLocation}</p>
                                  </>
                                )}
                                <div className="d-flex mt-3">
                                  {user.role === 'Producer' ? (
                                    <>
                                      <button className="btn btn-success me-2" onClick={() => handleAcceptRequest(request._id)} ><FaCheck /></button>
                                      <button className="btn btn-danger" onClick={() => handleRejectRequest(request._id)} ><FaTimes /></button>
                                    </>
                                  ) : (
                                    <button className="btn btn-danger" onClick={() => handleCancelRequest(request._id)} ><FaTimes /></button>
                                  )}
                                </div>
                              </Card.Body>
                            </Col>
                          </Row>
                        </Card>
                      )))}
                    </Tab.Pane>
                  
                    <Tab.Pane eventKey="Processed">
                      {requests.filter((r) => r.status === 'Accepted').length === 0 ? (
                        <p className="text-muted text-center">Chưa có yêu cầu đã nhận.</p>
                      ) : (
                        requests
                        .filter((r) => r.status === 'Accepted')
                        .map((request) => (
                        <Card key={request._id} className="mb-2 shadow-sm">
                          <Row className="g-0">
                            <Col md={3} className="d-flex align-items-center justify-content-center">
                              <img src={request.harvestID?.product.image || '/path/to/default-image.jpg'} alt="Hình ảnh mặt hàng" className="img-fluid rounded" style={{ maxHeight: '220px', objectFit: 'cover', borderRadius: '12px' }} />
                            </Col>
                            <Col md={9}>
                              <Card.Header style={{ color: 'green', fontWeight: 'bold' }}>
                                <div style={{ marginTop: '10px' }}>
                                  <h5>Lô Hàng: {request.harvestID?.batch}</h5> 
                                </div>
                              </Card.Header>
                              <Card.Body>
                                {user.role === 'Producer' ? (
                                  <>
                                    <p><strong>Nhà Phân Phối:</strong> {request.distributorID?.companyName}</p>
                                    <p><strong>Địa Chỉ: </strong> {request.distributorID?.location}</p>
                                  </>
                                ) : (
                                  <>
                                    <p><strong>Nhà Sản Xuất:</strong> {request.harvestID.userID?.farmName}</p>
                                    <p><strong>Địa Chỉ:</strong> {request.harvestID.userID?.farmLocation}</p>
                                  </>
                                )}

                                {user.role === 'Producer' ? (
                                  request.harvestID?.transporterID ? (
                                    <>
                                      <p><strong>Nhà Vận Chuyển:</strong> {request.harvestID.transporterID?.companyName}</p>
                                      <p><strong>Địa Chỉ: </strong> {request.harvestID.transporterID?.location}</p>
                                    </>
                                  ) : (
                                    <button className="btn btn-primary" onClick={() => handleShowTransporter(request._id)}><FaTruck /></button>
                                  )
                                ) : (
                                  <button className="btn btn-info"><FaEye /></button>
                                )}
                              </Card.Body>
                            </Col>
                          </Row>
                        </Card>
                      )))}
                    </Tab.Pane>

                    <Tab.Pane eventKey="Cancel">
                      {requests.filter((r) => r.status === 'Rejected').length === 0 ? (
                        <p className="text-muted text-center">Chưa có yêu cầu bị từ chối.</p>
                      ) : (
                        requests
                          .filter((r) => r.status === 'Rejected')
                          .map((request) => (
                            <Card key={request._id} className="mb-2 shadow-sm">
                              <div style={{ height: '5px', marginBottom: '10px', background: 'linear-gradient(to right, #ff6b6b, #ff8c42)', }} ></div>
                              <Row>
                                <Col md={3} className="d-flex align-items-center justify-content-center">
                                  <img src={request.harvestID?.product.image || '/path/to/default-image.jpg'} alt="Hình ảnh mặt hàng" className="img-fluid rounded" style={{ maxHeight: '220px', objectFit: 'cover', borderRadius: '12px' }} />
                                </Col>
                                <Col md={9}>
                                  <Card.Header style={{  }}>
                                    <div style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>
                                      <h5>Lô Hàng: {request.harvestID?.batch}</h5>
                                    </div>
                                  </Card.Header>
                                  <Card.Body>
                                    {user.role === 'Producer' ? (
                                      <>
                                        <p><strong>Nhà Phân Phối:</strong> {request.distributorID?.companyName}</p>
                                        <p><strong>Địa Chỉ: </strong> {request.distributorID?.location}</p>
                                      </>
                                    ) : (
                                      <>
                                        <p><strong>Nhà Sản Xuất:</strong> {request.harvestID.userID?.farmName}</p>
                                        <p><strong>Địa Chỉ:</strong> {request.harvestID.userID?.farmLocation}</p>
                                      </>
                                    )}
                                    <p style={{ fontStyle: 'italic', color: '#888' }}>
                                      <strong>Cập nhật:</strong> {formatDate(request.updatedAt) || 'Không có cập nhật mới'}
                                    </p>
                                  </Card.Body> 
                                  <div style={{ position: 'absolute', top: '10px', right: '20px' }}>
                                    <span className="badge bg-danger">{request.message}</span>
                                  </div>
                                </Col>
                              </Row>
                            </Card>
                          ))
                      )}
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
            
            <Modal show={showTransport} onHide={handleCloseTransport}>
              <Modal.Header closeButton>
                <Modal.Title>Chọn Nhà Vận Chuyển</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Select
                      value={selectedTransporter}
                      onChange={(e) => setSelectedTransporter(e.target.value)}
                      required
                    >
                      <option value="">Chọn nhà vận chuyển</option>
                      {transporters
                      .filter((r) => r.status === 'Accepted')
                      .map((transporter) => (
                        <option key={transporter.transporterID._id} value={transporter.transporterID._id}>
                          {transporter.transporterID?.companyName} - {transporter.transporterID?.location}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="contained" onClick={handleSubmitTransport}>
                  <FaSave style={{ color: 'white' }} />
                </Button>
              </Modal.Footer>
            </Modal>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Product;