import { useEffect, useState } from "react";

import api from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

const STATUSES = ["pending", "shipped", "delivered"];

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  shipped: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const formatEGP = (amount) => `${Number(amount ?? 0).toLocaleString()} EGP`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getInitials = (name) =>
  (name || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const INBOX_PATH =
  "M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z";

function StatusBadge({ status }) {
  const style =
    STATUS_STYLES[status] || "bg-gray-50 text-gray-600 ring-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${style}`}
    >
      {status}
    </span>
  );
}

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
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Orders
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {orders.length} {orders.length === 1 ? "order" : "orders"} so far.
          Change the status from the last column.
        </p>
      </div>

      {error && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/70 text-left text-xs font-medium text-gray-500">
            <tr>
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Update status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-14">
                  <div className="flex flex-col items-center text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d={INBOX_PATH}
                        />
                      </svg>
                    </span>
                    <p className="mt-3 font-medium text-gray-900">
                      No orders yet
                    </p>
                    <p className="mt-1 text-gray-500">
                      New orders will show up here as customers check out.
                    </p>
                  </div>
                </td>
              </tr>
            )}

            {orders.map((order) => {
              const customer = order.user?.name || "Unknown";
              const itemCount = order.items?.length || 0;

              return (
                <tr
                  key={order._id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                    #{order._id.slice(-8)}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                        {getInitials(customer)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {customer}
                        </p>
                        {order.user?.email && (
                          <p className="truncate text-xs text-gray-500">
                            {order.user.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-gray-600">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </td>

                  <td className="px-5 py-3.5 font-medium tabular-nums text-gray-900">
                    {formatEGP(order.totalPrice)}
                  </td>

                  <td className="px-5 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="px-5 py-3.5 text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="px-5 py-3.5">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      aria-label={`Update status for order ${order._id.slice(-8)}`}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium capitalize outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 disabled:cursor-wait disabled:opacity-50"
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
