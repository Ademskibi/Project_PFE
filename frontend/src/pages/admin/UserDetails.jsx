import React, { useState, useEffect } from "react";

const UserDetails = ({ userId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    departmentId: "",
  });

  // Fetch user details and departments
  const fetchUserDetails = async () => {
    try {
      // Fetch the user details
      const response = await fetch(`http://localhost:5000/api/user/${userId}`);
      const data = await response.json();
      setUserDetails(data);

      // Set the form data with user details
      setFormData({
        name: data.name,
        email: data.email,
        role: data.role,
        departmentId: data.departmentId || "", // Default to empty if no department
      });

      // Fetch the list of departments
      const deptResponse = await fetch(`http://localhost:5000/api/departments`);
      const deptData = await deptResponse.json();
      setDepartments(deptData);
    } catch (error) {
      console.error("❌ Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]); // Fetch user details when userId changes

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Update user details
  const updateUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, ...formData }),
      });
      const data = await response.json();
      if (data.message) {
        fetchUserDetails(); // Refresh user details after update
      }
    } catch (error) {
      console.error("❌ Error updating user:", error);
    }
  };

  // Get the department name based on departmentId


  return (
    <div className="max-w-3xl mx-auto p-10 mt-10 bg-white rounded-3xl shadow-2xl">
      {userDetails ? (
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
                {/* Default option when no department is selected */}
                <option value="" disabled>
                {formData.departmentId.name || "Select Department"}
                </option>

                {/* List departments */}
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
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-full transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">Loading user details...</p>
      )}
    </div>
  );
};

export default UserDetails;
