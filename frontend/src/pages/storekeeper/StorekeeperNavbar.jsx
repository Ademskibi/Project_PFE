import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/slices/userSlice";

const StorekeeperNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.user.user);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.removeItem("token");
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("❌ Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/notification/${user._id}`);
        setNotifications(res.data.notifications || []);
      } catch (err) {
        console.error("Error fetching notifications", err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [user?._id]);

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white border-b shadow-sm text-gray-900 relative">
      <h2 className="text-2xl font-semibold tracking-wide">Storekeeper Panel</h2>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={() => navigate("/supplies")}
          className="p-2 rounded hover:bg-gray-100 transition"
          title="Supplies"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7h18M3 12h18M3 17h18"
            />
          </svg>
        </button>

        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleNotifications}
            className="p-2 rounded hover:bg-gray-100 transition relative"
            title="Notifications"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405C18.21 14.21 18 13.702 18 13V9a6 6 0 10-12 0v4c0 .702-.21 1.21-.595 1.595L4 17h5m6 0a3 3 0 11-6 0"
              />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 bg-white border rounded shadow-lg z-50">
              <h3 className="text-base font-semibold px-4 py-2 border-b text-gray-700">
                Notifications
              </h3>
              <ul className="max-h-60 overflow-y-auto text-sm">
                {notifications.length > 0 ? (
                  notifications.map((n, i) => (
                    <li
                      key={i}
                      className="px-4 py-2 text-gray-800 border-b last:border-none hover:bg-gray-50"
                    >
                      {n.message || "New notification"}
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
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
          onClick={logout}
          title="Logout"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default StorekeeperNavbar;
