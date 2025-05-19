import React, { useState, useEffect } from "react";

const UserDetails = ({ userId, onUserUpdated }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    departmentId: "",
  });

  // Fetch user details and departments
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}`);
      const data = await response.json();
      setUserDetails(data);

      setFormData({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "",
        departmentId: data.departmentId || "",
      });

      const deptResponse = await fetch("http://localhost:5000/api/departments");
      const deptData = await deptResponse.json();
      setDepartments(deptData);
    } catch (error) {
      console.error("❌ Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateUser = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/update-user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      });

      const data = await response.json();

      if (data.message) {
        alert("✅ User updated successfully!");
        fetchUserDetails();
        if (onUserUpdated) onUserUpdated();
      } else {
        alert("❌ Failed to update user.");
      }
    } catch (error) {
      console.error("❌ Error updating user:", error);
      alert("❌ Something went wrong while updating.");
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentName = () => {
    const department = departments.find((dept) => dept._id === formData.departmentId);
    return department ? department.name : "Select Department";
  };

  if (!userDetails) return <p>Loading user details...</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Edit User</h2>

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Role:</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-gray-700 mb-2 font-medium">Department:</label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">{getDepartmentName()}</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Save Changes Button */}
      <div className="mt-10 text-center">
        <button
          onClick={updateUser}
          disabled={loading}
          className={`px-8 py-4 ${
            loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
          } text-white text-lg font-semibold rounded-full transition duration-300`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
