import Order from "../models/Order.js";

// @desc    Place an order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { items, totalPrice } = req.body;

  const order = await Order.create({
    user: req.user._id,
    items,
    totalPrice,
  });

  return res.status(201).json(order);
};

// @desc    Logged-in user's own orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  return res.status(200).json(orders);
};

// @desc    All orders (admin table)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  return res.status(200).json(orders);
};

// @desc    Update an order's status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const allowed = ["pending", "shipped", "delivered"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();

  const populated = await order.populate("user", "name email");

  return res.status(200).json(populated);
};
