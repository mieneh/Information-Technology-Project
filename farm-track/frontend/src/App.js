//frontend/src/App.js
import 'typeface-comfortaa';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Product from './pages/Product';
import Harvest from './pages/Harvest'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product" element={<Product />} />
        <Route path="/harvest" element={<Harvest />} />
      </Routes>
    </Router>
  );
};

export default App;