import { motion } from "framer-motion";

const P = "#ec4899";
const P2 = "#db2777";
const P3 = "#f9a8d4";

const float = (duration = 6, delay = 0) => ({
  animate: {
    y: [0, -14, 0],
    rotate: [0, 3, 0],
    transition: { duration, repeat: Infinity, ease: "easeInOut", delay },
  },
});

const GiftBox = ({ className }) => (
  <svg className={className} viewBox="0 0 130 150" fill="none">
    <rect x="10" y="62" width="110" height="82" rx="5" stroke={P} strokeWidth="1.8" strokeOpacity="0.65"/>
    <rect x="6" y="42" width="118" height="24" rx="4" stroke={P} strokeWidth="1.7" strokeOpacity="0.6"/>
    <line x1="65" y1="42" x2="65" y2="144" stroke={P3} strokeWidth="1.4" strokeOpacity="0.4"/>
    <line x1="6" y1="54" x2="124" y2="54" stroke={P3} strokeWidth="1.4" strokeOpacity="0.3"/>
    <path d="M65 42 C50 32 30 18 34 8 C38 0 56 6 65 22 C74 6 92 0 96 8 C100 18 80 32 65 42Z" stroke={P} strokeWidth="1.5" strokeOpacity="0.7" fill="none"/>
    <circle cx="65" cy="42" r="4" stroke={P2} strokeWidth="1.3" strokeOpacity="0.65" fill={P} fillOpacity="0.1"/>
    <circle cx="34" cy="100" r="3" fill={P} fillOpacity="0.25"/>
    <circle cx="96" cy="100" r="3" fill={P} fillOpacity="0.25"/>
    <circle cx="34" cy="126" r="3" fill={P} fillOpacity="0.25"/>
    <circle cx="96" cy="126" r="3" fill={P} fillOpacity="0.25"/>
    <path d="M12 84 C40 76 90 76 118 84" stroke={P3} strokeWidth="0.9" strokeOpacity="0.3" fill="none"/>
  </svg>
);

const Cupcake = ({ className }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none">
    <path d="M22 62 L28 104 L72 104 L78 62Z" stroke={P} strokeWidth="1.7" strokeOpacity="0.65" fill="none" strokeLinejoin="round"/>
    <line x1="36" y1="64" x2="34" y2="102" stroke={P3} strokeWidth="0.9" strokeOpacity="0.3"/>
    <line x1="50" y1="62" x2="50" y2="104" stroke={P3} strokeWidth="0.9" strokeOpacity="0.3"/>
    <line x1="64" y1="64" x2="66" y2="102" stroke={P3} strokeWidth="0.9" strokeOpacity="0.3"/>
    <path d="M24 78 Q50 74 76 78" stroke={P3} strokeWidth="0.9" strokeOpacity="0.3" fill="none"/>
    <path d="M22 62 C22 40 33 26 50 24 C67 26 78 40 78 62Z" stroke={P} strokeWidth="1.7" strokeOpacity="0.65" fill="none"/>
    <path d="M30 56 C30 40 38 30 50 28 C62 30 70 40 70 56" stroke={P3} strokeWidth="1" strokeOpacity="0.35" fill="none"/>
    <rect x="47" y="8" width="6" height="18" rx="2" stroke={P2} strokeWidth="1.3" strokeOpacity="0.6" fill="none"/>
    <path d="M50 8 C47 3 46 0 50 -2 C54 0 53 3 50 8Z" fill={P} fillOpacity="0.35"/>
  </svg>
);

const DeliveryBox = ({ className }) => (
  <svg className={className} viewBox="0 0 130 110" fill="none">
    <path d="M10 40 L65 10 L120 40 L120 90 L65 110 L10 90 Z" stroke={P} strokeWidth="1.7" strokeOpacity="0.65" fill="none" strokeLinejoin="round"/>
    <path d="M10 40 L65 68 L120 40" stroke={P2} strokeWidth="1.4" strokeOpacity="0.5" fill="none"/>
    <line x1="65" y1="68" x2="65" y2="110" stroke={P3} strokeWidth="1.4" strokeOpacity="0.4"/>
    <path d="M38 25 L65 38 L92 25" stroke={P3} strokeWidth="1" strokeOpacity="0.35" fill="none"/>
    <circle cx="65" cy="33" r="4" stroke={P} strokeWidth="1.1" strokeOpacity="0.55" fill="none"/>
  </svg>
);

const GraduationCap = ({ className }) => (
  <svg className={className} viewBox="0 0 120 100" fill="none">
    <path d="M60 12 L112 36 L60 58 L8 36 Z" stroke={P} strokeWidth="1.7" strokeOpacity="0.65" fill="none" strokeLinejoin="round"/>
    <path d="M60 58 L60 86" stroke={P2} strokeWidth="1.5" strokeOpacity="0.55" strokeLinecap="round"/>
    <path d="M60 86 Q38 86 32 96" stroke={P3} strokeWidth="1.5" strokeOpacity="0.45" fill="none" strokeLinecap="round"/>
    <path d="M96 44 L96 72" stroke={P2} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round"/>
    <circle cx="96" cy="76" r="5" stroke={P} strokeWidth="1.4" strokeOpacity="0.6" fill="none"/>
    <path d="M28 48 L28 72 Q44 80 60 80 Q76 80 92 72 L92 48" stroke={P3} strokeWidth="1.3" strokeOpacity="0.35" fill="none"/>
  </svg>
);

const Star = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none">
    <path d="M24 4 L27 18 L42 18 L30 28 L34 42 L24 33 L14 42 L18 28 L6 18 L21 18Z"
      stroke={P} strokeWidth="1.4" strokeOpacity="0.6" fill={P} fillOpacity="0.07" strokeLinejoin="round"/>
  </svg>
);

const Sparkle = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    <path d="M20 4 L21.5 17 L34 20 L21.5 23 L20 36 L18.5 23 L6 20 L18.5 17Z"
      stroke={P} strokeWidth="1.3" strokeOpacity="0.6" fill={P} fillOpacity="0.08" strokeLinejoin="round"/>
  </svg>
);

const ServiceHero = () => (
  <section className="relative min-h-[62vh] flex items-center overflow-hidden bg-[#fdf2f8]">

    {/* soft center glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-30 blur-3xl pointer-events-none"
      style={{ background: "radial-gradient(ellipse, #f9a8d4 0%, transparent 70%)" }} />

    {/* dot pattern */}
    <div className="absolute inset-0 opacity-[0.06]"
      style={{ backgroundImage: "radial-gradient(circle, #ec4899 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

    {/* bg doodles */}
    <motion.div {...float(6, 0.4)} className="absolute top-10 left-10 opacity-35 hidden lg:block">
      <Star className="w-10 h-10" />
    </motion.div>
    <motion.div {...float(5, 1.2)} className="absolute top-20 right-[44%] opacity-30">
      <Sparkle className="w-7 h-7" />
    </motion.div>
    <motion.div {...float(7, 0.8)} className="absolute bottom-20 left-[40%] opacity-30 hidden md:block">
      <Star className="w-8 h-8" />
    </motion.div>

    <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-14 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* ── Left: content ── */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-4xl font-black text-slate-800 leading-[1.1] mb-6 tracking-tight">
          Sweet Services,{" "}
          <span className="relative inline-block">
            <span style={{ color: "#ec4899" }}>Crafted</span>
            {/* <motion.span
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left rounded-full"
              style={{ backgroundColor: "#ec4899" }} /> */}
          </span>
          {" "}For You
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-slate-500 text-lg leading-relaxed max-w-xl mb-10">
          From custom celebration cakes to bulk wholesale orders — we offer a full suite of bakery services tailored to your needs, your events, and your business.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="flex flex-wrap gap-3">
          {["Custom Cakes", "Catering", "Corporate Gifts", "Baking Classes"].map((tag) => (
            <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-semibold border text-slate-600 bg-white"
              style={{ borderColor: "#ec489930" }}>
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Right: doodle cluster ── */}
      <div className="relative flex items-center justify-center h-64 lg:h-[340px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full border border-[#ec4899]/15" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 lg:w-60 lg:h-60 rounded-full border border-[#ec4899]/10" />
        </div>

        <motion.div {...float(7, 0)} className="relative z-10">
          <GiftBox className="w-40 h-auto lg:w-52" />
        </motion.div>

        <motion.div {...float(5, 0.8)} className="absolute top-6 right-6 lg:right-12">
          <Cupcake className="w-20 h-24 lg:w-24 lg:h-28" />
        </motion.div>
        <motion.div {...float(6, 1.6)} className="absolute bottom-8 left-4 lg:left-6">
          <DeliveryBox className="w-28 lg:w-36 opacity-85" />
        </motion.div>
        <motion.div {...float(8, 0.4)} className="absolute top-14 left-4 lg:left-6">
          <GraduationCap className="w-20 lg:w-24 opacity-75" />
        </motion.div>
        <motion.div {...float(4, 1.2)} className="absolute bottom-6 right-6 lg:right-14">
          <Star className="w-12 h-12 opacity-65" />
        </motion.div>
        <motion.div {...float(5, 2)} className="absolute top-4 left-[46%]">
          <Sparkle className="w-8 h-8 opacity-60" />
        </motion.div>
      </div>
    </div>
  </section>
);

export default ServiceHero;
