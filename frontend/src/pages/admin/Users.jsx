import React, { useState, useEffect } from "react";
import UserDetails from "./UserDetails";
import AdminNavbar from "./AdminNavbar";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch("http://localhost:5000/api/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (data.message) fetchUsers();
    } catch (error) {
      console.error("❌ Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          👥 User Management
        </h2>

        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-indigo-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="px-6 py-3 border-b">ID</th>
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Email</th>
                <th className="px-6 py-3 border-b">Role</th>
                <th className="px-6 py-3 border-b">Department</th>
                <th className="px-6 py-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.userId} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 border-b">{user.userId}</td>
                    <td className="px-6 py-4 border-b">
                      <button
                        onClick={() => setSelectedUserId(user.userId)}
                        className="text-indigo-600 font-medium hover:underline"
                      >
                        {user.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 border-b">{user.email}</td>
                    <td className="px-6 py-4 border-b capitalize">{user.role}</td>
                    <td className="px-6 py-4 border-b">
                      {user.departmentId?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b text-center space-x-2">
                      <button
                        onClick={() => setSelectedUserId(user.userId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        ✏️ Update
                      </button>
                      <button
                        onClick={() => deleteUser(user.userId)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        🗑️ Delete
                      </button>
                      <button
                        onClick={() => navigate(`/user_stats/${user.userId}`)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-sm"
                      >
                        📊 History
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal for editing user */}
        {selectedUserId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
              <button
                onClick={() => setSelectedUserId(null)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✖
              </button>
              <UserDetails
                userId={selectedUserId}
                onUserUpdated={() => {
                  fetchUsers();
                  setSelectedUserId(null);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
