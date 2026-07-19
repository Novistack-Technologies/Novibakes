import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

function Stars({ rating = 0, size = 14 }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.floor(rating) ? "currentColor" : "none"}
            className={i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}
          />
        ))}
      </div>
      <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded">
        {rating}
      </span>
    </div>
  );
}

function getStartingWeightPrice(product) {
  const weights = product.weights ?? {};
  const price = weights["500g"] ?? weights["250g"] ?? Object.values(weights)[0];
  const label = weights["500g"] ? "500g" : weights["250g"] ? "250g" : Object.keys(weights)[0];
  return { price, label };
}

const ProductCard = ({ product, onClick, gridView = false, listView = false }) => {

  /* ── List view (mobile Amazon-style) ── */
  if (listView) {
    const { price, label } = getStartingWeightPrice(product);
    return (
      <motion.div
        onClick={onClick}
        className="flex gap-3 bg-white border-b border-gray-100 px-3 py-3 active:bg-pink-50 transition-colors cursor-pointer"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
      >
        {/* Image */}
        <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            {/* Category pill */}
            <span className="inline-block text-[10px] font-semibold text-[#ec4899] bg-pink-50 px-2 py-0.5 rounded-full mb-1">
              {product.category}
            </span>
            {/* Name */}
            <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 mb-1">
              {product.name}
            </p>
            {/* Stars */}
            <Stars rating={product.rating} />
            {/* Description */}
            <p className="text-xs text-slate-400 line-clamp-1 mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>

          {price ? (
            <div className="flex items-baseline gap-1 mt-1.5">
              <span
                className="text-sm font-bold text-slate-900"
                style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}
              >
                ₹{price}
              </span>
              <span className="text-[10px] text-gray-400">/ {label}</span>
            </div>
          ) : null}
        </div>
      </motion.div>
    );
  }

  /* ── Grid view (default) ── */
  const { price, label } = getStartingWeightPrice(product);
  return (
    <motion.div
      onClick={onClick}
      className={`group bg-white border border-orange-200 rounded-2xl shadow-md hover:shadow-xl p-3 transition-all duration-300 hover:scale-105 flex flex-col cursor-pointer ${
        gridView ? "w-full" : "max-w-sm mx-auto"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className="w-full h-40 mb-3 rounded-lg overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="absolute top-4 left-4 bg-[#ec4899] text-white text-xs font-medium px-2 py-1 rounded-full">
          {product.category}
        </div>
      </div>

      <div className="flex-grow text-center">
        <p className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-1">
          {product.name}
        </p>
        <p className="line-clamp-2 text-sm text-slate-800 mb-3">
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-center mb-3">
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
              className={
                i < Math.floor(product.rating)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
        <span className="ml-2 text-xs bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">
          {product.rating}
        </span>
      </div>

      {price ? (
        <div className="text-center mb-4">
          <span className="text-xs text-gray-400 font-medium">{label} — starting at</span>
          <p className="text-base font-bold text-gray-900 mt-0.5" style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
            ₹{price}
          </p>
        </div>
      ) : null}

      <motion.button
        onClick={onClick}
        className="w-full bg-[#ec4899] text-white py-2 rounded-full hover:bg-[#db2777] transition-colors font-medium text-sm shadow-md hover:shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View Details
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;