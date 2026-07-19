import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section
      className="relative overflow-hidden py-26"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80  to-black/60" />
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-3xl font-bold md:text-5xl"
          >
            Ready to Sweeten Your Day?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 text-lg leading-relaxed text-pink-100"
          >
            Whether you're celebrating a special occasion or simply craving
            something sweet, we're here to make your moments more memorable
            with our delicious treats.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              to="/order"
              className="rounded-full bg-white px-8 py-3 font-semibold text-pink-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-pink-50"
            >
              Order Now
            </Link>

            <Link
              to="/contactus"
              className="rounded-full border-2 border-white px-8 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-pink-600"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}