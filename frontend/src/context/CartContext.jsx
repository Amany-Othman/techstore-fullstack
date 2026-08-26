import { createContext, useEffect, useState } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");

    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    const productId = product._id;

    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === productId,
    );

    if (existingItemIndex === -1) {
      const safeQuantity = Math.min(quantity, product.stock);

      setCartItems([
        ...cartItems,
        {
          ...product,
          id: productId,
          quantity: safeQuantity,
        },
      ]);

      return;
    }

    const updatedCart = [...cartItems];
    const existingItem = updatedCart[existingItemIndex];

    const newQuantity = Math.min(
      existingItem.quantity + quantity,
      existingItem.stock,
    );

    existingItem.quantity = newQuantity;

    setCartItems(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.id !== productId);

    setCartItems(updatedCart);
  };

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === productId) {
        const safeQuantity = Math.max(1, Math.min(quantity, item.stock));

        return {
          ...item,
          quantity: safeQuantity,
        };
      }

      return item;
    });

    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };
