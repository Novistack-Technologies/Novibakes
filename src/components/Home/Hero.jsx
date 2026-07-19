import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  }),
};

const float = (duration = 6, delay = 0) => ({
  animate: {
    y: [0, -12, 0],
    rotate: [0, 2, 0],
    transition: { duration, repeat: Infinity, ease: "easeInOut", delay },
  },
});

/* ─── Premium SVG Illustrations — each with its own accent color ─── */

const G  = "#ec4899";  // primary — deep caramel amber
const G2 = "#db2777";  // hover / deep variant
const G3 = "#f472b6";  // lighter highlight strokes

const TieredCake = ({ className }) => (
  <svg className={className} viewBox="0 0 110 150" fill="none">
    <ellipse cx="55" cy="146" rx="38" ry="5" fill={G} fillOpacity="0.08"/>
    <rect x="12" y="100" width="86" height="44" rx="5" stroke={G} strokeWidth="1.6" strokeOpacity="0.7"/>
    <path d="M12 112 Q20 100 28 112 Q36 124 44 112 Q52 100 60 112 Q68 124 76 112 Q84 100 92 112 Q98 106 98 100" stroke={G3} strokeWidth="1.3" strokeOpacity="0.45" fill="none"/>
    <circle cx="35" cy="128" r="2.5" fill={G} fillOpacity="0.4"/>
    <circle cx="55" cy="128" r="2.5" fill={G} fillOpacity="0.4"/>
    <circle cx="75" cy="128" r="2.5" fill={G} fillOpacity="0.4"/>
    <rect x="26" y="62" width="58" height="40" rx="4" stroke={G} strokeWidth="1.6" strokeOpacity="0.7"/>
    <path d="M26 73 Q34 62 42 73 Q50 84 58 73 Q66 62 74 73 Q80 67 84 62" stroke={G3} strokeWidth="1.3" strokeOpacity="0.45" fill="none"/>
    <circle cx="45" cy="85" r="2" fill={G} fillOpacity="0.35"/>
    <circle cx="65" cy="85" r="2" fill={G} fillOpacity="0.35"/>
    <rect x="38" y="32" width="34" height="32" rx="4" stroke={G} strokeWidth="1.6" strokeOpacity="0.7"/>
    <path d="M38 42 Q45 32 52 42 Q59 52 66 42 Q70 37 72 32" stroke={G3} strokeWidth="1.3" strokeOpacity="0.45" fill="none"/>
    <rect x="52" y="14" width="6" height="20" rx="2" stroke={G2} strokeWidth="1.4" strokeOpacity="0.7"/>
    <path d="M55 14 C51 9 50 4 55 1 C60 4 59 9 55 14Z" stroke={G} strokeWidth="1.1" strokeOpacity="0.8" fill={G} fillOpacity="0.15"/>
    <path d="M4 70 L5.5 65 L7 70 L12 70 L8 73 L9.5 78 L5.5 75 L1.5 78 L3 73 L-1 70Z" fill={G} fillOpacity="0.14"/>
    <path d="M100 42 L101 38 L102 42 L106 42 L103 44 L104 48 L101 46 L98 48 L99 44 L96 42Z" fill={G} fillOpacity="0.12"/>
  </svg>
);

const Croissant = ({ className }) => (
  <svg className={className} viewBox="0 0 130 90" fill="none">
    <path d="M65 12 C100 5 128 32 122 62 C118 80 100 88 80 78 C62 68 55 50 62 35 C68 22 58 10 38 18 C20 26 14 48 24 64 C34 80 56 84 68 72" stroke={G} strokeWidth="1.8" strokeOpacity="0.7" fill="none" strokeLinecap="round"/>
    <path d="M65 12 C63 30 61 50 64 66" stroke={G3} strokeWidth="1.1" strokeOpacity="0.4" strokeLinecap="round" fill="none"/>
    <path d="M80 10 C76 28 74 50 76 68" stroke={G3} strokeWidth="1.1" strokeOpacity="0.4" strokeLinecap="round" fill="none"/>
    <path d="M50 15 C50 33 50 52 52 68" stroke={G3} strokeWidth="1.1" strokeOpacity="0.4" strokeLinecap="round" fill="none"/>
    <path d="M95 22 C112 28 120 44 116 58" stroke={G2} strokeWidth="1" strokeOpacity="0.28" strokeLinecap="round" fill="none"/>
    <circle cx="122" cy="30" r="2" fill={G} fillOpacity="0.3"/>
    <circle cx="14" cy="55" r="2" fill={G} fillOpacity="0.3"/>
  </svg>
);

const Macaron = ({ className }) => (
  <svg className={className} viewBox="0 0 100 80" fill="none">
    <ellipse cx="50" cy="22" rx="36" ry="20" stroke={G} strokeWidth="1.6" strokeOpacity="0.65"/>
    <ellipse cx="50" cy="40" rx="34" ry="6" stroke={G2} strokeWidth="1.2" strokeOpacity="0.45"/>
    <rect x="16" y="38" width="68" height="6" stroke={G2} strokeWidth="1.2" strokeOpacity="0.45"/>
    <ellipse cx="50" cy="44" rx="34" ry="6" stroke={G2} strokeWidth="1.2" strokeOpacity="0.45"/>
    <ellipse cx="50" cy="62" rx="36" ry="20" stroke={G} strokeWidth="1.6" strokeOpacity="0.65"/>
    <circle cx="40" cy="18" r="3" stroke={G3} strokeWidth="0.8" strokeOpacity="0.3"/>
    <circle cx="54" cy="14" r="2" stroke={G3} strokeWidth="0.8" strokeOpacity="0.25"/>
    <circle cx="62" cy="22" r="2.5" stroke={G3} strokeWidth="0.8" strokeOpacity="0.25"/>
    <path d="M28 14 C34 8 46 6 56 10" stroke={G3} strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" fill="none"/>
  </svg>
);

const Donut = ({ className }) => (
  <svg className={className} viewBox="0 0 120 120" fill="none">
    <circle cx="60" cy="60" r="52" stroke={G} strokeWidth="1.8" strokeOpacity="0.65"/>
    <circle cx="60" cy="60" r="20" stroke={G} strokeWidth="1.6" strokeOpacity="0.65"/>
    <path d="M60 8 C80 8 96 22 100 40" stroke={G3} strokeWidth="1.2" strokeOpacity="0.35" strokeLinecap="round" fill="none"/>
    <path d="M24 22 C14 34 10 50 14 66" stroke={G3} strokeWidth="1.2" strokeOpacity="0.35" strokeLinecap="round" fill="none"/>
    <rect x="44" y="28" width="11" height="3.5" rx="1.5" fill={G} fillOpacity="0.45" transform="rotate(-35 44 28)"/>
    <rect x="75" y="34" width="11" height="3.5" rx="1.5" fill={G2} fillOpacity="0.4" transform="rotate(20 75 34)"/>
    <rect x="94" y="62" width="11" height="3.5" rx="1.5" fill={G3} fillOpacity="0.4" transform="rotate(65 94 62)"/>
    <rect x="78" y="94" width="11" height="3.5" rx="1.5" fill={G} fillOpacity="0.4" transform="rotate(-10 78 94)"/>
    <rect x="40" y="98" width="11" height="3.5" rx="1.5" fill={G2} fillOpacity="0.4" transform="rotate(42 40 98)"/>
    <rect x="20" y="72" width="11" height="3.5" rx="1.5" fill={G3} fillOpacity="0.38" transform="rotate(-55 20 72)"/>
    <rect x="56" y="104" width="11" height="3.5" rx="1.5" fill={G} fillOpacity="0.38" transform="rotate(12 56 104)"/>
    <rect x="30" y="40" width="9" height="3" rx="1.5" fill={G2} fillOpacity="0.35" transform="rotate(70 30 40)"/>
    <circle cx="60" cy="8" r="2.5" fill={G} fillOpacity="0.35"/>
    <circle cx="112" cy="60" r="2.5" fill={G} fillOpacity="0.35"/>
    <circle cx="60" cy="112" r="2.5" fill={G} fillOpacity="0.35"/>
    <circle cx="8" cy="60" r="2.5" fill={G} fillOpacity="0.35"/>
  </svg>
);

const Whisk = ({ className }) => (
  <svg className={className} viewBox="0 0 80 170" fill="none">
    <path d="M40 100 L40 162" stroke={G2} strokeWidth="3" strokeOpacity="0.6" strokeLinecap="round"/>
    <line x1="32" y1="125" x2="48" y2="125" stroke={G2} strokeWidth="1.1" strokeOpacity="0.35"/>
    <line x1="32" y1="138" x2="48" y2="138" stroke={G2} strokeWidth="1.1" strokeOpacity="0.35"/>
    <line x1="32" y1="151" x2="48" y2="151" stroke={G2} strokeWidth="1.1" strokeOpacity="0.35"/>
    <path d="M40 100 C40 72 18 44 12 16" stroke={G} strokeWidth="1.5" strokeOpacity="0.65" fill="none" strokeLinecap="round"/>
    <path d="M40 100 C40 72 28 40 22 10" stroke={G} strokeWidth="1.5" strokeOpacity="0.65" fill="none" strokeLinecap="round"/>
    <path d="M40 100 C40 72 37 38 36 8" stroke={G} strokeWidth="1.5" strokeOpacity="0.65" fill="none" strokeLinecap="round"/>
    <path d="M40 100 C40 72 43 38 44 8" stroke={G} strokeWidth="1.5" strokeOpacity="0.65" fill="none" strokeLinecap="round"/>
    <path d="M40 100 C40 72 52 40 58 10" stroke={G} strokeWidth="1.5" strokeOpacity="0.65" fill="none" strokeLinecap="round"/>
    <path d="M40 100 C40 72 62 44 68 16" stroke={G} strokeWidth="1.5" strokeOpacity="0.65" fill="none" strokeLinecap="round"/>
    <path d="M22 62 Q40 52 58 62" stroke={G3} strokeWidth="1" strokeOpacity="0.35" fill="none"/>
    <path d="M16 40 Q40 28 64 40" stroke={G3} strokeWidth="1" strokeOpacity="0.3" fill="none"/>
    <path d="M14 24 Q40 10 66 24" stroke={G3} strokeWidth="1" strokeOpacity="0.28" fill="none"/>
    <circle cx="8" cy="85" r="2" fill={G} fillOpacity="0.28"/>
    <circle cx="72" cy="72" r="2" fill={G} fillOpacity="0.28"/>
  </svg>
);

const Cupcake = ({ className }) => (
  <svg className={className} viewBox="0 0 100 130" fill="none">
    <path d="M22 72 L32 118 L68 118 L78 72Z" stroke={G} strokeWidth="1.6" strokeOpacity="0.65" fill="none" strokeLinejoin="round"/>
    <line x1="36" y1="74" x2="34" y2="116" stroke={G2} strokeWidth="0.9" strokeOpacity="0.3"/>
    <line x1="50" y1="72" x2="50" y2="118" stroke={G2} strokeWidth="0.9" strokeOpacity="0.3"/>
    <line x1="64" y1="74" x2="66" y2="116" stroke={G2} strokeWidth="0.9" strokeOpacity="0.3"/>
    <path d="M22 72 C22 52 34 38 50 36 C66 38 78 52 78 72Z" stroke={G} strokeWidth="1.6" strokeOpacity="0.65" fill="none"/>
    <path d="M30 65 C30 50 38 39 50 37 C62 39 70 50 70 65" stroke={G3} strokeWidth="1.3" strokeOpacity="0.45" fill="none"/>
    <path d="M38 58 C38 47 43 39 50 37 C57 39 62 47 62 58" stroke={G3} strokeWidth="1.1" strokeOpacity="0.38" fill="none"/>
    <path d="M44 52 C44 44 47 38 50 36 C53 38 56 44 56 52" stroke={G3} strokeWidth="0.9" strokeOpacity="0.3" fill="none"/>
    <circle cx="50" cy="26" r="10" stroke={G} strokeWidth="1.4" strokeOpacity="0.65" fill={G} fillOpacity="0.08"/>
    <path d="M50 16 C50 8 57 4 62 3" stroke={G2} strokeWidth="1.1" strokeOpacity="0.5" strokeLinecap="round" fill="none"/>
    <circle cx="6" cy="50" r="2" fill={G} fillOpacity="0.28"/>
    <circle cx="94" cy="62" r="2" fill={G} fillOpacity="0.28"/>
  </svg>
);

const Cookie = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none">
    <path d="M50 6 C68 4 88 16 94 34 C100 52 92 74 76 84 C60 94 36 92 22 80 C8 68 4 46 14 30 C24 14 32 8 50 6Z" stroke={G} strokeWidth="1.6" strokeOpacity="0.65"/>
    <rect x="32" y="30" width="10" height="8" rx="2" fill={G} fillOpacity="0.35" transform="rotate(-15 32 30)"/>
    <rect x="56" y="24" width="10" height="8" rx="2" fill={G2} fillOpacity="0.32" transform="rotate(10 56 24)"/>
    <rect x="68" y="48" width="10" height="8" rx="2" fill={G} fillOpacity="0.35" transform="rotate(20 68 48)"/>
    <rect x="50" y="60" width="10" height="8" rx="2" fill={G2} fillOpacity="0.32" transform="rotate(-5 50 60)"/>
    <rect x="28" y="55" width="10" height="8" rx="2" fill={G} fillOpacity="0.35" transform="rotate(25 28 55)"/>
    <rect x="44" y="40" width="8" height="7" rx="2" fill={G3} fillOpacity="0.3" transform="rotate(-20 44 40)"/>
    <rect x="64" y="68" width="8" height="7" rx="2" fill={G3} fillOpacity="0.3" transform="rotate(15 64 68)"/>
    <circle cx="38" cy="72" r="2" fill={G} fillOpacity="0.3"/>
    <circle cx="74" cy="34" r="2" fill={G} fillOpacity="0.3"/>
    <path d="M22 22 C32 12 48 8 62 12" stroke={G3} strokeWidth="1" strokeOpacity="0.28" strokeLinecap="round" fill="none"/>
  </svg>
);

const RollingPin = ({ className }) => (
  <svg className={className} viewBox="0 0 160 60" fill="none">
    <rect x="2" y="22" width="22" height="16" rx="8" stroke={G2} strokeWidth="1.5" strokeOpacity="0.6"/>
    <line x1="2" y1="28" x2="24" y2="28" stroke={G2} strokeWidth="0.9" strokeOpacity="0.3"/>
    <line x1="2" y1="32" x2="24" y2="32" stroke={G2} strokeWidth="0.9" strokeOpacity="0.3"/>
    <rect x="20" y="26" width="14" height="8" rx="0" stroke={G2} strokeWidth="1.2" strokeOpacity="0.45"/>
    <rect x="32" y="16" width="96" height="28" rx="14" stroke={G} strokeWidth="1.8" strokeOpacity="0.65"/>
    <line x1="52" y1="16" x2="52" y2="44" stroke={G3} strokeWidth="0.9" strokeOpacity="0.28"/>
    <line x1="68" y1="16" x2="68" y2="44" stroke={G3} strokeWidth="0.9" strokeOpacity="0.28"/>
    <line x1="84" y1="16" x2="84" y2="44" stroke={G3} strokeWidth="0.9" strokeOpacity="0.28"/>
    <line x1="100" y1="16" x2="100" y2="44" stroke={G3} strokeWidth="0.9" strokeOpacity="0.28"/>
    <line x1="116" y1="16" x2="116" y2="44" stroke={G3} strokeWidth="0.9" strokeOpacity="0.28"/>
    <path d="M38 20 C60 14 100 14 122 20" stroke={G3} strokeWidth="1" strokeOpacity="0.28" fill="none"/>
    <rect x="126" y="26" width="14" height="8" rx="0" stroke={G2} strokeWidth="1.2" strokeOpacity="0.45"/>
    <rect x="136" y="22" width="22" height="16" rx="8" stroke={G2} strokeWidth="1.5" strokeOpacity="0.6"/>
    <line x1="136" y1="28" x2="158" y2="28" stroke={G2} strokeWidth="0.9" strokeOpacity="0.3"/>
    <line x1="136" y1="32" x2="158" y2="32" stroke={G2} strokeWidth="0.9" strokeOpacity="0.3"/>
  </svg>
);

const PipingBag = ({ className }) => (
  <svg className={className} viewBox="0 0 90 140" fill="none">
    <path d="M15 10 C10 10 6 14 6 18 L18 100 L72 100 L84 18 C84 14 80 10 75 10 Z" stroke={G} strokeWidth="1.6" strokeOpacity="0.65" fill="none"/>
    <path d="M30 10 C35 2 55 2 60 10" stroke={G3} strokeWidth="1.4" strokeOpacity="0.55" fill="none" strokeLinecap="round"/>
    <ellipse cx="45" cy="10" rx="8" ry="4" stroke={G3} strokeWidth="1.2" strokeOpacity="0.5"/>
    <line x1="45" y1="14" x2="32" y2="98" stroke={G2} strokeWidth="0.9" strokeOpacity="0.28"/>
    <path d="M18 100 L26 118 L64 118 L72 100Z" stroke={G} strokeWidth="1.4" strokeOpacity="0.6" fill="none"/>
    <path d="M30 118 L36 134 L54 134 L60 118Z" stroke={G} strokeWidth="1.3" strokeOpacity="0.55" fill="none"/>
    <path d="M45 128 L47 134 L45 134 M45 128 L43 134" stroke={G2} strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" fill="none"/>
    <path d="M45 134 C42 138 48 142 45 146" stroke={G} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" fill="none"/>
  </svg>
);

/* ─── Scatter sparkle dots ─── */
const Sparkle = ({ x, y, size = 2, opacity = 0.25, color = "white" }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{ left: x, top: y, width: size, height: size, opacity, backgroundColor: color }}
  />
);

const Hero = () => {
  return (
    <section
      className="overflow-hidden relative min-h-screen flex items-center bg-[#fdf2f8]"
    >
      {/* soft center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-35 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #f9a8d4 0%, transparent 70%)" }} />

      {/* dot pattern */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #ec4899 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      {/* Scatter dots */}
      <Sparkle x="8%"  y="15%" size={4} opacity={0.35} color="#ec4899"/>
      <Sparkle x="92%" y="20%" size={3} opacity={0.25} color="#ec4899"/>
      <Sparkle x="5%"  y="55%" size={3} opacity={0.25} color="#ec4899"/>
      <Sparkle x="95%" y="70%" size={4} opacity={0.30} color="#ec4899"/>
      <Sparkle x="15%" y="85%" size={3} opacity={0.25} color="#ec4899"/>
      <Sparkle x="85%" y="88%" size={3} opacity={0.25} color="#ec4899"/>
      <Sparkle x="50%" y="5%"  size={3} opacity={0.25} color="#ec4899"/>

      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-20">
        <div className="relative max-w-5xl mx-auto text-center py-10">

          {/* ── LEFT COLUMN DOODLES ── */}
          <div className="absolute -left-4 xl:-left-10 top-0 bottom-0 hidden lg:flex flex-col justify-between items-start pointer-events-none py-4" style={{ width: 150 }}>
            <motion.div variants={float(7,0)} initial={{ y: 0 }} animate="animate" className="w-32 h-44 opacity-30" style={{ willChange: "transform" }}>
              <TieredCake className="w-full h-full" />
            </motion.div>
            <motion.div variants={float(5.5, 1)} initial={{ y: 0 }} animate="animate" className="w-24 h-32 opacity-45 ml-6" style={{ willChange: "transform" }}>
              <Cupcake className="w-full h-full" />
            </motion.div>
            <motion.div variants={float(8, 2)} initial={{ y: 0 }} animate="animate" className="w-20 h-20 opacity-40" style={{ willChange: "transform" }}>
              <Cookie className="w-full h-full" />
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN DOODLES ── */}
          <div className="absolute -right-4 xl:-right-10 top-0 bottom-0 hidden lg:flex flex-col justify-between items-end pointer-events-none py-4" style={{ width: 150 }}>
            <motion.div variants={float(6, 0.5)} initial={{ y: 0 }} animate="animate" className="w-24 h-24 opacity-45 mr-4" style={{ willChange: "transform" }}>
              <Donut className="w-full h-full" />
            </motion.div>
            <motion.div variants={float(9, 1.5)} initial={{ y: 0 }} animate="animate" className="w-20 h-44 opacity-45" style={{ willChange: "transform" }}>
              <Whisk className="w-full h-full" />
            </motion.div>
            <motion.div variants={float(6.5, 0)} initial={{ y: 0 }} animate="animate" className="w-28 h-20 opacity-40" style={{ willChange: "transform" }}>
              <Croissant className="w-full h-full" />
            </motion.div>
          </div>

          {/* ── TOP SCATTERED DOODLES ── */}
          <motion.div
            variants={float(7, 2)} initial={{ y: 0 }} animate="animate"
            className="absolute hidden xl:block pointer-events-none opacity-40"
            style={{ top: -10, left: "18%", width: 70, height: 50, willChange: "transform" }}
          >
            <RollingPin className="w-full h-full" />
          </motion.div>

          <motion.div
            variants={float(6, 3)} initial={{ y: 0 }} animate="animate"
            className="absolute hidden xl:block pointer-events-none opacity-40"
            style={{ top: 20, right: "18%", width: 52, height: 80, willChange: "transform" }}
          >
            <PipingBag className="w-full h-full" />
          </motion.div>

          <motion.div
            variants={float(5, 1)} initial={{ y: 0 }} animate="animate"
            className="absolute hidden xl:block pointer-events-none opacity-40"
            style={{ bottom: 30, left: "20%", width: 60, height: 48, willChange: "transform" }}
          >
            <Macaron className="w-full h-full" />
          </motion.div>

          {/* ── BADGE ──
          <motion.p
            custom={0} initial="hidden" animate="visible" variants={fadeUp}
            className="text-xs font-bold tracking-widest mb-6 text-pink-800"
          >
            ✦ Handcrafted With Love ✦
          </motion.p> */}

          {/* ── Heading ── */}
          <motion.h1
            custom={0.1} initial="hidden" animate="visible" variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-[78px] leading-[0.95] font-bold tracking-tight text-slate-800"
          >
            Baking Smiles,
            <br />
            <span style={{ color: "#ec4899" }}>One Pastry At A Time</span>
          </motion.h1>

          {/* ── Divider ── */}
          <motion.div
            custom={0.15} initial="hidden" animate="visible" variants={fadeUp}
            className="flex items-center justify-center gap-3 mt-7 mb-0"
          >
            <div className="h-px w-16 rounded-full" style={{ backgroundColor: "#f9a8d4" }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#ec4899" }} />
            <div className="h-px w-16 rounded-full" style={{ backgroundColor: "#f9a8d4" }} />
          </motion.div>

          {/* ── Description ── */}
          <motion.p
            custom={0.2} initial="hidden" animate="visible" variants={fadeUp}
            className="mt-6 text-base sm:text-lg max-w-xl mx-auto leading-relaxed text-slate-500"
          >
            Freshly baked cakes, pastries, cookies, and treats crafted with
            premium ingredients, bringing warmth, sweetness, and joy to every
            celebration.
          </motion.p>

          {/* ── CTA Buttons ── */}
          <motion.div
            custom={0.3} initial="hidden" animate="visible" variants={fadeUp}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/shop"
              className="transition-all duration-300 text-white px-8 py-3.5 rounded-full text-sm font-semibold shadow-lg hover:-translate-y-0.5 active:scale-95 text-center"
              style={{ backgroundColor: "#ec4899" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#db2777"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#ec4899"}
            >
              View Our Menu
            </Link>
            <Link
              to="/contactus"
              className="transition-all duration-300 flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold hover:-translate-y-0.5 border-2 bg-white hover:bg-[#fdf2f8] text-slate-700 active:scale-95"
              style={{ borderColor: "#ec489950" }}
            >
              Free Consultation
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
