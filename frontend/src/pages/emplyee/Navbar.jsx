import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../redux/slices/userSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:5000/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      localStorage.removeItem('token');
      dispatch(clearUser());
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
      alert('❌ Logout failed. Please try again.');
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/search?name=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notification/${user._id}`);
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Error fetching notifications', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user?._id]);

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white border-b shadow-md relative">
      {/* Left section: logo or name */}
      <div>
        <button onClick={() => navigate('/home')} className="text-xl font-bold text-indigo-700">🏠 Home</button>
      </div>

      {/* Middle section: search bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by name..."
          className="border rounded px-2 py-1 w-56 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
        >
          🔍
        </button>
      </div>

      {/* Right section: orders, cart, notifications, logout */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/Order_list')}
          className="p-2 flex items-center gap-1 rounded hover:bg-indigo-700 group transition"
          title="Orders"
        >
          <svg className="w-6 h-6 text-gray-700 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6M4 6h16v12H4z" />
          </svg>
          Orders
        </button>

        <button
          onClick={() => navigate('/cart')}
          className="p-2 flex items-center gap-1 rounded hover:bg-indigo-700 group transition"
          title="Cart"
        >
          <svg className="w-6 h-6 text-gray-700 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Cart
        </button>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleNotifications} className="p-2 rounded hover:bg-indigo-700 group transition relative" title="Notifications">
            <svg className="w-6 h-6 text-yellow-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405C18.21 14.21 18 13.702 18 13V9a6 6 0 10-12 0v4c0 .702-.21 1.21-.595 1.595L4 17h5m6 0a3 3 0 11-6 0" />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-white border rounded shadow-lg z-50">
              <h3 className="text-base font-semibold px-4 py-2 border-b text-gray-700">Notifications</h3>
              <ul className="max-h-60 overflow-y-auto text-sm">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <li key={index} className="px-4 py-2 text-gray-800 border-b last:border-none hover:bg-gray-50">
                      {notification.message || 'New update available'}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No new notifications</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          title="Logout"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
