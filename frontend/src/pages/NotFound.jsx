import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-teal-500">404</h1>

        <h2 className="text-2xl font-semibold text-gray-900 mt-4">
          Page not found
        </h2>

        <p className="text-gray-500 mt-2">
          Sorry, the page you're looking for doesn't exist.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-teal-500 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          Go Back Home
        </button>
      </div>
    </main>
  );
}

export default NotFound;
