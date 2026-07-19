import React from 'react';
import { testimonials } from "../data/data";
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewsView = () => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          size={20}
        />
      );
    }
    return stars;
  };

  return (
    <div className="pt-24 pb-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        
        {/* Animate heading section */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-4xl font-bold mb-4 text-gray-800">
            Customer <span className="text-pink-600">Reviews</span>
          </h1>
          <div className="h-1 bg-pink-500 mx-auto mb-6 w-20"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read what our customers have to say about their experiences with SweetTooth Bakes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <div className="flex mt-1">{renderStars(testimonial.rating)}</div>
                </div>
              </div>

              <p className="text-gray-600">{testimonial.testimonial}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsView;
