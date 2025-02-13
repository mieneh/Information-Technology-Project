import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Route = () => {
    const [routes, setRoutes] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [batches, setBatches] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [routeData, setRouteData] = useState({
        vehicleID: '',
        driverID: '',
        batchID: '',
        origin: '',
        destination: '',
        departureTime: '',
        estimatedArrival: '',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setSuccess('');
        }, 3000);
        fetchRoutes();
        fetchDrivers();
        fetchVehicles();
        fetchBatches();
        return () => clearTimeout(timer);
    }, [error, success]);

    useEffect(() => {
        if (routeData.batchID) {
          const selectedHarvest = batches.find((h) => h._id === routeData.batchID);
          if (selectedHarvest) {
            setRouteData({
              ...routeData,
              origin: selectedHarvest.userID.farmLocation || '',
              destination: selectedHarvest.distributorID.location || '',
            });
          }
        }
    }, [routeData.batchID, batches]);
      
    const fetchRoutes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/routes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoutes(response.data);
        } catch (err) {
            console.error(err);
            setError('Không thể lấy danh sách lộ trình.');
        }
    };

    const fetchDrivers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/drivers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDrivers(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchVehicles = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/vehicles', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVehicles(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBatches = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/api/harvests', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBatches(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!routeData.vehicleID || !routeData.driverID || !routeData.batchID || !routeData.origin || !routeData.destination || !routeData.departureTime || !routeData.estimatedArrival) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        try {
            if (isEdit) {
                await axios.put(`http://localhost:3000/api/routes/${selectedRoute._id}`, routeData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post('http://localhost:3000/api/routes', routeData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setModalOpen(false);
            setSuccess('Lưu thông tin thành công!');
            fetchRoutes();
        } catch (err) {
            console.error(err);
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa lộ trình này?')) {
            try {
                await axios.delete(`http://localhost:3000/api/routes/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess('Đã xóa lộ trình thành công.');
                fetchRoutes();
            } catch (err) {
                console.error(err);
                setError(err.response ? err.response.data.message : err.message);
            }
        }
    };

    const openModal = () => {
        setRouteData({
            vehicleID: '',
            driverID: '',
            batchID: '',
            origin: '',
            destination: '',
            departureTime: '',
            estimatedArrival: '',
        });
        setIsEdit(false);
        setModalOpen(true);
    };

    const openEditModal = (route) => {
        setRouteData(route);
        setSelectedRoute(route);
        setIsEdit(true);
        setModalOpen(true);
    };

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2>Quản Lý Lộ Trình</h2>
                <button className="add-role" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            
            <div className='roleheader'>
                <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
                    <thead>
                        <tr style={{ textAlign: 'center', fontSize: '18px', height: '50px' }} >
                            <th style={{ width:'2%'}}>STT</th>
                            <th style={{ width:'10%'}}>Phương Tiện</th>
                            <th style={{ width:'10%'}}>Tài Xế</th>
                            <th style={{ width:'10%'}}>Lô Hàng</th>
                            <th style={{ width:'14%'}}>Xuất Phát</th>
                            <th style={{ width:'14%'}}>Đích Đến</th>
                            <th style={{ width:'10%'}}>Khởi Hành</th>
                            <th style={{ width:'10%'}}>Dự Kiến Đến</th>
                            <th style={{ width:'10%'}}>Trạng Thái</th>
                            <th style={{ width:'10%'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {routes
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((route, index) => (
                        <tr key={route._id}>
                            <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                            <td style={{ padding: '15px'}}>{route.vehicleID?.type}</td>
                            <td style={{ padding: '15px'}}>{route.driverID?.name}</td>
                            <td style={{ padding: '15px'}}>{route.batchID?.batch}</td>
                            <td style={{ padding: '15px'}}>{route.origin}</td>
                            <td style={{ padding: '15px'}}>{route.destination}</td>
                            <td style={{ padding: '15px'}}>{new Date(route.departureTime).toLocaleString()}</td>
                            <td style={{ padding: '15px'}}>{new Date(route.estimatedArrival).toLocaleString()}</td>
                            <td style={{ padding: '15px'}}>{route.status}</td>
                            <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                <button className="edit-button" onClick={() => openEditModal(route)}><FaEdit/></button>
                                <button className="delete-button"  onClick={() => handleDelete(route._id)}><FaTrash/></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </div>

            <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? 'Chỉnh Sửa Lộ Trình' : 'Thêm Lộ Trình'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label>Phương Tiện</Form.Label>
                            <Form.Select
                                value={routeData.vehicleID}
                                onChange={(e) => setRouteData({ ...routeData, vehicleID: e.target.value })}
                                required
                            >
                                <option value="">Chọn Phương Tiện</option>
                                {vehicles.map((vehicle) => (
                                <option key={vehicle._id} value={vehicle._id}>
                                    {vehicle.type}
                                </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Tài Xế</Form.Label>
                            <Form.Select
                                value={routeData.driverID}
                                onChange={(e) => setRouteData({ ...routeData, driverID: e.target.value })}
                                required
                            >
                                <option value="">Chọn Tài Xế</option>
                                {drivers.map((driver) => (
                                <option key={driver._id} value={driver._id}>
                                    {driver.name}
                                </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Lô Hàng</Form.Label>
                            <Form.Select
                                value={routeData.batchID}
                                onChange={(e) => setRouteData({ ...routeData, batchID: e.target.value })}
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
                            <Form.Label>Xuất Phát</Form.Label>
                            <Form.Control type="text" value={routeData.origin} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Đích Đến</Form.Label>
                            <Form.Control type="text" value={routeData.destination} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Thời Gian Khởi Hành</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={routeData.departureTime}
                                onChange={(e) => setRouteData({ ...routeData, departureTime: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Dự Kiến Đến</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={routeData.estimatedArrival}
                                onChange={(e) => setRouteData({ ...routeData, estimatedArrival: e.target.value })}
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

export default Route;