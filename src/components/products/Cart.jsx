import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Plus, Minus, ShoppingCart, ChevronDown, Tag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

// ── WeightDropdown — defined OUTSIDE Order ──
const WeightDropdown = ({ item, onWeightChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs bg-[#FBF0E0] text-[#ec4899] border border-pink-200 pl-2.5 pr-2 py-1 rounded-full font-medium hover:bg-[#FBF0E0] transition-colors"
      >
        {item.selectedWeight} —{" "}
        <span style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
          ₹{item.weights[item.selectedWeight]}
        </span>
        <ChevronDown size={10} className="text-[#ec4899]" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop to close on outside click */}
            <div
              className="fixed inset-0 z-20"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-1 z-30 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden min-w-[140px]"
            >
              {Object.keys(item.weights).map((w) => (
                <button
                  key={w}
                  onClick={() => { onWeightChange(w); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between gap-4 hover:bg-[#FBF0E0] transition-colors ${
                    item.selectedWeight === w
                      ? "bg-[#FBF0E0] text-[#ec4899] font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  <span>{w}</span>
                  <span style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
                    ₹{item.weights[w]}
                  </span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Order ──
const Order = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, updateWeight } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal >= 1000 ? 0 : 50;
  const total = subtotal + deliveryFee;

  return (
    <div className="pt-20 md:pt-24 pb-12 md:pb-20 bg-neutral-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-bold mb-3 text-gray-800"
          >
            Your <span className="text-[#ec4899]">Cart</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto"
          >
            Review your items and proceed to checkout
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">

          {/* ── Cart Items ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Cart Items
                  <span className="ml-2 text-sm font-normal text-gray-400">({cartItems.length})</span>
                </h2>
                {cartItems.length > 0 && (
                  <button onClick={clearCart}
                    className="text-xs sm:text-sm text-[#ec4899] hover:text-[#db2777] font-medium transition-colors">
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {cartItems.length > 0 ? cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -80 }}
                      className="border border-gray-100 rounded-xl p-3 sm:p-4 hover:border-pink-200 hover:bg-[#FBF0E0]/30 transition-all"
                    >
                      <div className="flex gap-3">
                        <img src={item.image} alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0" />

                        <div className="flex-1 min-w-0">

                          {/* Name + Delete */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-sm sm:text-base text-gray-800 leading-snug line-clamp-2">
                                {item.name}
                              </h3>
                              <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.selectedWeight)}
                              className="p-1.5 rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Weight Selector */}
                          {item.weights && (
                            <div className="mt-2">
                              <WeightDropdown
                                item={item}
                                onWeightChange={(newWeight) =>
                                  updateWeight(item.id, item.selectedWeight, newWeight)
                                }
                              />
                            </div>
                          )}

                          {/* Qty + Price row */}
                          <div className="flex items-center justify-between mt-3 gap-1">
                            <span className="text-xs text-gray-500 flex-shrink-0"
                              style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
                              ₹{item.unitPrice}
                            </span>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedWeight, item.quantity - 1)}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#E8920A] hover:bg-[#FBF0E0] transition-colors"
                              >
                                <Minus size={11} className="text-gray-600" />
                              </button>
                              <span className="w-5 text-center text-sm font-semibold text-gray-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.selectedWeight, item.quantity + 1)}
                                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#E8920A] hover:bg-[#FBF0E0] transition-colors"
                              >
                                <Plus size={11} className="text-gray-600" />
                              </button>
                            </div>

                            <span className="text-sm font-bold text-[#ec4899] flex-shrink-0"
                              style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
                              ₹{item.totalPrice}
                            </span>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="text-center py-16">
                      <ShoppingCart className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium mb-1">Your cart is empty</p>
                      <p className="text-gray-400 text-sm">Add some delicious treats to get started!</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ── Order Summary ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-lg sm:text-xl font-semibold text-center mb-5 text-gray-800">
                Order Summary
              </h2>

              {cartItems.length > 0 ? (
                <>
                  <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.id}
                        className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img src={item.image} alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.name}</p>
                            <p className="text-xs text-gray-400">{item.selectedWeight} × {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-800 flex-shrink-0"
                          style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
                          ₹{item.totalPrice}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 pt-4 space-y-2.5">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        Delivery Fee
                        {deliveryFee === 0 && (
                          <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full font-medium">
                            FREE
                          </span>
                        )}
                      </span>
                      <span style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}
                        className={deliveryFee === 0 ? "line-through text-gray-400" : ""}>
                        ₹50
                      </span>
                    </div>

                    {subtotal < 1000 && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Tag size={11} className="text-[#ec4899]" />
                          <p className="text-[11px] text-amber-700 font-medium">
                            Add ₹{1000 - subtotal} more for free delivery!
                          </p>
                        </div>
                        <div className="w-full bg-amber-100 rounded-full h-1.5">
                          <div className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }} />
                        </div>
                      </div>
                    )}

                    {subtotal >= 1000 && (
                      <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-center gap-2">
                        <Tag size={11} className="text-green-500" />
                        <p className="text-[11px] text-green-700 font-medium">🎉 You got free delivery!</p>
                      </div>
                    )}

                    <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-100 text-gray-800">
                      <span>Total</span>
                      <span style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>₹{total}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full mt-5 py-3 rounded-full bg-[#ec4899] hover:bg-[#db2777] active:scale-95 text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    Place Order via WhatsApp
                  </button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm">No items in cart</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default Order;