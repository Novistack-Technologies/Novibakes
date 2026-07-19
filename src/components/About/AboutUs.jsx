import React from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="pt-5">
      <div className="bg-white">
        {/* Page Heading */}
        <div className="pt-20 pb-4 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-slate-800"
          >
            About <span className="text-[#ec4899]">NoviBakes</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-1 rounded-full mx-auto mb-6"
            style={{ width: 80, backgroundColor: "#ec4899" }}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base md:text-lg text-slate-800 max-w-2xl mx-auto leading-relaxed"
          >
            Discover how we sweeten your celebrations and everyday moments with
            our handcrafted baking experiences.
          </motion.p>
        </div>

        {/* Intro Story */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
              {/* Image */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Our bakery kitchen"
                    className="w-full h-[400px] lg:h-[500px] object-cover"
                    loading="lazy"
                  />
                </div>
                <div
                  className="absolute -bottom-5 -right-4 rounded-2xl px-6 py-5 shadow-xl"
                  style={{ backgroundColor: "#ec4899" }}
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-white" />
                    <div>
                      <div className="font-bold text-lg text-white">Salem's Favourite</div>
                      <div className="text-white/70 text-sm">Bakery Since 2019</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h2 className="text-3xl md:text-4xl text-slate-800 font-bold mt-3 mb-5 leading-tight">
                  A Dream Born in a{" "}
                  <span style={{ color: "#ec4899" }}>Kitchen</span>
                </h2>

                <div className="h-1 w-16 rounded-full mb-6" style={{ backgroundColor: "#ec4899" }} />

                <p className="text-slate-800 leading-relaxed mb-5">
                  NoviBakes was born in 2019 when Kiruthika Santhoshni decided
                  to turn her passion for baking into something the people of
                  Salem could truly savour. Starting from her home kitchen, she
                  crafted each cake with the care and flavour of a homemade
                  celebration.
                </p>

                <p className="text-slate-800 leading-relaxed mb-8">
                  Word spread quickly through friends, family, and neighbours.
                  What began as custom birthday cakes grew into a full range of
                  handcrafted desserts — from rich brownies and cupcakes to
                  grand wedding cakes — all made fresh, every single order.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Users, label: "2000+", sub: "Happy Customers" },
                    { icon: Award, label: "50+", sub: "Unique Recipes" },
                    { icon: Trophy, label: "500+", sub: "Cakes Delivered" },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div
                      key={label}
                      className="bg-white rounded-2xl p-4 text-center shadow-sm border border-rose-50"
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: "#ec4899" }} />
                      <div className="text-xl font-bold text-slate-800">{label}</div>
                      <div className="text-xs mt-0.5 text-slate-700">{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
