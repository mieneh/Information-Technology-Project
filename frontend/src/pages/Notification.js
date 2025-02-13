import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell, FaUserCircle, FaAddressBook, FaPhone, FaEnvelope } from 'react-icons/fa';
import Header from "../components/Header";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải thông báo:', error);
      setLoading(false);
    }
  };

  // Đánh dấu thông báo là đã đọc
  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/notifications/${id}/read`, { read: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Lỗi đánh dấu thông báo là đã đọc:', error);
    }
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <div className="header-container">
          <h2 className="header-title">Thông Báo</h2>
        </div>
      </div>
      <div className="notificationlist">
        {notifications.length === 0 ? (
          <p className="no-notifications">Không có thông báo nào.</p>
        ) : (
          <ul>
            {notifications.map((notification) => (
              <li key={notification._id} className={`notificationitem ${notification.read ? 'read' : 'unread'}`}>
                <div className="notification-type">
                  <span>{notification.type}</span>
                  {!notification.read && (
                    <button onClick={() => markAsRead(notification._id)} className="mark-read-btn">Đánh dấu đã đọc</button>
                  )}
                </div>
                <div className="notification-content">
                  <p>{notification.content}</p>
                  <small className="timestamp">{new Date(notification.createdAt).toLocaleString()}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;