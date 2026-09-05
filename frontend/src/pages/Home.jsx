import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
// [] empty dependency array -> this will run after the first render only 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Fetching started");

        const response = await fetch("/api/products");

        console.log("Response:", response);

        const data = await response.json();
        console.log(data);

        console.log("Data:", data);

        setProducts(data.slice(0, 4));
      } catch (error) {
        console.log("FETCH ERROR:", error);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col justify-center items-center text-center gap-6">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Next-Gen Electronics
        </h1>

        <p className="text-gray-600 max-w-2xl text-lg">
          Discover the latest electronics built for the way you live, work, and
          play.
        </p>

        <div className="flex gap-4">
          <Link
            to="/products"
            className="bg-teal-500 text-white px-6 py-3 rounded-lg"
          >
            Shop Now
          </Link>

          <button className="bg-gray-900 text-white px-6 py-3 rounded-lg">
            View Deals
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              rating={product.rating}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-16 mb-10">
        <h2 className="text-2xl font-semibold mb-6">Shop by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/products?category=Phones"
            className="bg-gray-900 text-white p-8 rounded-lg text-center text-xl font-semibold"
          >
            Phones
          </Link>

          <Link
            to="/products?category=Laptops"
            className="bg-gray-900 text-white p-8 rounded-lg text-center text-xl font-semibold"
          >
            Laptops
          </Link>

          <Link
            to="/products?category=Accessories"
            className="bg-gray-900 text-white p-8 rounded-lg text-center text-xl font-semibold"
          >
            Accessories
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
