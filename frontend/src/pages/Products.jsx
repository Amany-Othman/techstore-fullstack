import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  //use effect : nfz el code dh ka side effect b3d mal component ytrsm
  // lma el page tft7 make a request enk t fetch el data
  // []); -> shghl el effect lma el component yzhr l awl mra
  // lakn msh kol ma el page t re-render
  useEffect(() => {
    const fetchProducts = async () => {
      // req to the BE on this url to fetch the products
      const response = await fetch("/api/products");
      //fetch bt return response object msh el data la tol f lazem .json()
      const data = await response.json();

      setProducts(data);
    };

    fetchProducts();
  }, []);
  return (
    <div>
      <h1>Products</h1>

      <div>
        {products.map((product) => {
          return (
            <ProductCard
              image={product.image}
              name={product.name}
              price={product.price}
              rating={product.rating}
              id={product._id}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Products;
