import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('novibakesCart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('novibakesCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    // product must include: id, name, image, category, selectedWeight, unitPrice, quantity
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedWeight === product.selectedWeight
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += product.quantity;
        updated[existingIndex].totalPrice =
          updated[existingIndex].unitPrice * updated[existingIndex].quantity;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          category: product.category,
          weights: product.weights,     
          selectedWeight: product.selectedWeight,
          unitPrice: product.unitPrice,
          quantity: product.quantity,
          totalPrice: product.unitPrice * product.quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId, selectedWeight) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.id === productId && item.selectedWeight === selectedWeight))
    );
  };

  const updateQuantity = (productId, selectedWeight, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, selectedWeight);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId && item.selectedWeight === selectedWeight
          ? { ...item, quantity: newQuantity, totalPrice: item.unitPrice * newQuantity }
          : item
      )
    );
  };

  // Add this inside CartProvider, alongside updateQuantity
const updateWeight = (productId, oldWeight, newWeight) => {
  setCartItems((prev) =>
    prev.map((item) => {
      if (item.id === productId && item.selectedWeight === oldWeight) {
        const newUnitPrice = item.weights[newWeight];
        return {
          ...item,
          selectedWeight: newWeight,
          unitPrice: newUnitPrice,
          totalPrice: newUnitPrice * item.quantity,
        };
      }
      return item;
    })
  );
};
  const clearCart = () =>{
   setCartItems([]);
    localStorage.removeItem('novibakesCart');
  };

  const getCartCount = () => cartItems.reduce((t, i) => t + i.quantity, 0);

  const getCartTotal = () => cartItems.reduce((t, i) => t + i.totalPrice, 0);

  // And expose it in the value:
const value = {
  cartItems, addToCart, removeFromCart,
  updateQuantity, updateWeight,  // ← add updateWeight here
  clearCart, getCartCount, getCartTotal,
};

  return (
  <CartContext.Provider value={{
    cartItems, addToCart, removeFromCart,
    updateQuantity, updateWeight, clearCart, getCartCount, getCartTotal,
  }}>
    {children}
  </CartContext.Provider>
);
};