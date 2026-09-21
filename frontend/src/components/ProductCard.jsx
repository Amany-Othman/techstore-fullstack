import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
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
  const { cartItems, addToCart, updateQuantity, removeFromCart } =
    useContext(CartContext);

  const cartItem = cartItems.find((item) => item.id === id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  // Brief "just added" pulse — purely visual, resets itself, never
  // duplicates cart state (quantityInCart above is always the source of truth).
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;

    const timeout = setTimeout(() => setJustAdded(false), 900);
    return () => clearTimeout(timeout);
  }, [justAdded]);

  const handleAdd = () => {
    addToCart({ _id: id, image, name, price, stock }, 1);
    setJustAdded(true);
  };

  const handleIncrease = () => {
    if (quantityInCart >= stock) return;
    updateQuantity(id, quantityInCart + 1);
  };

  const handleDecrease = () => {
    if (quantityInCart <= 1) {
      removeFromCart(id);
      return;
    }
    updateQuantity(id, quantityInCart - 1);
  };

  const atMaxStock = quantityInCart >= stock;

  return (
    <div
      className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border ${
        quantityInCart > 0
          ? "border-teal-300 ring-1 ring-teal-100"
          : "border-gray-100 hover:border-teal-200"
      } hover:-translate-y-0.5`}
    >
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

        {/* "In cart" badge — quiet confirmation visible without touching the Navbar */}
        {quantityInCart > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-teal-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            {quantityInCart} in cart
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

          {/* Add button vs. quantity stepper — same footprint, so the
             layout doesn't jump when it swaps. */}
          {quantityInCart === 0 ? (
            <button
              onClick={handleAdd}
              disabled={stock === 0}
              className={`flex-1 font-semibold py-2.5 rounded-xl transition text-white ${
                stock === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600"
              }`}
            >
              {stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          ) : (
            <div
              className={`flex-1 flex items-center justify-between bg-teal-500 rounded-xl overflow-hidden transition-transform duration-300 ${
                justAdded ? "scale-105" : "scale-100"
              }`}
            >
              <button
                onClick={handleDecrease}
                aria-label="Decrease quantity"
                className="h-full px-3.5 py-2.5 text-white text-lg font-bold hover:bg-teal-600 transition"
              >
                −
              </button>

              <span className="text-white font-semibold min-w-[1.5rem] text-center">
                {quantityInCart}
              </span>

              <button
                onClick={handleIncrease}
                disabled={atMaxStock}
                aria-label="Increase quantity"
                className={`h-full px-3.5 py-2.5 text-white text-lg font-bold transition ${
                  atMaxStock
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-teal-600"
                }`}
              >
                +
              </button>
            </div>
          )}
        </div>

        {atMaxStock && quantityInCart > 0 && (
          <p className="text-xs text-gray-400 mt-2 text-right">
            Max available quantity reached
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
