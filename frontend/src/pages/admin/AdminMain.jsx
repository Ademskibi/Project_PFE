import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MangerNavbar from "./MangerNavbar";
import axios from "axios";

const AdminMain = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const statsRes = await axios.get("http://localhost:5000/api/stats");
        const usersRes = await axios.get("http://localhost:5000/api/users");

        if (statsRes.data && usersRes.data) {
          setStats(statsRes.data.stats);
          setChartData(statsRes.data.chartData || []);
          setAllUsers(usersRes.data);
        } else {
          setError("No data received from server.");
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError("Error loading data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!selectedUserId) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/orders/employee/${selectedUserId}`);
        setUserOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch user orders", err);
        setUserOrders([]);
      }
    };

    fetchUserOrders();
  }, [selectedUserId]);

  const handleUserSelect = (e) => {
    setSelectedUserId(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <MangerNavbar />

      {/* Stats Section */}
      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-2xl">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Active Products</h3>
            <p className="text-2xl">{stats.activeProducts}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Total Products</h3>
            <p className="text-2xl">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
            <p className="text-2xl">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
            <p className="text-2xl">{stats.totalOrders}</p>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center">No statistics available.</div>
      )}

      {/* Chart Section */}
      {chartData.length > 0 ? (
        <div className="bg-white p-6 rounded-md shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4">Activity Over Last 6 Months</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center">
              <thead>
                <tr>
                  <th className="border p-2">Month</th>
                  <th className="border p-2">Users</th>
                  <th className="border p-2">Products</th>
                  <th className="border p-2">Orders</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((month, index) => (
                  <tr key={index}>
                    <td className="border p-2">{month.name}</td>
                    <td className="border p-2">{month.users}</td>
                    <td className="border p-2">{month.products}</td>
                    <td className="border p-2">{month.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center mt-6">No activity data available.</div>
      )}

      {/* User Orders Section */}
      <div className="bg-white p-6 rounded-md shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">View Orders by User</h3>
        <select
          className="border p-2 rounded-md mb-4 w-full md:w-1/3"
          onChange={handleUserSelect}
          value={selectedUserId}
        >
          <option value="">Select a user</option>
          {allUsers.map((user) => (
            <option key={user._id} value={user._id}>
              {user.nom} ({user.email})
            </option>
          ))}
        </select>

        {selectedUserId && (
          <>
            {userOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-center">
                  <thead>
                    <tr>
                      <th className="border p-2">Order ID</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Ordered at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="border p-2">{order._id}</td>
                        <td className="border p-2">{order.status}</td>
                        <td className="border p-2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500 text-center">No orders for this user.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminMain;
