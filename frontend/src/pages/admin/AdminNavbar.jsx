import React from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/slices/userSlice";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

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
      console.error("Error logging out", error);
      alert("❌ Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md border-b">
      <div className="text-lg font-semibold text-gray-700">Admin Dashboard</div>

      <div className="flex items-center gap-4">
        {/* Home */}
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium text-blue-600 transition"
          title="Home"
        >
          🏠 Home
        </button>

        {/* View Users */}
        <button
          onClick={() => navigate("/Users")}
          className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium transition"
          title="View Users"
        >
          👥 Users
        </button>

        {/* Add User */}
        <button
          onClick={() => navigate("/Add_User")}
          className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium text-indigo-600 transition"
          title="Add User"
        >
          ➕ Add User
        </button>

        {/* Add Product */}
        <button
          onClick={() => navigate("/Add_Product")}
          className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium text-green-600 transition"
          title="Add Product"
        >
          📦 Add Product
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition text-sm"
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
    </div>
  );
};

export default AdminNavbar;
