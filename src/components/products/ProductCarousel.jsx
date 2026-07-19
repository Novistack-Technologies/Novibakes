import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductCarousel = ({ products, onSelectProduct }) => {
  return (
    <div className="relative px-12 md:px-16">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{ el: ".custom-pagination", clickable: true }}
        navigation={{
          prevEl: ".swiper-button-prev",
          nextEl: ".swiper-button-next",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        className="pb-12"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard
              product={product}
              onClick={() => onSelectProduct(product)}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows - Positioned correctly outside the cards */}
      <button className="swiper-button-prev hidden lg:flex absolute top-1/2 left-0 -translate-y-1/2 z-10 justify-center items-center w-12 h-12 rounded-full bg-white shadow-lg text-pink-600 hover:bg-pink-50 transition-all duration-300">
        <ChevronLeft size={24} />
      </button>
      <button className="swiper-button-next hidden lg:flex absolute top-1/2 right-0 -translate-y-1/2 z-10 justify-center items-center w-12 h-12 rounded-full bg-white shadow-lg text-pink-600 hover:bg-pink-50 transition-all duration-300">
        <ChevronRight size={24} />
      </button>

      <div className="custom-pagination swiper-pagination mt-4 flex justify-center" />
    </div>
  );
};

export default ProductCarousel;