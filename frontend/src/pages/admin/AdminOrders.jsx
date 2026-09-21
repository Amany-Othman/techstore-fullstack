import { useEffect, useState } from "react";

import api from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

const STATUSES = ["pending", "shipped", "delivered"];

const badgeClass = (status) =>
  status === "delivered"
    ? "bg-green-100 text-green-700"
    : status === "shipped"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/api/orders");
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    setError("");

    try {
      const response = await api.patch(`/api/orders/${orderId}/status`, {
        status,
      });

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? response.data : order)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Orders</h2>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Order ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Update</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            )}

            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-xs text-gray-500">
                  {order._id.slice(-8)}
                </td>

                <td className="px-5 py-3">
                  <p className="font-medium text-gray-900">
                    {order.user?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>

                <td className="px-5 py-3 text-gray-600">
                  {order.items?.length || 0}
                </td>

                <td className="px-5 py-3 font-semibold text-gray-900">
                  {order.totalPrice.toLocaleString()} EGP
                </td>

                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeClass(
                      order.status,
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-5 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="px-5 py-3">
                  <select
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs capitalize outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
