import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    const { items, totalPrice } = req.body;

    const order = await Order.create({
        user: req.user._id,
        items,
        totalPrice,
    });
    //201 : created new source 
    return res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
    const orders = await Order.find({
        user: req.user._id,
    });

    return res.status(200).json(orders);
};

export const getAllOrders  = async (req, res) => {
    const orders = await Order.find();
    return res.status(200).json(orders);

};