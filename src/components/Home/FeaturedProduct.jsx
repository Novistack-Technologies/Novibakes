import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ProductCard from "../products/ProductCard.jsx";
import { useFirestore } from "../../hooks/useFirestore.js";

// convert Firestore weights array → object shape ProductCard expects
function normalise(p) {
  const weightsObj = {};
  const src = Array.isArray(p.weights)
    ? p.weights
    : Object.entries(p.weights ?? {}).map(([label, price]) => ({ label, price }));
  src.forEach(({ label, price }) => { weightsObj[label] = price; });
  return { ...p, weights: weightsObj };
}

const FEATURED_COUNT = 6;

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const { data: fsProducts, loading } = useFirestore("products", [], "rating");

  // Always re-sorted client-side by rating (desc), so this stays accurate
  // as ratings change in Firestore, regardless of query order direction.
  const featured = useMemo(() => {
    return (fsProducts ?? [])
      .filter((p) => p.available !== false)
      .map(normalise)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, FEATURED_COUNT);
  }, [fsProducts]);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-5 lg:px-10">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-3">
            Our Premium Products
          </h2>
          <div className="h-1 w-16 rounded-full mx-auto mb-4" style={{ backgroundColor: "#ec4899" }} />
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Handcrafted with premium ingredients, baked fresh every day.
          </p>
        </motion.div>

        {/* Product grid using the same ProductCard from shop */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: FEATURED_COUNT }).map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-center text-slate-400 text-sm">No products available right now.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <ProductCard
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                  gridView
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white px-8 py-3 rounded-full font-medium transition shadow-md hover:shadow-lg"
          >
            Explore Full Menu <ChevronRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default FeaturedProducts;