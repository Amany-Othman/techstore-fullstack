import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const LOW_STOCK_THRESHOLD = 5;

// @desc    Dashboard summary numbers
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  const [totalProducts, totalOrders, totalUsers, lowStock, revenueAgg] =
    await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments({ stock: { $lt: LOW_STOCK_THRESHOLD } }),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

  const recentOrders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: revenueAgg[0]?.total || 0,
    lowStock,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
    recentOrders,
  });
};
