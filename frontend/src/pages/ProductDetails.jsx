import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { CartContext } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Image */}
            <div className="bg-gray-100 flex items-center justify-center p-8 md:p-12">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-lg h-[400px] object-contain rounded-xl"
              />
            </div>

            {/* Product Information */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {/* Category */}
              <span className="text-teal-500 font-semibold text-sm uppercase tracking-wide">
                {product.category}
              </span>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">
                <span className="text-yellow-500 text-lg">⭐</span>

                <span className="font-semibold text-gray-800">
                  {product.rating}
                </span>

                <span className="text-gray-400">/ 5</span>
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-teal-500 mt-6">
                {product.price.toLocaleString()} EGP
              </p>

              {/* Description */}
              <p className="text-gray-600 leading-7 mt-6">
                {product.description}
              </p>

              {/* Stock */}
              <div className="mt-6">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                    ✓ {product.stock} items available
                  </span>
                ) : (
                  <span className="inline-flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                    Out of stock
                  </span>
                )}
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mt-8">
                  <span className="font-semibold text-gray-800">Quantity:</span>

                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1);
                        }
                      }}
                      className="w-10 h-10 text-xl font-semibold text-gray-700 hover:bg-gray-100 transition"
                    >
                      -
                    </button>

                    <span className="w-12 text-center font-semibold text-gray-900">
                      {quantity}
                    </span>

                    <button
                      onClick={() => {
                        if (quantity < product.stock) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      className="w-10 h-10 text-xl font-semibold text-gray-700 hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className="w-full mt-8 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
