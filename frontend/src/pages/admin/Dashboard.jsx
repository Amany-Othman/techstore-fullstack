import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${accent || "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/admin/stats");
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Overview</h2>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Products" value={stats.totalProducts} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard
          label="Total Revenue"
          value={`${stats.totalRevenue.toLocaleString()} EGP`}
          accent="text-teal-600"
        />
      </div>

      {stats.lowStock > 0 && (
        <div className="mt-6 rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-800 ring-1 ring-amber-200">
          {stats.lowStock} product{stats.lowStock === 1 ? "" : "s"} below{" "}
          {stats.lowStockThreshold} in stock —{" "}
          <Link to="/admin/products" className="font-semibold underline">
            review them
          </Link>
        </div>
      )}

      {/* Recent orders */}
      <h3 className="mt-10 text-lg font-semibold text-gray-900">
        Recent orders
      </h3>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {stats.recentOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            )}

            {stats.recentOrders.map((order) => (
              <tr key={order._id}>
                <td className="px-5 py-3 font-medium text-gray-900">
                  {order.user?.name || "Unknown"}
                </td>
                <td className="px-5 py-3">
                  {order.totalPrice.toLocaleString()} EGP
                </td>
                <td className="px-5 py-3 capitalize">{order.status}</td>
                <td className="px-5 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
