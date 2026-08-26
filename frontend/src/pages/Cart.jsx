import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } =
    useContext(CartContext);

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <main className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="text-gray-600 mt-4">
            You don't have any items in your cart yet.
          </p>

          <Link
            to="/products"
            className="inline-block mt-8 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const shipping = cartTotal > 500 ? 0 : 50;
  const total = cartTotal + shipping;

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow p-5 flex gap-5"
              >
                {/* Product Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-32 h-32 object-contain rounded-lg bg-gray-100"
                />

                {/* Product Information */}
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h2>

                  <p className="text-teal-500 font-bold mt-2">
                    {item.price.toLocaleString()} EGP
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-4">
                    <button
                      onClick={() => {
                        if (item.quantity > 1) {
                          updateQuantity(item.id, item.quantity - 1);
                        }
                      }}
                      className="w-9 h-9 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      -
                    </button>

                    <span className="font-semibold min-w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => {
                        if (item.quantity < item.stock) {
                          updateQuantity(item.id, item.quantity + 1);
                        }
                      }}
                      className="w-9 h-9 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 text-sm mt-4 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Subtotal */}
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Subtotal</span>

              <span className="font-semibold">
                {cartTotal.toLocaleString()} EGP
              </span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Shipping</span>

              <span className="font-semibold text-green-600">
                {shipping === 0 ? "Free" : `${shipping} EGP`}
              </span>
            </div>

            {/* Total */}
            <div className="border-t pt-4 flex justify-between">
              <span className="text-lg font-bold">Total</span>

              <span className="text-lg font-bold text-teal-500">
                {total.toLocaleString()} EGP
              </span>
            </div>

            {/* Checkout */}
            <Link
              to="/checkout"
              className="block text-center w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-xl mt-6 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;
