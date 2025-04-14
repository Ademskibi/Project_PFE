import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  // Toggle Notifications Dropdown
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // Logout Function (Using Axios Instead of Fetch)
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Clear token and redirect to login page
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Error logging out", error);
      alert("❌ Logout failed. Please try again.");
    }
  };

  // Close Notifications When Clicking Outside
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
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/notifications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };
  
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10 seconds
  
    return () => clearInterval(interval);
  }, []);


  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white relative">
      {/* Logo or Title */}
      <h2 className="text-2xl font-semibold">Supplies Inventory</h2>

      <div className="flex items-center space-x-6 relative">
        {/* Cart Button */}
        <button
          onClick={() => navigate("/cart")}
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500"
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
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </button>

        {/* Notifications Button */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleNotifications}
            className="bg-yellow-600 text-white p-2 rounded-md hover:bg-yellow-500 flex items-center relative"
            aria-expanded={showNotifications}
            aria-haspopup="true"
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
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
              <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
              <ul className="mt-2 max-h-40 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <li
                      key={index}
                      className="p-2 text-gray-800 border-b last:border-b-0"
                    >
                      {notification.message || "New update available"}
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
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
          onClick={logout}
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;