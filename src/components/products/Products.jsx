import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CategoryFilter from "./CategoryFilter";
import ProductGrid from "./ProductGrid";
import { useFirestore } from "../../hooks/useFirestore";
import { getCollection } from "../../lib/firebase";

function normalise(p) {
  const weightsObj = {};
  const src = Array.isArray(p.weights)
    ? p.weights
    : Object.entries(p.weights ?? {}).map(([label, price]) => ({ label, price }));
  src.forEach(({ label, price }) => { weightsObj[label] = price; });
  return { ...p, weights: weightsObj };
}

const Products = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ── Firestore: products (live) ──
  const { data: fsProducts, loading } = useFirestore("products", [], "name");
  const products = useMemo(
    () => (fsProducts ?? []).filter((p) => p.available !== false).map(normalise),
    [fsProducts]
  );

  // ── Firestore: categories (one-time fetch, filtered by occupied categories) ──
  const [rawCategoryDocs, setRawCategoryDocs] = useState([]);
  useEffect(() => {
    getCollection("categories", "order")
      .then(docs => {
        if (docs.length)
          setRawCategoryDocs(docs.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)));
      })
      .catch(() => {});
  }, []);

  const categories = useMemo(() => {
    const occupiedCats = new Set(products.map(p => p.category));
    if (rawCategoryDocs.length) {
      return [
        { name: "All", image: null },
        ...rawCategoryDocs
          .filter(c => occupiedCats.has(c.name))
          .map(c => ({ name: c.name, image: c.image })),
      ];
    }
    // fallback: derive from products when Firestore categories not yet loaded
    return [
      "All",
      ...[...new Set(products.map(p => p.category))].filter(Boolean),
    ];
  }, [rawCategoryDocs, products]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const displayedProducts = filteredProducts.slice(0, 10);

  const handleCategoryChange = (category) => setSelectedCategory(category);
  const handleProductSelect = (product) => navigate(`/product/${product.id}`);
  const handleViewAll = () => navigate("/shop/all");

  return (
    <motion.div
      className="product-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <section id="products" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pt-5">
          <motion.h1
            className="text-center text-3xl md:text-4xl font-bold text-slate-800 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Products
          </motion.h1>

          <motion.p
            className="text-center text-lg text-gray-600 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore our delicious range of freshly baked treats, made with love
            and premium ingredients.
          </motion.p>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500 text-lg">Loading products...</p>
            </div>
          ) : (
            <>
              <div className="mt-8">
                <ProductGrid
                  products={displayedProducts}
                  onSelectProduct={handleProductSelect}
                />
              </div>

              {filteredProducts.length > 6 && (
                <div className="flex justify-center mt-12">
                  <motion.button
                    className="px-8 py-3 bg-[#ec4899] text-white font-semibold rounded-full hover:bg-[#db2777] transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={handleViewAll}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    View All Products
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default Products;