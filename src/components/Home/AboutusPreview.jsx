import React from 'react';
import { Link } from 'react-router-dom';
import { aboutUsInfo, featureCards, galleryImages } from '../../data/data';
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const AboutUs = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative order-1"
          >
            {/* accent blobs behind image */}
            <div className="absolute -top-5 -left-5 w-56 h-56 rounded-2xl bg-[#fdf2f8] -z-10" />
            <div className="absolute -bottom-5 -right-5 w-56 h-56 rounded-2xl bg-[#fdf2f8] -z-10" />

            <img
              src={galleryImages.preview.src}
              alt={galleryImages.preview.alt}
              className="w-full h-[320px] md:h-[440px] object-cover rounded-2xl shadow-lg relative z-10"
              loading="lazy"
            />

            {/* floating badge */}
            <div className="absolute bottom-6 left-6 z-20 bg-white rounded-xl shadow-md px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#fdf2f8" }}>
                <span className="text-lg">🎂</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">500+ Happy Customers</p>
                <p className="text-[10px] text-slate-400">Salem City & Beyond</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="order-2"
          >
            {/* <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full mb-5"
              style={{ backgroundColor: "#fdf2f8", color: "#ec4899" }}>
              Our Story
            </span> */}

            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800 leading-tight">
              About <span style={{ color: "#ec4899" }}>NoviBakes</span>
            </h2>

            <div className="h-1 w-16 rounded-full bg-[#ec4899] mb-5" />

            <p className="text-slate-500 mb-8 leading-relaxed line-clamp-4">
              {aboutUsInfo.description}
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {featureCards.map((item, idx) => (
                <div key={idx} className="bg-[#fdf2f8] rounded-xl p-4 border border-rose-50">
                  <h4 className="font-semibold text-sm text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <Link
              to="/aboutus"
              className="inline-flex items-center gap-2 px-7 py-3 text-white font-semibold rounded-full shadow-md hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300"
              style={{ backgroundColor: "#ec4899" }}
            >
              Learn More About Us <ArrowRight size={16} />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;
