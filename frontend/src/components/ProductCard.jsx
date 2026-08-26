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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Product Image */}
      <div className="bg-gray-50 h-56 flex items-center justify-center p-5">
        <img src={image} alt={name} className="w-full h-full object-contain" />
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

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 min-h-10">
          {description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-yellow-500">⭐</span>

          <span className="text-sm font-semibold text-gray-700">{rating}</span>
        </div>

        {/* Price + Stock */}
        <div className="flex items-center justify-between mt-4">
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
