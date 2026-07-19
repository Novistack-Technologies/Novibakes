import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles, MessageCircle, MapPin, Clock,
  Star, Award, Heart, ArrowRight, Truck,
} from "lucide-react";
import breadBasket from "../../assets/bread-basket.png";
import cupcake from "../../assets/cupcake.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const WHY_US = [
  {
    icon: Sparkles,
    color: "#ec4899",
    bg: "#fdf2f8",
    title: "Baked Fresh Daily",
    desc: "Every cake, brownie and dessert is baked fresh on the day of your order — no frozen, no compromise.",
  },
  {
    icon: Award,
    color: "#7c3aed",
    bg: "#f5f3ff",
    title: "Premium Ingredients",
    desc: "We use only high-quality ingredients — real butter, fresh cream, Belgian chocolate and natural flavours.",
  },
  {
    icon: MessageCircle,
    color: "#16a34a",
    bg: "#f0fdf4",
    title: "Order via WhatsApp",
    desc: "No app needed. Just message us on WhatsApp with your order and we'll confirm it within minutes.",
  },
  {
    icon: Heart,
    color: "#e11d48",
    bg: "#fff1f2",
    title: "Made With Love",
    desc: "Every order is handcrafted with care. We treat every cake like it's for our own family's celebration.",
  },
  {
    icon: MapPin,
    color: "#0ea5e9",
    bg: "#f0f9ff",
    title: "Salem Local",
    desc: "Proudly based in Salem, Tamil Nadu. We deliver across Salem city with care and on time.",
  },
  {
    icon: Truck,
    color: "#d97706",
    bg: "#fef3c7",
    title: "Track Your Order",
    desc: "Get your unique Order ID on WhatsApp and track your order status anytime on our Track Order page.",
  },
];

const FeaturedSection = () => {
  return (
    <section className="overflow-hidden">

      {/* ── WHY NOVIBAKES ── */}
      <div className="bg-[#fdf2f8] px-6 sm:px-8 lg:px-16 py-20">
        <div className="max-w-6xl mx-auto">

          {/* heading */}
          <motion.div
            className="text-center mb-12"
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeUp}
          >
            {/* <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#ec4899] shadow-sm mb-4">
              <Star size={13} fill="#ec4899" /> Salem's Favourite Bakery
            </span> */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Why Choose NoviBakes?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From birthdays to weddings, we bring sweetness to every celebration — baked fresh, delivered with care.
            </p>
          </motion.div>

          {/* 6-grid feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex gap-4"
                  initial="hidden" whileInView="show" viewport={{ once: true }}
                  variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Icon size={20} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 mb-1">{item.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* stats strip */}
          <motion.div
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeUp} transition={{ duration: 0.4, delay: 0.3 }}
          >
            {[
              { val: "500+", label: "Happy Customers" },
              { val: "50+",  label: "Menu Items" },
              { val: "100%", label: "Fresh Daily" },
              { val: "5★",   label: "Customer Rating" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl py-4 px-3 text-center shadow-sm border border-white">
                <p className="text-2xl font-extrabold text-[#ec4899]">{s.val}</p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── PROMO CARDS ── */}
      <div className="px-6 sm:px-8 lg:px-16 py-16 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 — Custom Cakes */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="relative bg-[#f3e3cf] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col min-h-[300px]"
          >
            <div className="p-7 flex flex-col flex-1 z-10 relative">
              {/* <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#ec4899] bg-white/70 px-2 py-1 rounded-full mb-3 w-fit">
                Celebrate Big
              </span> */}
              <h3 className="text-2xl font-bold text-[#3a2418] leading-snug mb-2">
                Custom Cakes<br/>For Every<br/>Occasion!
              </h3>
              <p className="text-[#5c3a28] text-xs leading-relaxed mb-5 max-w-[55%]">
                Birthdays, weddings, anniversaries — we craft it just for you.
              </p>
              <Link to="/shop" className="mt-auto w-fit">
                <button className="flex items-center gap-1.5 bg-[#ec4899] hover:bg-[#db2777] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
                  Order Now <ArrowRight size={13} />
                </button>
              </Link>
            </div>
            <img
              src={cupcake}
              alt="Cupcake"
              className="absolute bottom-0 right-0 w-40 h-40 object-contain drop-shadow-lg pointer-events-none"
            />
          </motion.div>

          {/* Card 2 — WhatsApp Order */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative bg-[#111827] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col min-h-[300px]"
          >
            {/* background deco */}
            <div className="absolute bottom-10 right-4 opacity-10 pointer-events-none">
              <MessageCircle size={110} className="text-green-400" />
            </div>
            <svg viewBox="0 0 20 20" fill="none" className="absolute top-6 right-8 w-3 h-3 opacity-25 pointer-events-none">
              <path d="M10 1 L11.5 8.5 L19 10 L11.5 11.5 L10 19 L8.5 11.5 L1 10 L8.5 8.5Z" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>
            <svg viewBox="0 0 20 20" fill="none" className="absolute top-16 right-14 w-2 h-2 opacity-20 pointer-events-none">
              <path d="M10 1 L11.5 8.5 L19 10 L11.5 11.5 L10 19 L8.5 11.5 L1 10 L8.5 8.5Z" stroke="white" strokeWidth="1.5" fill="none"/>
            </svg>

            <div className="p-7 flex flex-col flex-1 z-10 relative">
              {/* <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-full mb-3 w-fit">
                {/* <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Instant Ordering
              </span> */}
              <h3 className="text-2xl font-bold text-white leading-snug mb-2">
                Order in<br/>Minutes via<br/>WhatsApp!
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-5">
                No app, no login — just message us and we'll confirm your order right away.
              </p>
              <Link to="/shop" className="mt-auto w-fit">
                <button className="flex items-center gap-1.5 bg-[#ec4899] hover:bg-[#db2777] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
                  Start Order <ArrowRight size={13} />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Card 3 — Track Order */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative bg-[#f3e3cf] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col min-h-[300px]"
          >
            <div className="p-7 flex flex-col flex-1 z-10 relative">
              {/* <span className="inline-block text-[10px] font-bold text-[#ec4899] bg-white/70 px-2 py-1 rounded-full mb-3 w-fit">
                Stay Updated
              </span> */}
              <h3 className="text-2xl font-bold text-[#3a2418] leading-snug mb-2">
                Track Your<br/>Order<br/>Anytime!
              </h3>
              <p className="text-[#5c3a28] text-xs leading-relaxed mb-5 max-w-[55%]">
                Get your Order ID on WhatsApp and check your delivery status live.
              </p>
              <Link to="/track-order" className="mt-auto w-fit">
                <button className="flex items-center gap-1.5 bg-[#ec4899] hover:bg-[#db2777] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">
                  Track Now <ArrowRight size={13} />
                </button>
              </Link>
            </div>
            <img
              src={breadBasket}
              alt="Bread Basket"
              className="absolute bottom-0 right-0 w-40 h-40 object-contain drop-shadow-lg pointer-events-none"
            />
          </motion.div>

        </div>
      </div>

    </section>
  );
};

export default FeaturedSection;
