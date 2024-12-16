//frontend/src/pages/Home.js
 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/index.css';

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = ['img/green-and-orange/1.png', 'img/green-and-orange/2.png', 'img/green-and-orange/3.png'];
    
    const navigate = useNavigate();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleGetStarted = () => {
        if (token) {
            navigate('/product'); // Chuyển hướng đến trang product nếu đã đăng nhập
        } else {
            navigate('/login'); // Chuyển hướng đến trang login nếu chưa đăng nhập
        }
    };
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
                        <button className="get-started" onClick={handleGetStarted}> Bắt đầu ngay </button>
                    </header>
                    <div className="text-section">
                        <h1>Đăng ký với <span className="highlight">Farm <strong>Track</strong></span> ngay hôm nay!</h1>
                        <p> Đảm bảo chứng nhận 
                            <span className="highlight-red"> liền mạch</span>, 
                            <span className="highlight-red"> không rắc rối</span> và 
                            <span className="highlight"> đáng tin cậy</span> cho sản phẩm 
                            <span className="highlight-green"> hữu cơ</span> của bạn.
                        </p>
                        <button className="get-started" onClick={handleGetStarted}> Bắt đầu ngay </button>
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