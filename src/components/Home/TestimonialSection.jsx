import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import maleAvatar from "../../assets/vector/Male.jpg";
import femaleAvatar from "../../assets/vector/Female.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Kavitha R.",
      gender: "female",
      text: "Ordered a custom birthday cake for my son and it was absolutely perfect. The design was exactly what I asked for and everyone at the party loved it. Will order again!",
      rating: 5,
    },
    {
      id: 2,
      name: "Suresh M.",
      gender: "male",
      text: "The chocolate truffle cake was rich and fresh — you could tell it was baked the same day. Delivery was on time and the packaging was very neat. Highly recommend NoviBakes.",
      rating: 5,
    },
    {
      id: 3,
      name: "Deepa S.",
      gender: "female",
      text: "I've ordered three times now and each time the quality is consistent. The rasmalai cake is something else — my whole family keeps requesting it for every occasion!",
      rating: 5,
    },
    {
      id: 4,
      name: "Arun K.",
      gender: "male",
      text: "Placed a bulk order for our office event and the team handled it so professionally. Cakes arrived fresh, well packed, and the taste was loved by everyone. Great service.",
      rating: 4,
    },
    {
      id: 5,
      name: "Preethi V.",
      gender: "female",
      text: "Gifted a NoviBakes cake to my best friend on her anniversary. She was thrilled! The rose milk cake was moist, flavourful, and the presentation was premium. Worth every rupee.",
      rating: 5,
    },
    {
      id: 6,
      name: "Manikandan T.",
      gender: "male",
      text: "Quick response on WhatsApp, easy ordering, and the cake was delivered exactly on time. The black forest was spot on — not too sweet and incredibly fresh. 10/10!",
      rating: 5,
    },
    {
      id: 7,
      name: "Sangeetha L.",
      gender: "female",
      text: "What I love most is the customisation. They listened to every detail for my daughter's cake — the theme, colour, message. It turned out even better than I imagined.",
      rating: 5,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(nextTestimonial, 4000);
  };

  useEffect(() => {
    timerRef.current = setInterval(nextTestimonial, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handlePrev = () => { prevTestimonial(); resetTimer(); };
  const handleNext = () => { nextTestimonial(); resetTimer(); };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            What Our Customers Say
          </h2>

          <p className="max-w-2xl mx-auto text-slate-800 text-base md:text-lg">
            Don&apos;t just take our word for it — here&apos;s what our happy
            customers have to say about NoviBakes.
          </p>
        </div>

        {/* ── Mobile: single card + arrows below (unchanged) ── */}
        <div className="md:hidden">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
            <div className="w-full bg-gradient-to-br from-[#fdf2f8] to-[#fdf2f8] rounded-3xl p-6 shadow-xl border border-rose-50">
              <div className="flex flex-col items-center">
                <img
                  src={testimonials[currentIndex].gender === "female" ? femaleAvatar : maleAvatar}
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mb-4"
                />
                <h4 className="text-lg font-semibold text-[#ec4899]">{testimonials[currentIndex].name}</h4>
                <span className="text-sm text-[#ec4899] mt-1 text-center">Crafted for Sweet Memories</span>
                <div className="flex justify-center mb-3 pt-3">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-[#ec4899] fill-[#ec4899]" />
                  ))}
                  {[...Array(5 - testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i + testimonials[currentIndex].rating} className="h-5 w-5 text-[#ec4899]" />
                  ))}
                </div>
                <p className="text-center text-slate-800 text-base italic leading-relaxed mb-4 max-w-2xl mx-auto">
                  "{testimonials[currentIndex].text}"
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={handlePrev} className="bg-white border border-[#ec4899] rounded-full p-2 shadow-md">
              <ChevronLeft className="h-4 w-4 text-[#ec4899]" />
            </button>
            <button onClick={handleNext} className="bg-white border border-[#ec4899] rounded-full p-2 shadow-md">
              <ChevronRight className="h-4 w-4 text-[#ec4899]" />
            </button>
          </div>
        </div>

        {/* ── Desktop: 3 cards side by side with arrows ── */}
        <div className="hidden md:flex items-center justify-center gap-5 max-w-6xl mx-auto">
          <button
            onClick={handlePrev}
            className="shrink-0 bg-white border border-rose-50 rounded-full p-2 shadow-md hover:bg-[#ec4899] hover:text-white hover:shadow-lg transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4 text-[#ec4899]" />
          </button>

          <div className="flex-1 grid grid-cols-3 gap-4">
            {[0, 1, 2].map((offset) => {
              const idx = (currentIndex + offset) % testimonials.length;
              const t = testimonials[idx];
              const isCenter = offset === 1;
              return (
                <div
                  key={t.id}
                  className={`bg-gradient-to-br from-[#fdf2f8] to-[#fdf2f8] rounded-3xl p-6 border border-rose-50 flex flex-col items-center text-center transition-all duration-300 ${
                    isCenter ? "shadow-xl scale-105" : "shadow-md opacity-80"
                  }`}
                >
                  <img
                    src={t.gender === "female" ? femaleAvatar : maleAvatar}
                    alt={t.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md mb-3"
                  />
                  <h4 className="text-base font-semibold text-slate-700">{t.name}</h4>
                  <span className="text-xs text-slate-700 mt-1">Crafted for Sweet Memories</span>
                  <div className="flex justify-center mt-2 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    ))}
                    {[...Array(5 - t.rating)].map((_, i) => (
                      <Star key={i + t.rating} className="h-4 w-4 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm italic leading-relaxed">"{t.text}"</p>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            className="shrink-0 bg-white border border-[#ec4899] rounded-full p-2 shadow-md hover:bg-[#ec4899] hover:shadow-lg transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4 text-[#ec4899]" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="mt-10 flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => { setCurrentIndex(index); resetTimer(); }}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-[#ec4899]"
                  : "w-3 bg-[#ec4899] opacity-40 hover:opacity-70"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
