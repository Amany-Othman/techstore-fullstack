import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();

      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-10">
          <p className="text-teal-500 font-semibold uppercase tracking-wide text-sm">
            Explore our collection
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-2">
            All Products
          </h1>

          <p className="text-gray-500 mt-3">
            Discover the latest tech products at great prices.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              rating={product.rating}
              id={product._id}
              description={product.description}
              category={product.category}
              stock={product.stock}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Products;
