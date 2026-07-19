import React from 'react';
import { motion } from 'framer-motion';
import CategoryButton from './CategoryButton';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <motion.div
      className="flex flex-wrap justify-center gap-6 mb-12 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {categories.map((cat) => {
        const name  = typeof cat === "string" ? cat : cat.name;
        const image = typeof cat === "object" ? cat.image : undefined;
        return (
          <CategoryButton
            key={name}
            name={name}
            image={image}
            isActive={selectedCategory === name}
            onClick={() => onSelectCategory(name)}
          />
        );
      })}
    </motion.div>
  );
};

export default CategoryFilter;
