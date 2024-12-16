//frontend/src/App.js

import 'typeface-comfortaa';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Product from './pages/Product';
import Harvest from './pages/Harvest';

// ProtectedRoute component để bảo vệ các route
const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;  // Nếu không có token, chuyển hướng về trang login
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/product" element={<ProtectedRoute element={<Product />} />} />
        <Route path="/harvest" element={<ProtectedRoute element={<Harvest />} />} />
      </Routes>
    </Router>
  );
};

export default App;