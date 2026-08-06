import { Link } from "react-router-dom";

function ProductCard({ image, name, price, rating, id }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
      <img src={image} alt={name} className="w-full h-52 object-cover" />

      <div className="p-4">
        <h2 className="text-lg font-semibold">{name}</h2>

        <p className="text-teal-500 font-bold mt-2">${price}</p>

        <p className="text-yellow-500 mt-2">⭐ {rating}</p>

        <div className="flex gap-3 mt-4">
          <Link
            to={`/products/${id}`}
            className="flex-1 bg-teal-500 text-white text-center py-2 rounded-lg"
          >
            View Details
          </Link>

          <button className="flex-1 bg-gray-900 text-white py-2 rounded-lg">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
