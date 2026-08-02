import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const user = null;

  return (
    <nav className="bg-gray-900 text-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-teal-400">
          TechStore
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>

          <Link to="/cart" className="relative">
            Cart
            <span className="absolute -top-2 -right-4 bg-teal-500 text-xs rounded-full px-2">
              0
            </span>
          </Link>

          {user ? (
            <>
              <span>{user.name}</span>
              <button>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
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
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>

          {user ? (
            <>
              <span>{user.name}</span>
              <button>Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
