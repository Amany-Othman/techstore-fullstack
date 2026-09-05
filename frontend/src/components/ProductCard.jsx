import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({
  image,
  name,
  price,
  rating,
  id,
  description,
  category,
  stock,
}) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-teal-200 hover:-translate-y-0.5">
      {/* Product Image — fixed square crop so every card lines up
         regardless of the source photo's orientation */}
      <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-900 text-white">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">
          {category}
        </p>

        {/* Name */}
        <h2 className="text-lg font-bold text-gray-900 mt-2 line-clamp-1">
          {name}
        </h2>

        {/* Description — only takes up space if there actually is one */}
        {description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-3">
          <svg
            className="h-4 w-4 text-amber-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.446a1 1 0 00-.363 1.118l1.287 3.957c.3.922-.755 1.688-1.538 1.118l-3.367-2.446a1 1 0 00-1.176 0l-3.367 2.446c-.783.57-1.838-.196-1.538-1.118l1.287-3.957a1 1 0 00-.363-1.118L2.063 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.958z" />
          </svg>

          <span className="text-sm font-semibold text-gray-700">{rating}</span>
        </div>

        {/* Price + Stock */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p className="text-xl font-bold text-teal-500">
            {price.toLocaleString()} EGP
          </p>

          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              stock > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-5">
          <Link
            to={`/products/${id}`}
            className="flex-1 text-center border border-teal-500 text-teal-500 hover:bg-teal-50 font-semibold py-2.5 rounded-xl transition"
          >
            View Details
          </Link>

          <button
            onClick={() =>
              addToCart(
                {
                  _id: id,
                  image,
                  name,
                  price,
                  stock,
                },
                1,
              )
            }
            disabled={stock === 0}
            className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition"
          >
            {stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
