import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const items = cartItems.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          totalPrice: cartTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      clearCart();
      setSuccess(true);

      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-6">
            Order placed successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 border-b border-gray-100 pb-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>

                    <p className="text-gray-500 text-sm mt-1">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-teal-600 font-bold mt-1">
                      {item.price} EGP
                    </p>
                  </div>

                  <p className="font-semibold text-gray-900">
                    {item.price * item.quantity} EGP
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Total
            </h2>

            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{cartTotal} EGP</span>
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>{cartTotal} EGP</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || success}
              className="w-full mt-6 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
