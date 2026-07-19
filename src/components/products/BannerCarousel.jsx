import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import { useFirestore } from '../../hooks/useFirestore';

const BannerCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  const { data: fsBanners } = useFirestore("banners", [], "order");
  const slides = (fsBanners ?? []).map((b) => ({
    id: b.id,
    imageUrl: b.url,
    alt: b.alt || "Banner",
  }));

  if (slides.length === 0) return null;

  return (
    <div className="w-full bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="relative overflow-hidden group">
          {/* Previous Button */}
          <button 
            className="carousel-prev hidden md:flex absolute top-1/2 left-2 -translate-y-1/2 z-20 justify-center items-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-[#ff7a3d] transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button 
            className="carousel-next hidden md:flex absolute top-1/2 right-2 -translate-y-1/2 z-20 justify-center items-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-[#ff7a3d] transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={1}
            loop={true}
            navigation={{
              prevEl: ".carousel-prev",
              nextEl: ".carousel-next",
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            speed={700}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            className="rounded-xl"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <img
                  src={slide.imageUrl}
                  alt={slide.alt}
                  className="w-full h-[180px] sm:h-[250px] md:h-[300px] lg:h-[400px] xl:h-[500px] object-cover rounded-xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Dotted Pagination */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => swiperInstance?.slideToLoop(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? 'w-6 h-2 bg-[#ec4899]'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;