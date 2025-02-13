import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaSyncAlt, FaPlus, FaEdit, FaTrash, FaUndo } from 'react-icons/fa';
import { Alert, Table, Modal, Button, Form, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Process = () => {
    const [processes, setProcesses] = useState([]);
    const [processData, setProcessData] = useState({
        name: '',
        steps: [{ name: '', content: '' }],
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setError('');
            setSuccess('');
          }, 3000);
        fetchProcesses();
        return () => clearTimeout(timer);
    }, [error, success]);

    const fetchProcesses = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/processes/', {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setProcesses(response.data);
        } catch (err) {
            console.error('Error fetching processes:', err);
            setError('Failed to fetch processes');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!processData.name || processData.steps.some(step => !step.name.trim() || !step.content.trim())) {
            setError('Tên và tất cả các bước là bắt buộc.');
            return;            
        }

        try {
            const response = isEdit
            ? await axios.put(`http://localhost:3000/api/processes/${selectedProcess._id}`, processData, {
                headers: { 'Authorization': `Bearer ${token}` },
            })
            : await axios.post('http://localhost:3000/api/processes', processData, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            console.log(response.data);
            setModalOpen(false);
            setSuccess('Lưu thông tin thành công!');
            fetchProcesses();
        } catch (err) {
            console.error(err);
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa quy trình này không?')) {
            try {
                await axios.delete(`http://localhost:3000/api/processes/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setSuccess('Đã xóa một quy trình thành công.')
                fetchProcesses();
            } catch (err) {
                console.error(err);
                setError(err.response ? err.response.data.message : err.message);
            }
        }
    };

    const openModal = () => {
        setProcessData({ name: '', steps: [{ name: '', content: '' }] });
        setIsEdit(false);
        setModalOpen(true);
    };

    const openEditModal = (process) => {
        setProcessData(process);
        setIsEdit(true);
        setSelectedProcess(process);
        setModalOpen(true);
    };

    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h2 style={{fontSize: '30px', fontWeight: 'bold'}}>Quản Lý Quy Trình Sản Xuất</h2>
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
                            <th style={{padding: '12px', width:'15%'}}>Tên quy trình</th>
                            <th style={{padding: '12px'}}>Quy trình</th>
                            <th style={{padding: '12px', width:'10%'}}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processes
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((process, index) => (
                            <tr key={process._id}>
                                <td style={{textAlign: 'center', padding: '15px'}}>{index + 1}</td>
                                <td style={{padding: '15px'}}>{process.name}</td>
                                <td>
                                    <ul style={{ listStyleType: 'square', paddingLeft: '20px', margin: '0' }}>
                                        {process.steps.map((step, index) => (
                                        <li key={index} style={{ padding: '8px 0px'}}>
                                            <strong>{step.name}: </strong> {step.content}
                                        </li>
                                        ))}
                                    </ul>
                                </td>
                                <td style={{textAlign: 'center', verticalAlign: 'middle'}}>
                                    <button className="edit-button" onClick={() => openEditModal(process)}><FaEdit/></button>
                                    <button className="delete-button"  onClick={() => handleDelete(process._id)}><FaTrash/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{isEdit ? 'Chỉnh Sửa Quy Trình' : 'Thêm Mới Quy Trình'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form.Group controlId="formName" className="form-group">
                                <Form.Label>Tên quy trình</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={processData.name}
                                    onChange={(e) => setProcessData({ ...processData, name: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            {/* Sắp xếp hàng ngang */}
                            <div className="d-flex align-items-center justify-content-between mb-1">
                                <Form.Label className="mb-0">Quy trình thực hiện</Form.Label>
                                <button
                                    type="button"
                                    onClick={() => setProcessData({ ...processData, steps: [...processData.steps, { name: '', content: '' }] })}
                                    className="new-process"
                                >
                                <FaPlus />
                                </button>
                            </div>

                            {processData.steps.map((step, index) => (
                                <div key={index} className="mb-3 border p-3 rounded">
                                    <Form.Group controlId={`formStepName-${index}`} className="form-group">
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <Form.Label>Bước {index + 1}</Form.Label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newSteps = processData.steps.filter((_, stepIndex) => stepIndex !== index);
                                                    setProcessData({ ...processData, steps: newSteps });
                                                }}
                                                className="delete-process"
                                            >
                                                <FaTrash/>
                                            </button>
                                        </div>
                                        <Form.Control
                                            type="text"
                                            placeholder={`Tên bước`}
                                            value={step.name}
                                            onChange={(e) => {
                                                const newSteps = [...processData.steps];
                                                newSteps[index].name = e.target.value;
                                                setProcessData({ ...processData, steps: newSteps });
                                            }}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group controlId={`formStepContent-${index}`} className="form-group">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder={`Nội dung`}
                                            value={step.content}
                                            onChange={(e) => {
                                                const newSteps = [...processData.steps];
                                                newSteps[index].content = e.target.value;
                                                setProcessData({ ...processData, steps: newSteps });
                                            }}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            ))}
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="contained" onClick={isEdit ? handleSubmit : handleSubmit}>
                            {isEdit ? <FaSyncAlt style={{ color: 'white' }} /> : <FaSave style={{ color: 'white' }}/>}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Process;