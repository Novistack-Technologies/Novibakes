import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";

const PremiumCTA = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-20 relative overflow-hidden w-full bg-[#fdf2f8]"
    >
      {/* soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #f9a8d4 0%, transparent 70%)" }} />

      {/* dot pattern */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "radial-gradient(circle, #ec4899 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-[#be185d] text-sm font-semibold uppercase tracking-widest mb-4">
          Freshly Baked Happiness
        </span>

        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-6">
          Crafted With Passion,<br />Baked To Perfection
        </h2>

        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          From custom celebration cakes to daily fresh bakes, we create desserts that make
          every moment special. Place your order today and experience premium handcrafted baking.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contactus">
            <button className="group flex justify-center items-center w-full sm:w-auto border-2 text-slate-700 px-8 py-3 rounded-full font-medium hover:bg-white transition-all duration-300"
              style={{ borderColor: "#ec489950" }}>
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </Link>

          <a href={`https://wa.me/91${import.meta.env.VITE_BAKERY_WHATSAPP}`} target="_blank" rel="noopener noreferrer">
            <button
              className="flex justify-center items-center w-full sm:w-auto text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:scale-105 hover:opacity-90"
              style={{ backgroundColor: "#ec4899" }}
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat on WhatsApp
            </button>
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default PremiumCTA;
