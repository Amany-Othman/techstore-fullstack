import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  const isFromCheckout = from === "/checkout";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const data = response.data;

      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        isAdmin: data.isAdmin,
      };

      login(userData, data.token);

      navigate(from, { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          {isFromCheckout ? "Login to continue to checkout" : "Welcome Back"}
        </h1>

        <p className="text-gray-500 text-center mt-2">
          {isFromCheckout
            ? "Please log in to complete your purchase."
            : "Login to your account"}
        </p>

        {error && (
          <p className="bg-red-100 text-red-600 px-4 py-3 rounded-lg mt-6 text-sm">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Password */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-teal-500 font-semibold hover:text-teal-600"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
