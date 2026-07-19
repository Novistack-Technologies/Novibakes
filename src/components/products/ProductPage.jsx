import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Check, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { getDocument } from "../../lib/firebase";

// convert Firestore weights array → object shape this page expects
function normalise(p) {
  const weightsObj = {};
  const src = Array.isArray(p.weights)
    ? p.weights
    : Object.entries(p.weights ?? {}).map(([label, price]) => ({ label, price }));
  src.forEach(({ label, price }) => { weightsObj[label] = price; });
  return { ...p, weights: weightsObj };
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [weightError, setWeightError] = useState(false);
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    setLoading(true);
    getDocument("products", id).then((data) => {
      setProduct(data ? normalise(data) : null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-700">Product not found.</p>
        <button
          onClick={() => navigate("/shop")}
          className="text-white px-6 py-2.5 rounded-full font-medium text-sm"
          style={{ backgroundColor: "#ec4899" }}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const weightOptions = Object.keys(product.weights);
  const unitPrice = product.weights[selectedWeight] ?? Object.values(product.weights)[0];
  const displayPrice = selectedWeight ? unitPrice * quantity : unitPrice;


  const handleAddToCart = () => {
    if (!selectedWeight) { setWeightError(true); return; }
    setWeightError(false);
    addToCart({
      ...product,
      selectedWeight,
      unitPrice,
      totalPrice: unitPrice * quantity,
      quantity,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleOrderNow = () => {
    if (!selectedWeight) { setWeightError(true); return; }
    setWeightError(false);
    navigate("/checkout", {
      state: {
        singleProduct: {
          id: product.id,
          name: product.name,
          image: product.image,
          category: product.category,
          weights: product.weights,
          selectedWeight,
          unitPrice,
          quantity,
          totalPrice: unitPrice * quantity,
        },
        fromProduct: true,
      },
    });
  };

  return (
    <div className="min-h-screen bg-white pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* ── Back button ── */}
        <div className="pt-6 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ec4899] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* ── LEFT: Images ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:sticky lg:top-24"
          >
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-50">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
                  
            </div>
          </motion.div>

          {/* ── RIGHT: Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col"
          >
            <span
              className="self-start text-xs font-bold px-3 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: "#fdf2f8", color: "#ec4899", border: "1px solid #ec489940" }}
            >
              {product.category}
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
              {product.name}
            </h1>

            <p className="mt-4 text-slate-700 text-base leading-relaxed">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-200"}
                />
              ))}
              <span className="text-gray-400 text-sm ml-1">{product.rating} Rating</span>
            </div>

            <div className="mt-7">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Select Size <span className="text-red-400">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {weightOptions.map((w) => (
                  <button
                    key={w}
                    onClick={() => { setSelectedWeight(w); setWeightError(false); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                      selectedWeight === w
                        ? "border-[#ec4899] text-white shadow-md"
                        : weightError
                        ? "border-red-400 text-red-400"
                        : "border-gray-200 text-slate-700 hover:border-[#ec4899] hover:text-[#ec4899]"
                    }`}
                    style={selectedWeight === w ? { backgroundColor: "#ec4899" } : {}}
                  >
                    {w}
                  </button>
                ))}
              </div>
              {weightError && (
                <p className="text-red-400 text-xs mt-2">⚠ Please select a size to continue</p>
              )}
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Quantity</p>
                <div className="inline-flex items-center border border-gray-200 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center text-slate-700 hover:bg-gray-100 transition text-xl"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-semibold text-gray-800 text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition text-xl"
                  >
                    +
                  </button>
                </div>
                </div>

               {/* Price */}
                <div className="mt-4 flex items-baseline gap-2">
                  {!selectedWeight && (
                    <span className="text-sm text-gray-400">start from</span>
                  )}
                  <span className="text-3xl font-bold text-slate-800 font-sans leading-none">
                    ₹{displayPrice.toLocaleString("en-IN")}
                  </span>
                  {selectedWeight && quantity > 1 && (
                    <span className="text-sm text-gray-400 font-sans">
                      (₹{unitPrice.toLocaleString("en-IN")} × {quantity})
                    </span>
                  )}
                </div>
              

            {/* Offer card */}
            <div className="mt-6 rounded-2xl p-4 sm:p-5" style={{ backgroundColor: "#FFF7ED" }}>
           <p className="font-semibold text-slate-800 text-sm">Fresh Daily Promise</p>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                All our products are baked fresh every day with premium ingredients. Order before 6 PM for same-day dispatch within the Salem area.
              </p>
            </div>

           {/* Added to cart toast */}
            <AnimatePresence>
              {addedToCart && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2"
                >
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-green-800 text-sm font-semibold">Added to cart!</p>
                    <p className="text-green-600 text-xs mt-0.5">
                      {product.name} ({selectedWeight}) × {quantity} added successfully.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleOrderNow}
                className="flex-1 text-white py-3.5 rounded-full font-semibold text-sm transition-all shadow-md active:scale-95 hover:opacity-90"
                style={{ backgroundColor: "#ec4899" }}
              >
                Order Now
              </button>
              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`flex-1 py-3.5 rounded-full font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 border-2 ${
                  addedToCart
                    ? "bg-green-50 border-green-400 text-green-700"
                    : "bg-slate-900 border-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                {addedToCart ? (
                  <><Check size={16} /> Added</>
                ) : (
                  <><ShoppingCart size={16} /> Add to Cart</>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;