import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },

            name: {
                type: String,
            },

            price: {
                type: Number,
            },

            quantity: {
                type: Number,
            },

            image: {
                type: String,
            },
        },
    ],

    totalPrice: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ["pending", "shipped", "delivered"],
        default: "pending",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const Order = mongoose.model("Order", orderSchema);

export default Order;