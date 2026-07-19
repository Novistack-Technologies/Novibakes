import React from 'react';

const FALLBACK_IMAGES = {
  Cakes:    'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400',
  Brownies: 'https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg?auto=compress&cs=tinysrgb&w=400',
  Cupcakes: 'https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=400',
};

const CategoryButton = ({ name, image, isActive, onClick }) => {
  const getImageUrl = () =>
    image || FALLBACK_IMAGES[name] || FALLBACK_IMAGES.Cakes;

  return (
    <button
      onClick={onClick}
      className={`relative w-28 h-28 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden ${
        isActive
          ? 'ring-4 ring-[#ec4899] shadow-xl shadow-pink-100'
          : 'ring-2 ring-gray-200 hover:ring-amber-200 shadow-lg hover:shadow-xl'
      }`}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <img
          src={getImageUrl()}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 rounded-full ${
          isActive
            ? 'bg-pink-500/20'
            : 'bg-black/10 hover:bg-pink-500/10'
        }`} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-full p-2">
        <span className="text-xs font-semibold text-white leading-tight text-center block">
          {name}
        </span>
      </div>

      {isActive && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-[#ec4899] rounded-full border-2 border-white shadow-sm" />
      )}
    </button>
  );
};

export default CategoryButton;
