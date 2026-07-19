import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, ShoppingCart, Check } from "lucide-react";
import WhatsAppOrderModal from "../../Pages/Whatsapporder";
import { useCart } from "../../context/CartContext";

const ProductModal = ({ product, onClose }) => {
  const weightOptions = product ? Object.keys(product.weights) : [];

  const [selectedWeight, setSelectedWeight] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [weightError, setWeightError] = useState(false);

  const { addToCart } = useCart();

  if (!product) return null;

  const unitPrice = product.weights[selectedWeight] || 0;
  const totalPrice = unitPrice * quantity;
  const DELIVERY_CHARGE = totalPrice >= 1000 ? 0 : 50;
  const grandTotal = totalPrice + DELIVERY_CHARGE;

  const handleAddToCart = () => {
    if (!selectedWeight) {
      setWeightError(true);
      return;
    }
    setWeightError(false);
    addToCart({ ...product, selectedWeight, unitPrice, totalPrice, quantity });
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      onClose();
    }, 1500);
  };

  const handleOrderNow = () => {
    if (!selectedWeight) {
      setWeightError(true);
      return;
    }
    setWeightError(false);
    setShowOrderModal(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          className="relative bg-white shadow-2xl rounded-2xl w-full max-w-[95%] sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto z-10"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative sm:w-1/2 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 sm:h-full object-cover rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
              />
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 sm:w-1/2 flex flex-col">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md text-gray-500 hover:text-gray-800 z-20"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-2 text-[#FF4081]">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < Math.floor(product.rating || 5)
                          ? "currentColor"
                          : "none"
                      }
                      className={
                        i < Math.floor(product.rating || 5)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="ml-2 text-xs bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">
                  {product.rating || 5}
                </span>
              </div>

              {/* Category */}
              {product.category && (
                <div className="mb-3">
                  <span className="text-sm text-gray-500">
                    Category: {product.category}
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-gray-700 mb-5 leading-relaxed">
                {product.description}
              </p>

              {/* Weight Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Your Preferred Size
                  <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {weightOptions.map((w) => (
                    <button
                      key={w}
                      onClick={() => {
                        setSelectedWeight(w);
                        setWeightError(false);
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        selectedWeight === w
                          ? "bg-[#FF4081] text-white border-[#FF4081]"
                          : weightError
                            ? "border-red-400 text-red-400 hover:border-red-500"
                            : "border-gray-300 text-gray-600 hover:border-[#FF4081] hover:text-[#FF4081]"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                {weightError && (
                  <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                    <span>⚠</span> Please select a weight to continue
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition font-bold"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold text-gray-800 min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-[#FFF0F5] rounded-xl px-4 py-3 mb-4 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    <span
                      style={{
                        fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
                      }}
                    >
                      ₹{unitPrice}
                    </span>{" "}
                    × {quantity}
                  </span>

                  <span
                    style={{
                      fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
                    }}
                  >
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery charge</span>

                  <span
                    style={{
                      fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
                    }}
                  >
                    {DELIVERY_CHARGE === 0 ? "Free" : `₹${DELIVERY_CHARGE}`}
                  </span>
                </div>

                <div className="border-t border-pink-200 pt-1.5 flex justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Total
                  </span>

                  <span
                    className="text-xl font-bold text-[#FF4081]"
                    style={{
                      fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
                    }}
                  >
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Success Message */}
              {addedToCart && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-full flex items-center gap-2"
                >
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-medium">
                    Added to cart successfully!
                  </span>
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-auto">
                <motion.button
                  onClick={handleOrderNow}
                  className="flex-1 bg-[#FF4081] text-white px-4 py-3 rounded-full hover:bg-[#FF1F70] transition flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart size={18} />
                  Order Now
                </motion.button>

                <motion.button
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                  className={`flex-1 border px-4 py-3 rounded-full transition font-medium text-sm sm:text-base flex items-center justify-center gap-2 ${
                    addedToCart
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-[#FF4081] text-[#FF4081] hover:bg-[#FFDEF0]"
                  }`}
                  whileHover={{ scale: addedToCart ? 1 : 1.02 }}
                  whileTap={{ scale: addedToCart ? 1 : 0.98 }}
                >
                  {addedToCart ? (
                    <>
                      <Check size={18} /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Add to Cart
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp Modal */}
        {showOrderModal && (
          <WhatsAppOrderModal
            product={{
              name: product.name,
              selectedWeight,
              unitPrice,
              totalPrice,
              grandTotal,
              deliveryCharge: DELIVERY_CHARGE,
              image: product.image,
              quantity,
            }}
            onClose={() => setShowOrderModal(false)}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
