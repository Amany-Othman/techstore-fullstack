import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { Link } from "react-router-dom";
import api from "../utils/api";

const CATEGORIES = [
  {
    name: "Phones",
    subtitle: "Smartphones & more",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18h.01M8.5 3h7A1.5 1.5 0 0117 4.5v15a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 017 19.5v-15A1.5 1.5 0 018.5 3z"
      />
    ),
  },
  {
    name: "Laptops",
    subtitle: "Work, gaming & more",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 14.25v-9zM2 20h20"
      />
    ),
  },
  {
    name: "Accessories",
    subtitle: "Chargers, cases & more",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 7h10v10H7V7z"
      />
    ),
  },
];

const TRUST_ITEMS = [
  {
    title: "Free Shipping",
    subtitle: "On orders over $50",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h5.61c.483 0 .911.310 1.062.768l1.698 5.098a3 3 0 01.13.874v3.885c0 .621-.504 1.125-1.125 1.125H18.75m-9 0H12"
      />
    ),
  },
  {
    title: "2-Year Warranty",
    subtitle: "On all electronics",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
  },
  {
    title: "24/7 Support",
    subtitle: "Real humans, real fast",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.24 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    ),
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // [] empty dependency array -> this will run after the first render only
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get("/api/products/featured");
        let data = response.data;

        // Nothing featured yet -> fall back to the first 4 products
        // so the Home page never shows a blank gap.
        if (!data || data.length === 0) {
          const fallback = await api.get("/api/products");
          data = fallback.data.slice(0, 4);
        }

        setProducts(data);
      } catch (error) {
        console.log("FETCH ERROR:", error);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
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
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative isolate min-h-[52vh] flex flex-col justify-center items-center text-center gap-6 px-6 pb-20 pt-10 overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1632893037520-7c223d9495f0?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />

        {/* Dark overlay: solid at the very top so it matches the navbar
           with no seam, then fades toward slate-50 at the bottom so the
           hero blends into the page instead of cutting off hard. */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,_rgba(17,24,39,1)_0%,_rgba(17,24,39,0.4)_20%,_rgba(17,24,39,0.55)_65%,_rgba(248,250,252,1)_100%)]" />

        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Next-Gen Electronics
        </h1>

        <p className="text-gray-200 max-w-2xl text-lg">
          Discover the latest electronics built for the way you live, work, and
          play.
        </p>

        <div className="flex gap-4">
          <Link
            to="/products"
            className="bg-teal-500 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-teal-400 transition-colors"
          >
            Shop Now
          </Link>

          <button className="border border-white/30 bg-white/5 text-white font-semibold px-6 py-3 rounded-lg backdrop-blur hover:bg-white/10 transition-colors">
            View Deals
          </button>
        </div>
      </section>

      <div className="px-6 md:px-12 max-w-7xl mx-auto">
        {/* Trust bar — floats up over the hero/content seam */}
        <div className="relative z-10 -mt-16 md:-mt-10 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 rounded-2xl bg-white shadow-xl shadow-gray-900/10 ring-1 ring-gray-100">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 px-6 py-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    {item.icon}
                  </svg>
                </span>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Featured Products
            </h2>

            <Link
              to="/products"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                stock={product.stock}
                category={product.category}
                description={product.description}
              />
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="pb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Shop by Category
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-500 group-hover:text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    {category.icon}
                  </svg>
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {category.subtitle}
                  </p>
                </div>

                <svg
                  className="h-5 w-5 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-teal-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
