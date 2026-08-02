import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">About</h3>
          <p>
            TechStore is your destination for modern electronics and
            accessories.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Links</h3>

          <div className="flex flex-col gap-2">
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Contact</h3>

          <p>Email: support@techstore.com</p>
          <p>Phone: +20 100 000 0000</p>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-sm">
        © 2026 TechStore. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
