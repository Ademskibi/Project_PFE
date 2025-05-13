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
    <div className="flex justify-end items-center gap-4 p-4 bg-white shadow">
      {/* Add User Button */}
      <button
        onClick={() => navigate("/Add_User")}
        className="p-2 rounded hover:bg-gray-100 transition"
        title="Add User"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-indigo-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2 4a6 6 0 11-4.24-10.24A6 6 0 0112 20z"
          />
        </svg>
      </button>

      {/* Add Product Button */}
      <button
        onClick={() => navigate("/Add_Product")}
        className="p-2 rounded hover:bg-gray-100 transition"
        title="Add Product"
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
            d="M12 4v4m0 0h4m-4 0H8m8 2a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V10a2 2 0 012-2h8z"
          />
        </svg>
      </button>

      {/* Logout Button */}
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
  );
};

export default AdminNavbar;
