import { Link } from "react-router-dom";

import { useContext, useEffect, useRef, useState } from "react";

import { AuthContext } from "../context/AuthContext";

import { CartContext } from "../context/CartContext";

function Navbar() {
  // For the mobile menu
  const [isOpen, setIsOpen] = useState(false);

  // For the user dropdown
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  const { user, logout } = useContext(AuthContext);

  const { cartCount } = useContext(CartContext);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsOpen(false);
  };

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the dropdown on Escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") setIsUserMenuOpen(false);
    }

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const initials = user?.name
    ? user.name
        .trim()
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <nav className="relative z-50 bg-gray-900 text-white px-6 py-4">
      <style>{`
        @keyframes navUserMenuIn {
          from { opacity: 0; transform: translateY(-4px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-teal-400">
          TechStore
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-200 hover:text-white transition-colors"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-gray-200 hover:text-white transition-colors"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="relative text-sm font-medium text-gray-200 hover:text-white transition-colors"
          >
            Cart
            <span className="absolute -top-2 -right-4 bg-teal-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
              {cartCount}
            </span>
          </Link>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isUserMenuOpen}
                className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-gray-800 transition-colors"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-gray-900 ring-2 ring-gray-700">
                  {initials}
                </span>

                <span className="text-sm font-medium text-gray-100 max-w-[10rem] truncate">
                  {user.name}
                </span>

                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white text-gray-900 shadow-xl shadow-black/10 ring-1 ring-black/5 overflow-hidden"
                  style={{ animation: "navUserMenuIn 130ms ease-out" }}
                >
                  {/* Caret connecting the menu to the avatar */}
                  <span className="absolute -top-1.5 right-5 h-3 w-3 rotate-45 bg-white ring-1 ring-black/5" />

                  <div className="relative flex items-center gap-3 px-4 py-4 bg-gray-50/80">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-gray-900">
                      {initials}
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user.name}
                      </p>

                      {user.email && (
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="relative py-1.5">
                    <Link
                      to="/orders"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                      My Orders
                    </Link>

                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-teal-600 hover:bg-gray-50"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  <div className="relative py-1.5 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-teal-400 transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-3 mt-4">
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>

          <Link to="/products" onClick={() => setIsOpen(false)}>
            Products
          </Link>

          <Link to="/cart" onClick={() => setIsOpen(false)}>
            Cart ({cartCount})
          </Link>

          {user ? (
            <>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-500 text-sm font-semibold text-gray-900">
                  {initials}
                </span>

                <span className="text-sm font-medium">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="text-left text-sm text-red-400"
              >
                Log out
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
