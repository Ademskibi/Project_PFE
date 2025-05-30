// controllers/statsController.js
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getAdminStats = async (req, res) => {
  try {
    // Fetch basic stats
    const totalUsers = await User.countDocuments();
    const activeProducts = await Product.countDocuments({ stock: { $gt: 0 } });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Not approved yet" });
    
    // Prepare chart data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // Last 6 months including current

    // Aggregate Users by month
    const usersByMonth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Aggregate Products by month
    const productsByMonth = await Product.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Aggregate Orders by month
    const ordersByMonth = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Generate last 6 months in "YYYY-MM" format
    const months = generateLastSixMonths();

    // Merge data into unified chart format
    const chartData = months.map(month => ({
      name: month,
      users: findCount(usersByMonth, month),
      products: findCount(productsByMonth, month),
      orders: findCount(ordersByMonth, month)
    }));

    // Send response
    res.status(200).json({
      stats: {
        totalUsers,
        activeProducts,
        totalProducts,
        totalOrders,
        pendingOrders
      },
      chartData
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// Utility: Generates last 6 months in "YYYY-MM" format
function generateLastSixMonths() {
  const months = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7)); // "YYYY-MM"
  }
  return months;
}

// Utility: Finds count in array by month ID
function findCount(array, month) {
  const item = array.find(i => i._id === month);
  return item ? item.count : 0;
}
export const getUserStats = async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.find({ employeeId: id });

    // Optionally, count orders by month
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const ordersByMonth = await Order.aggregate([
      {
        $match: {
          employeeId: id,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]);

    const months = generateLastSixMonths();
    const chartData = months.map(month => ({
      name: month,
      orders: findCount(ordersByMonth, month)
    }));

    res.status(200).json({ orders, chartData });
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ message: "Failed to fetch user stats" });
  }
};

