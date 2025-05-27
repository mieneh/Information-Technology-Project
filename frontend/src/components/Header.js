import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FaBell, FaBars, FaTimes, FaUser, FaPen, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toggleProfile, setToggleProfile] = useState(false);
  const [toggleNotification, setToggleNotification] = useState(false);
  const [role, setRole] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const user = JSON.parse(atob(token.split('.')[1]));
      setRole(user.role);
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const notificationsData = response.data;
      setNotifications(notificationsData);
      const unreadCount = notificationsData.filter((notif) => !notif.read).length;
      setUnreadCount(unreadCount);
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
    }
  };  
  
  const markAllAsRead = async () => {
    try {
      await axios.patch("http://localhost:3000/api/notifications/mark-all-read", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          read: true,
        }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Lỗi khi đánh dấu thông báo là đã đọc:", err);
    }
  };
  
  const roleLinks = {
    Admin: [
      { to: "/admin", text: "Dashboard" },
      { to: "/user", text: "Tài Khoản" },
    ],
    Producer: [
      { to: "/produce", text: "Quản Lý" },
      { to: "/product", text: "Nông Sản" },
      { to: "/transport", text: "Vận Chuyển" },
    ],
    Transport: [
      { to: "/transport", text: "Quản Lý" },
      { to: "/produce", text: "Sản Xuất" },
    ],
    Distributor: [
      { to: "/distribution", text: "Quản Lý" },
      { to: "/product", text: "Nông Sản" },
    ],
  };
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfileMenu = () => {
    setToggleProfile(!toggleProfile);
  };

  const toggleNotificationMenu = () => {
    setToggleNotification(!toggleNotification);
  };

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <img src="/img/logo.png" alt="Logo" />
        </div>
      </header>

      <nav className="navbar-tmp">
        <div className="navbar-tmp-section">
          <div className="navbar-logo">
            <h1>F a r m T r a c k</h1>
            <div className="menu-icon" onClick={toggleMenu}>
              {menuOpen ? <FaTimes /> : <FaBars />}
            </div>
          </div>
          <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
            {role ? (
              <>
                {(role in roleLinks) && roleLinks[role].map((link) => (
                  <Link key={link.to} to={link.to}> {link.text} </Link>
                ))}
              </>
            ) : (
              <>
                <Link to="/">Trang Chủ</Link>
                <Link to="/about">Giới Thiệu</Link>
                <Link to="/contact">Liên Hệ</Link>
              </>
            )}
            <Link to="/qr">Truy Suất</Link>
          </div>
          
          <div className="navbar-notification-user">
            <div className="navbar-search">
              <input type="search" placeholder="Search..." />
            </div>
            {role ? (
              <>
                <div className="icon-circle">
                  <FaBell className="icon" onClick={toggleNotificationMenu}/>
                  {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                </div>
                <div className={`notification-menu ${toggleNotification ? "open" : ""}`}>
                  <div className="notification-header">
                    <button onClick={markAllAsRead}>Đánh dấu đọc tất cả</button>
                  </div>
                  <div className="notification-list">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`notification-item ${notif.read ? "read" : "unread"}`} >
                          <p>{notif.content}</p>
                          <small>{new Date(notif.createdAt).toLocaleString()}</small>
                        </div>
                      ))
                    ) : (
                      <div style={{  margin: '20px'}}>
                        <p className="no-notifications">Không có thông báo nào.</p>
                      </div>
                    )}
                  </div>
                  <div className="notification-footer">
                    <Link to="/notification">Xem tất cả</Link>
                  </div>
                </div>
                <div className="icon-circle">
                  <FaUser className="icon" onClick={toggleProfileMenu} />
                </div>
                <div className={`profile-menu ${toggleProfile ? "open" : ""}`}>
                  <Link to="/profile"><FaPen /> Hồ sơ</Link>
                  <Link to="/logout"><FaSignOutAlt /> Đăng xuất</Link>
                </div>
              </>
            ) : (
              <>
                <div className="icon-circle">
                  <Link to="/login"><FaUser className="icon" onClick={toggleProfileMenu} /></Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
