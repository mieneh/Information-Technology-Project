// src/components/Header.js
import React, { useState } from "react";
import { FaBell, FaBars, FaTimes, FaUser, FaPen, FaSignOutAlt } from "react-icons/fa";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfileMenu = () => {
    setToggle(!toggle);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <img src="img/logo.png" alt="Logo" />
        </div>
      </header>
      
      <nav className="navbar-tmp">
        <div className="navbar-tmp-section">
          <div className="navbar-logo">
            <h1>Farm Track</h1>
          </div>
          <div className="menu-icon" onClick={toggleMenu}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>
          <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
            <a href="/product">Nông sản</a>
            <a href="/harvest">Mùa thu hoạch</a>
            <a href="#contact">Liên hệ</a>
          </div>
          <div className="navbar-notification-user">
            <div className="navbar-search">
              <input type="search" placeholder="Search..." />
            </div>
            <div className="icon-circle">
              <FaBell
                className={`icon ${notificationOpen ? "active" : ""}`}
                onClick={toggleNotification}
              />
            </div>
            <div className="icon-circle">
              <FaUser className="icon" onClick={toggleProfileMenu} />
            </div>
            <div className={`profile-menu ${toggle ? "open" : ""}`}>
              <a href="/profile"><FaPen /> Trang cá nhân</a>
              <a href="/logout"><FaSignOutAlt /> Đăng xuất</a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;