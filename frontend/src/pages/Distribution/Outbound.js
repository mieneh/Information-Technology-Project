import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Alert } from "react-bootstrap";
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const Outbound = () => {
    const [outbounds, setOutbounds] = useState([]);
    const [retailers, setRetailers] = useState([]);
    const [inbounds, setInbounds] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [outboundData, setOutboundData] = useState({
        exitDate: "",
        entryID: "",
        quantity: "",
        note: "",
        retailerID: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setSuccess('');
        }, 3000);
        fetchOutbounds();
        fetchRetailers();
        fetchInbounds();
        return () => clearTimeout(timer);
    }, [error, success]);


    const fetchOutbounds = async () => {
        try {
        const response = await axios.get("http://localhost:3000/api/outbounds", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setOutbounds(response.data);
        } catch (err) {
        console.error(err);
        setError('Không thể lấy danh sách xuât kho.');
        }
    };

    const fetchRetailers = async () => {
        try {
        const response = await axios.get("http://localhost:3000/api/retailers", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setRetailers(response.data);
        } catch (err) {
        console.error(err);
        setError('Không thể lấy danh sách nhà bán lẻ.');
        }
    };

    const fetchInbounds = async () => {
        try {
        const response = await axios.get("http://localhost:3000/api/inbounds", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setInbounds(response.data);
        } catch (err) {
        console.error(err);
        setError('Không thể lấy danh sách nhập kho.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!outboundData.exitDate || !outboundData.entryID || !outboundData.quantity || !outboundData.retailerID) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        try {
            if (isEdit) {
                await axios.put(`http://localhost:3000/api/outbounds/${selectedOutbound._id}`, outboundData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await axios.post("http://localhost:3000/api/outbounds", outboundData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setModalOpen(false);
            setSuccess('Lưu thông tin thành công!');
            fetchOutbounds();
        } catch (err) {
            console.error(err);
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mục xuất này?')) {
            try {
                await axios.delete(`http://localhost:3000/api/outbounds/${id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                setSuccess('Đã xóa mục xuất thành công.');
                fetchInbounds();
              } catch (err) {
                console.error(err);
                setError(err.response ? err.response.data.message : err.message);
            }
        }
            
    };

    const openModal = () => {
        setOutboundData({
          exitDate: new Date().toISOString().split('T')[0],
          entryID: '',
          quantity: '',
          note: '',
          retailerID: '',
        });
        setIsEdit(false);
        setModalOpen(true);
    };
    
    const openEditModal = (outbound) => {
        setOutboundData(outbound);
        setSelectedOutbound(outbound);
        setIsEdit(true);
        setModalOpen(true);
    };

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2>Quản Lý Xuất Kho</h2>
                <button className="add-role" style={{marginTop: '-10px'}} onClick={openModal}><FaPlus /></button>
            </div>

            {success && <Alert variant="success">{success}</Alert>}

            <div className='roleheader'>
                <Table bordered hover responsive style={{ borderCollapse: 'collapse', boxShadow: '0px 4px 6px rgba(0.1, 0, 0, 0.1)' }}>
                <thead>
                    <tr style={{ textAlign: 'center', fontSize: '18px', height: '50px' }} >
                        <th style={{ width:'5%'}}>STT</th>
                        <th style={{ width:'10%'}}>Ngày Xuất</th>
                        <th style={{ width:'20%'}}>Sản Phẩm</th>
                        <th style={{ width:'20%'}}>Nhà Bán Lẻ</th>
                        <th style={{ width:'15%'}}>Số Lượng</th>
                        <th style={{ width:'20%'}}>Ghi chú</th>
                        <th style={{ width:'10%'}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {outbounds
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((outbound, index) => (
                    <tr key={outbound._id}>
                        <td style={{ textAlign: 'center', padding: '15px' }}>{index + 1}</td>
                        <td style={{ textAlign: 'center', padding: '15px' }}>{new Date(outbound.exitDate).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'center', padding: '15px' }}>{outbound.entryID.batchID.product.name || 'N/A'}</td>
                        <td style={{ textAlign: 'center', padding: '15px' }}>{outbound.retailerID.fullname || 'N/A'}</td>
                        <td style={{ textAlign: 'center', padding: '15px' }}>{outbound.quantity || 'N/A'} kg</td>
                        <td style={{ padding: '15px' }}>{outbound.note}</td>
                        <td style={{textAlign: 'center', verticalAlign: 'middle' }}>
                        <button className="edit-button" onClick={() => openEditModal(outbound)}><FaEdit/></button>
                        <button className="delete-button"  onClick={() => handleDelete(outbound._id)}><FaTrash/></button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </Table>
            </div>

            <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? "Chỉnh Sửa Xuất Kho" : "Xuất Kho"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày Xuất Kho</Form.Label>
                            <Form.Control
                                type="date"
                                value={outboundData.exitDate}
                                onChange={(e) => setOutboundData({ ...outboundData, exitDate: e.target.value })}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Sản Phẩm</Form.Label>
                            <Form.Select
                                value={outboundData.entryID}
                                onChange={(e) => setOutboundData({ ...outboundData, entryID: e.target.value })}
                                required
                            >
                                <option value="">Lựa chọn...</option>
                                {inbounds.map((inbound) => (
                                <option key={inbound._id} value={inbound._id}>
                                    {inbound.batchID.batch}
                                </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nhà Bán Lẻ</Form.Label>
                            <Form.Select
                                value={outboundData.retailerID}
                                onChange={(e) => setOutboundData({ ...outboundData, retailerID: e.target.value })}
                                required
                            >
                                <option value="">Lựa chọn...</option>
                                {retailers.map((retailer) => (
                                <option key={retailer._id} value={retailer._id}>
                                    {retailer.fullname}
                                </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Số Lượng</Form.Label>
                            <Form.Control
                                type="number"
                                value={outboundData.quantity}
                                onChange={(e) => setOutboundData({ ...outboundData, quantity: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ghi Chú</Form.Label>
                            <Form.Control
                                type="text"
                                value={outboundData.note}
                                onChange={(e) => setOutboundData({ ...outboundData, note: e.target.value })}
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

export default Outbound;