import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
];

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-teal-500 text-gray-900"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`;

  const nav = (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setIsOpen(false)}
          className={linkClass}
        >
          {link.label}
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
          <div className="md:hidden border-t border-gray-800 px-6 py-3">
            {nav}
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-8 rounded-2xl bg-gray-900 p-3">{nav}</div>
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
