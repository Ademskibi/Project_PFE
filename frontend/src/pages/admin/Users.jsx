import React, { useState, useEffect } from "react";
import UserDetails from "./UserDetails"; // Import UserDetails component

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch all users
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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">User Management</h2>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left text-sm font-semibold">
              <th className="px-6 py-3 border-b">User ID</th>
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Role</th>
              <th className="px-6 py-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{user.userId}</td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => setSelectedUserId(user.userId)}
                      className="text-blue-600 hover:underline"
                    >
                      {user.name}
                    </button>
                  </td>
                  <td className="px-6 py-4 border-b">{user.email}</td>
                  <td className="px-6 py-4 border-b capitalize">{user.role}</td>
                  <td className="px-6 py-4 border-b text-center space-x-2">
                    <button
                      onClick={() => setSelectedUserId(user.userId)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition duration-150"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteUser(user.userId)}
                      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Show UserDetails when a user is selected */}
      {selectedUserId && (
        <UserDetails
          userId={selectedUserId}
          onUserUpdated={() => {
            fetchUsers();    // Refresh the user list after an update
            setSelectedUserId(null); // Optional: hide details after updating
          }}
        />
      )}
    </div>
  );
};

export default Users;
