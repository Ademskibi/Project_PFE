// controllers/statsController.js
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getAdminStats = async (req, res) => {
  try {
    // Fetch basic stats
    const totalUsers = await User.countDocuments();
    const activeProducts = await Product.countDocuments({ stock: { $gt: 0 } });
    const pendingOrders = await Order.countDocuments({ status: "Not approved yet" });

    // Prepare chart data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // last 6 months including current

    // Aggregate Users by month
    const usersByMonth = await User.aggregate([
      {
        $match: { createdAt: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]);

    const productsByMonth = await Product.aggregate([
      {
        $match: { createdAt: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Aggregate Orders by month
    const ordersByMonth = await Order.aggregate([
      {
        $match: { createdAt: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]);

    // Helper to merge data
    const months = generateLastSixMonths();

    const chartData = months.map(month => ({
      name: month,
      users: findCount(usersByMonth, month),
      products: findCount(productsByMonth, month),
      orders: findCount(ordersByMonth, month),
    }));

    res.status(200).json({
      stats: {
        totalUsers,
        activeProducts,
        pendingOrders
      },
      chartData
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

function generateLastSixMonths() {
  const months = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(d.toISOString().slice(0, 7)); // "YYYY-MM"
  }
  return months;
}

function findCount(array, month) {
  const item = array.find(i => i._id === month);
  return item ? item.count : 0;
}
