import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MangerNavbar from "./MangerNavbar";
import axios from "axios";

const AdminMain = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
    
        const res = await axios.get("http://localhost:5000/api/stats", {
        
        });

        if (res.data) {
          setStats(res.data.stats);
          setChartData(res.data.chartData || []);
        } else {
          setError("No data received from server.");
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
        setError("Error loading stats. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleNavigation = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue) {
      navigate(selectedValue);
    }
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

      {/* Admin Header */}
 



      {/* Stats Section */}
      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Total Users</h3>
            <p className="text-2xl">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Active Products</h3>
            <p className="text-2xl">{stats.activeProducts}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
            <p className="text-2xl">{stats.pendingOrders}</p>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center">No statistics available.</div>
      )}

      {/* Chart Section */}
      {chartData.length > 0 ? (
        <div className="bg-white p-6 rounded-md shadow-md">
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
    </div>
  );
};

export default AdminMain;