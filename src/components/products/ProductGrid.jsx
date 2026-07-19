import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onSelectProduct }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onClick={() => onSelectProduct(product)}
          gridView={true}
        />
      ))}
    </div>
  );
};

export default ProductGrid;