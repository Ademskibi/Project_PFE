import React from "react";
import { useNavigate } from "react-router-dom";

const AdminMain = () => {
  const navigate = useNavigate(); // Use inside the component

  const handleNavigation = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      navigate(selectedValue);
    }
  };

  return (
    <div className="p-6">
        
      {/* Admin Panel Header */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-md">
        <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        
        {/* Dropdown for Admin Actions */}
        <div className="relative">
          <label htmlFor="admin-actions" className="sr-only">Admin Actions</label>
          <select
            id="admin-actions"
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            onChange={handleNavigation} // Trigger navigation on change
          >
            <option value="">Select Action</option>
            <option value="/Add_User">Add New User</option>
            <option value="/Add_Product">Add New Product</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
