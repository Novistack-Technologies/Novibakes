import { motion } from "framer-motion";
import {
  Cake, MessageCircle, MapPin, ShieldCheck,
  Clock, Star, Truck, Gift,
} from "lucide-react";

const SPECIALITIES = [
  {
    icon: Cake,
    color: "#ec4899",
    bg: "#fdf2f8",
    title: "100% Custom Designs",
    desc: "Every cake is designed from scratch based on your theme, colour palette, and occasion. No two cakes are ever the same.",
  },
  {
    icon: MessageCircle,
    color: "#16a34a",
    bg: "#f0fdf4",
    title: "WhatsApp-First Ordering",
    desc: "Skip the apps — just send us a message on WhatsApp. We confirm your order quickly and keep you updated every step.",
  },
  {
    icon: Clock,
    color: "#d97706",
    bg: "#fef3c7",
    title: "Same-Day Confirmation",
    desc: "Place your order and receive a confirmation with your Order ID on WhatsApp within hours. No long waits.",
  },
  {
    icon: ShieldCheck,
    color: "#7c3aed",
    bg: "#f5f3ff",
    title: "Hygienic & Safe",
    desc: "Every item is prepared in a clean, safe kitchen following strict food hygiene standards. Freshness is non-negotiable.",
  },
  {
    icon: MapPin,
    color: "#0ea5e9",
    bg: "#f0f9ff",
    title: "Salem City Delivery",
    desc: "We deliver across Salem city with care — packed securely so your cake arrives in perfect condition.",
  },
  {
    icon: Star,
    color: "#ec4899",
    bg: "#fdf2f8",
    title: "Premium Ingredients",
    desc: "Real butter, fresh cream, Belgian chocolate. We never compromise on quality — every bite reflects that.",
  },
  {
    icon: Gift,
    color: "#e11d48",
    bg: "#fff1f2",
    title: "Beautiful Packaging",
    desc: "Orders come in carefully designed boxes — perfect for gifting or gifting yourself. Presentation is part of the experience.",
  },
  {
    icon: Truck,
    color: "#16a34a",
    bg: "#f0fdf4",
    title: "Free Delivery Above ₹500",
    desc: "Orders above ₹500 qualify for free delivery within Salem city. More cake, more savings.",
  },
];

const cardVariants = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const WhyChooseUs = () => {
  return (
    <section className="relative bg-[#fdf2f8] py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full mb-4"
            style={{ backgroundColor: "#fff", color: "#ec4899" }}
          >
            What Makes Us Different
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Our Specialities
          </h2>
          <div className="h-1 w-16 rounded-full mx-auto mb-4" style={{ backgroundColor: "#ec4899" }} />
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            We're not just a bakery — we're your celebration partner. Here's what you get when you order with NoviBakes.
          </p>
        </motion.div>

        {/* grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.08 }}
        >
          {SPECIALITIES.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-white hover:shadow-md transition-all duration-300 flex flex-col items-center text-center gap-3"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: item.bg }}
                >
                  <Icon size={22} style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-1">{item.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
