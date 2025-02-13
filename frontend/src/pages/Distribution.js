import React, { useState, useEffect } from 'react';
import { FaHome, FaBoxOpen, FaDolly, FaUsers } from 'react-icons/fa';
import { Nav, Tab, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "../components/Header";
import Inbound from './Distribution/Inbound';
import Outbound from './Distribution/Outbound';
import Retailer from './Distribution/Retailer';
import Order from './Order';

const Distribution = () => {
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
    if (!user || user.role !== 'Distributor') {
        alert('Bạn không có quyền truy cập vào trang này.');
        navigate('/');
    }
  }, []);

  return (
    <div>
        <Header/>
        <div className='role'>
            <Tab.Container id="Distribution-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Row>
                    <Col sm={1}>
                        <Nav className="nav-tab flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="all"><FaHome/></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="inbounds"><FaBoxOpen/></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="outbounds"><FaDolly/></Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="retailers"><FaUsers/></Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={11}>
                        <Tab.Content>
                            <Tab.Pane eventKey="all">
                                <Order/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="inbounds">
                                <Inbound/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="outbounds">
                                <Outbound/>
                            </Tab.Pane>
                            <Tab.Pane eventKey="retailers">
                                <Retailer/>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    </div>
  );
};

export default Distribution;