import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../components/index.css';

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = ['img/green-and-orange/1.png', 'img/green-and-orange/2.png', 'img/green-and-orange/3.png'];

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="container">
        <main className="content">
            <div className="section">
            <header className="navbar">
                <div className="logo">
                <img src='img/logo.png' alt="Logo Green Trust" />
                </div>
                <nav className="menu">
                <a href="#about">Giới thiệu</a>
                <a href="#contact">Liên hệ</a>
                </nav>
                <Link to="/login">
                <button className="get-started">Bắt đầu ngay</button>
                </Link>
            </header>
            <div className="text-section">
                <h1>
                Đăng ký với <span className="highlight">Farm <strong>Track</strong></span> ngay hôm nay!
                </h1>
                <p>
                Đảm bảo chứng nhận <span className="highlight-red"> liền mạch</span>, 
                <span className="highlight-red"> không rắc rối</span> và 
                <span className="highlight"> đáng tin cậy</span> cho sản phẩm 
                <span className="highlight-green"> hữu cơ</span> của bạn.
                </p>
                <Link to="/login">
                <button className="get-started">Bắt đầu ngay</button>
                </Link>
            </div>
            </div>
            <div className="image-section">
            <img src={images[currentIndex]} alt="Nông trại" />
            </div>
        </main>
    </div>
  );
  
};

export default Home;