import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
 const navigate = useNavigate(); 
    
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  const logout = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error("Logout failed");
        }

        localStorage.removeItem("token"); // Clear token from storage
        navigate("/"); // Redirect to home/login page
    } catch (error) {
        console.error("Error logging out", error);
        alert("❌ Logout failed. Please try again.");
    }
};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {

    axios.get("/api/notifications") 
      .then(response => {
        setNotifications(response.data);
      })
      .catch(error => {
        console.error("Error fetching notifications", error);
      });
  }, []);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white relative">
      {/* Logo or Title */}
      <div className="flex items-center space-x-6">
        <h2 className="text-2xl font-semibold">Supplies Inventory</h2>
      </div>

      <div className="flex items-center space-x-6 relative">
        {/* Notifications Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleNotifications}
            className="bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-500 flex items-center relative"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405C18.21 14.21 18 13.702 18 13V9a6 6 0 10-12 0v4c0 .702-.21 1.21-.595 1.595L4 17h5m6 0a3 3 0 11-6 0"
              />
            </svg>
            {/* Notification count badge */}
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
              <ul className="mt-2">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <li key={index} className="p-2 text-gray-800 border-b last:border-b-0">
                      {notification.message}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500">No new notifications</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500" onClick={logout}>
        <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={2}
  className="w-6 h-6"
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v1"
  />
</svg>

        </button>
      </div>
    </nav>
  );
};

export default Navbar;
