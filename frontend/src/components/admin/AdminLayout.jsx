import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const ICON_PATHS = {
  dashboard:
    "M3.75 6a2.25 2.25 0 012.25-2.25h12A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
  products:
    "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
  orders:
    "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z",
};

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/admin/products", label: "Products", icon: "products" },
  { to: "/admin/orders", label: "Orders", icon: "orders" },
];

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

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            [
              "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
              isActive
                ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20"
                : "text-gray-300 hover:bg-gray-800 hover:text-white",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                name={link.icon}
                className={`h-5 w-5 shrink-0 ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-300"
                }`}
              />
              <span className="truncate">{link.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-2xl leading-none"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle admin menu"
            >
              ☰
            </button>

            <h1 className="text-lg font-bold">
              Admin <span className="text-teal-400">Panel</span>
            </h1>
          </div>

          <Link
            to="/"
            className="text-sm font-medium text-gray-300 hover:text-white"
          >
            ← Back to store
          </Link>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-800 px-4 py-4">
            <p className="px-3.5 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Manage
            </p>
            {nav}
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-60 shrink-0">
          <div className="sticky top-8 rounded-2xl bg-gray-900 p-4 shadow-sm">
            <p className="px-3.5 pb-3 pt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Manage
            </p>
            {nav}
          </div>
        </aside>

        {/* Page content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
