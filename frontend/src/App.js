import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register'; 
import Profile from './pages/Profile';
import Notification from './pages/Notification';

import User from './pages/User';

import Product from './pages/Product';
import Produce from './pages/Produce';
import Distribution from './pages/Distribution';
import Transport from './pages/Transport';

import QR from './pages/QR';
import Detail from './pages/Detail';

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notification" element={<Notification />} />

        <Route path="/user" element={ <User />}/>
        
        <Route path="/product" element={<Product />} />
        <Route path="/produce" element={<Produce />} />
        <Route path="/distribution" element={<Distribution />} />
        <Route path="/transport" element={ <Transport /> } />

        <Route path="/qr" element={ <QR /> } />
        <Route path="/harvest/:id" element={<Detail />} /> 

      </Routes>
    </Router>
  );
};

export default App;