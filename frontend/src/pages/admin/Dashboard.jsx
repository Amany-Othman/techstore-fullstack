import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../utils/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

/* ---------- helpers ---------- */

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

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  processing: "bg-sky-50 text-sky-700 ring-sky-200",
  shipped: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 ring-rose-200",
};

const ICON_PATHS = {
  products:
    "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
  orders:
    "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z",
  users:
    "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
  revenue:
    "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z",
  warning:
    "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
  inbox:
    "M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z",
};

function Icon({ name, className = "h-5 w-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={ICON_PATHS[name]} />
    </svg>
  );
}

/* ---------- components ---------- */

function StatCard({ label, value, icon, featured = false }) {
  if (featured) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-teal-600 p-6 text-white shadow-md shadow-teal-600/20">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-teal-50">{label}</p>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <Icon name={icon} />
          </span>
        </div>
        <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70 transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          <Icon name={icon} />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const style =
    STATUS_STYLES[status?.toLowerCase()] ||
    "bg-gray-50 text-gray-600 ring-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${style}`}
    >
      {status}
    </span>
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
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          A quick look at how your store is doing.
        </p>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          featured
          label="Total revenue"
          value={formatEGP(stats.totalRevenue)}
          icon="revenue"
        />
        <StatCard
          label="Total orders"
          value={stats.totalOrders.toLocaleString()}
          icon="orders"
        />
        <StatCard
          label="Total products"
          value={stats.totalProducts.toLocaleString()}
          icon="products"
        />
        <StatCard
          label="Total users"
          value={stats.totalUsers.toLocaleString()}
          icon="users"
        />
      </div>

      {/* Low stock alert */}
      {stats.lowStock > 0 && (
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-900 ring-1 ring-amber-200"
        >
          <span className="mt-0.5 text-amber-600">
            <Icon name="warning" className="h-5 w-5" />
          </span>
          <p>
            <span className="font-semibold">
              {stats.lowStock} product{stats.lowStock === 1 ? "" : "s"}
            </span>{" "}
            {stats.lowStock === 1 ? "has" : "have"} fewer than{" "}
            {stats.lowStockThreshold} in stock.{" "}
            <Link
              to="/admin/products"
              className="font-semibold underline underline-offset-2 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 rounded"
            >
              Review products
            </Link>
          </p>
        </div>
      )}

      {/* Recent orders */}
      <div className="mt-10 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Recent orders</h3>
        <Link
          to="/admin/orders"
          className="rounded text-sm font-medium text-teal-600 hover:text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
        >
          View all orders
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70">
        <table className="w-full min-w-[560px] text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/70 text-left text-xs font-medium text-gray-500">
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
                <td colSpan={4} className="px-5 py-14">
                  <div className="flex flex-col items-center text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                      <Icon name="inbox" className="h-6 w-6" />
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

            {stats.recentOrders.map((order) => {
              const customer = order.user?.name || "Unknown";

              return (
                <tr
                  key={order._id}
                  className="transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                        {getInitials(customer)}
                      </span>
                      <span className="font-medium text-gray-900">
                        {customer}
                      </span>
                    </div>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
