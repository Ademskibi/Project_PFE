import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminMain = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userOrders, setUserOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthlyOrderCount, setMonthlyOrderCount] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const statsRes = await axios.get("http://localhost:5000/api/stats");
        const productsRes = await axios.get("http://localhost:5000/api/products");
        const allordersRes = await axios.get("http://localhost:5000/api/orders");

        if (statsRes.data && productsRes.data && allordersRes.data) {
          setStats(statsRes.data.stats);
          setChartData(statsRes.data.chartData || []);
          setAllProducts(productsRes.data);
          setAllOrders(allordersRes.data);
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
        const res = await axios.get(
          `http://localhost:5000/api/orders/employee/${selectedUserId}`
        );
        setUserOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch user orders", err);
        setUserOrders([]);
      }
    };

    fetchUserOrders();
  }, [selectedUserId]);

  useEffect(() => {
    if (!selectedMonth || allOrders.length === 0) return;

    const filtered = allOrders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate.getMonth() === parseInt(selectedMonth);
    });

    setMonthlyOrderCount(filtered.length);
  }, [selectedMonth, allOrders]);

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

  // Filter orders by selected month
  const filteredOrders = selectedMonth !== ""
    ? allOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === parseInt(selectedMonth);
      })
    : allOrders;

  // Calculate orders per product based on filtered orders
  const chartDataset = allProducts.map((product) => {
    let orderCount = 0;

    filteredOrders.forEach((order) => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item) => {
          if (
            (item.productId && item.productId._id === product._id) ||
            (item.productId === product._id)
          ) {
            orderCount += item.quantity || 1;
          }
        });
      }
    });

    return {
      name: product.name,
      stock: product.stock,
      orders: orderCount,
    };
  });

  return (
    <div className="">
      <AdminNavbar />

      {/* Month Selector */}
      <div className="mb-6">
        <label className="mr-2 font-medium">Select Month:</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- All Months --</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>

        {selectedMonth !== "" && (
          <div className="mt-2 text-sm text-gray-700">
            Total orders in <strong>{new Date(2023, selectedMonth).toLocaleString('default', { month: 'long' })}</strong>:{" "}
            <span className="font-semibold">{monthlyOrderCount}</span>
          </div>
        )}
      </div>

      {/* Stock vs Orders Chart */}
      {allProducts.length > 0 ? (
        <div className="bg-white p-6 rounded-md shadow-md mb-8">
         
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDataset}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(name) =>
                    name.length > 10 ? name.slice(0, 10) + "..." : name
                  }
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#4F46E5" name="Stock" />
                <Bar dataKey="orders" fill="#EF4444" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-center space-x-6">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-600 mr-2"></div>
              <span>Stock</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span>Orders</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center mt-6">
          No product data available for chart.
        </div>
      )}
    </div>
  );
};

export default AdminMain;
