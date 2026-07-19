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

const CakeSlice = ({ className }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none">
    <path d="M50 10 L90 90 L10 90 Z" stroke={P} strokeWidth="1.8" strokeOpacity="0.7" strokeLinejoin="round" fill="none"/>
    <path d="M10 90 L90 90 L90 108 Q50 118 10 108 Z" stroke={P} strokeWidth="1.6" strokeOpacity="0.65" fill="none"/>
    <path d="M30 52 Q50 42 70 52" stroke={P3} strokeWidth="1.1" strokeOpacity="0.4" fill="none"/>
    <path d="M20 70 Q50 58 80 70" stroke={P3} strokeWidth="1.1" strokeOpacity="0.35" fill="none"/>
    <circle cx="50" cy="78" r="3" fill={P} fillOpacity="0.3"/>
    <circle cx="35" cy="82" r="2" fill={P} fillOpacity="0.25"/>
    <circle cx="65" cy="82" r="2" fill={P} fillOpacity="0.25"/>
    <path d="M50 10 C48 4 47 1 50 -1 C53 1 52 4 50 10Z" fill={P} fillOpacity="0.4"/>
    <rect x="48" y="10" width="4" height="12" rx="1.5" stroke={P2} strokeWidth="1.2" strokeOpacity="0.6" fill="none"/>
    <path d="M18 44 L19.5 39 L21 44 L26 44 L22 47 L23.5 52 L19.5 49 L15.5 52 L17 47 L13 44Z" fill={P} fillOpacity="0.15"/>
    <path d="M78 28 L79 24 L80 28 L84 28 L81 30 L82 34 L79 32 L76 34 L77 30 L74 28Z" fill={P} fillOpacity="0.12"/>
  </svg>
);

const RollingPin = ({ className }) => (
  <svg className={className} viewBox="0 0 160 60" fill="none">
    <rect x="2" y="22" width="22" height="16" rx="8" stroke={P2} strokeWidth="1.5" strokeOpacity="0.6"/>
    <line x1="2" y1="28" x2="24" y2="28" stroke={P3} strokeWidth="0.9" strokeOpacity="0.35"/>
    <line x1="2" y1="32" x2="24" y2="32" stroke={P3} strokeWidth="0.9" strokeOpacity="0.35"/>
    <rect x="20" y="26" width="14" height="8" rx="0" stroke={P2} strokeWidth="1.2" strokeOpacity="0.5"/>
    <rect x="32" y="16" width="96" height="28" rx="14" stroke={P} strokeWidth="1.8" strokeOpacity="0.7"/>
    <line x1="52" y1="16" x2="52" y2="44" stroke={P3} strokeWidth="0.9" strokeOpacity="0.28"/>
    <line x1="68" y1="16" x2="68" y2="44" stroke={P3} strokeWidth="0.9" strokeOpacity="0.28"/>
    <line x1="84" y1="16" x2="84" y2="44" stroke={P3} strokeWidth="0.9" strokeOpacity="0.28"/>
    <line x1="100" y1="16" x2="100" y2="44" stroke={P3} strokeWidth="0.9" strokeOpacity="0.28"/>
    <line x1="116" y1="16" x2="116" y2="44" stroke={P3} strokeWidth="0.9" strokeOpacity="0.28"/>
    <path d="M38 20 C60 14 100 14 122 20" stroke={P3} strokeWidth="1" strokeOpacity="0.25" fill="none"/>
    <rect x="126" y="26" width="14" height="8" rx="0" stroke={P2} strokeWidth="1.2" strokeOpacity="0.5"/>
    <rect x="138" y="22" width="22" height="16" rx="8" stroke={P2} strokeWidth="1.5" strokeOpacity="0.6"/>
    <line x1="138" y1="28" x2="160" y2="28" stroke={P3} strokeWidth="0.9" strokeOpacity="0.35"/>
    <line x1="138" y1="32" x2="160" y2="32" stroke={P3} strokeWidth="0.9" strokeOpacity="0.35"/>
  </svg>
);

const Heart = ({ className }) => (
  <svg className={className} viewBox="0 0 80 72" fill="none">
    <path d="M40 64 C40 64 6 44 6 22 C6 12 14 4 24 4 C30 4 36 8 40 14 C44 8 50 4 56 4 C66 4 74 12 74 22 C74 44 40 64 40 64Z" stroke={P} strokeWidth="1.8" strokeOpacity="0.7" fill={P} fillOpacity="0.06"/>
    <path d="M40 64 C40 64 14 46 12 26" stroke={P3} strokeWidth="1" strokeOpacity="0.3" fill="none"/>
    <circle cx="28" cy="18" r="3" fill={P} fillOpacity="0.25"/>
  </svg>
);

const WheatStalk = ({ className }) => (
  <svg className={className} viewBox="0 0 80 170" fill="none">
    <path d="M40 100 L40 162" stroke={P2} strokeWidth="3" strokeOpacity="0.5" strokeLinecap="round"/>
    <line x1="32" y1="125" x2="48" y2="125" stroke={P3} strokeWidth="1.1" strokeOpacity="0.35"/>
    <line x1="32" y1="138" x2="48" y2="138" stroke={P3} strokeWidth="1.1" strokeOpacity="0.35"/>
    <line x1="32" y1="151" x2="48" y2="151" stroke={P3} strokeWidth="1.1" strokeOpacity="0.35"/>
    <path d="M40 100 C40 72 18 44 12 16" stroke={P} strokeWidth="1.5" strokeOpacity="0.6" fill="none" strokeLinecap="round"/>
    <path d="M40 100 C40 72 28 40 22 10" stroke={P} strokeWidth="1.5" strokeOpacity="0.6" fill="none" strokeLinecap="round"/>
    <path d="M40 100 C40 72 37 38 36 8" stroke={P} strokeWidth="1.5" strokeOpacity="0.6" fill="none" strokeLinecap="round"/>
    <path d="M40 100 C40 72 43 38 44 8" stroke={P} strokeWidth="1.5" strokeOpacity="0.6" fill="none" strokeLinecap="round"/>
    <path d="M40 100 C40 72 52 40 58 10" stroke={P} strokeWidth="1.5" strokeOpacity="0.6" fill="none" strokeLinecap="round"/>
    <path d="M40 100 C40 72 62 44 68 16" stroke={P} strokeWidth="1.5" strokeOpacity="0.6" fill="none" strokeLinecap="round"/>
    <path d="M22 62 Q40 52 58 62" stroke={P3} strokeWidth="1" strokeOpacity="0.35" fill="none"/>
    <path d="M16 40 Q40 28 64 40" stroke={P3} strokeWidth="1" strokeOpacity="0.3" fill="none"/>
    <path d="M14 24 Q40 10 66 24" stroke={P3} strokeWidth="1" strokeOpacity="0.28" fill="none"/>
  </svg>
);

const Sparkle = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    <path d="M20 4 L21.5 17 L34 20 L21.5 23 L20 36 L18.5 23 L6 20 L18.5 17Z" stroke={P} strokeWidth="1.3" strokeOpacity="0.6" fill={P} fillOpacity="0.08" strokeLinejoin="round"/>
  </svg>
);

const TieredCake = ({ className }) => (
  <svg className={className} viewBox="0 0 130 175" fill="none">
    <ellipse cx="65" cy="172" rx="46" ry="6" fill={P} fillOpacity="0.07"/>
    <rect x="8" y="118" width="114" height="52" rx="6" stroke={P} strokeWidth="1.8" strokeOpacity="0.65"/>
    <path d="M8 132 Q20 118 32 132 Q44 146 56 132 Q68 118 80 132 Q92 146 104 132 Q114 124 122 118" stroke={P3} strokeWidth="1.3" strokeOpacity="0.45" fill="none"/>
    <circle cx="38" cy="150" r="3" fill={P} fillOpacity="0.35"/>
    <circle cx="65" cy="150" r="3" fill={P} fillOpacity="0.35"/>
    <circle cx="92" cy="150" r="3" fill={P} fillOpacity="0.35"/>
    <rect x="24" y="72" width="82" height="48" rx="5" stroke={P} strokeWidth="1.7" strokeOpacity="0.62"/>
    <path d="M24 86 Q35 72 46 86 Q57 100 68 86 Q79 72 90 86 Q98 79 106 72" stroke={P3} strokeWidth="1.2" strokeOpacity="0.4" fill="none"/>
    <circle cx="50" cy="100" r="2.5" fill={P} fillOpacity="0.3"/>
    <circle cx="78" cy="100" r="2.5" fill={P} fillOpacity="0.3"/>
    <rect x="38" y="38" width="54" height="36" rx="4" stroke={P} strokeWidth="1.6" strokeOpacity="0.6"/>
    <path d="M38 50 Q47 38 56 50 Q65 62 74 50 Q80 44 92 38" stroke={P3} strokeWidth="1.2" strokeOpacity="0.4" fill="none"/>
    <circle cx="65" cy="56" r="2" fill={P} fillOpacity="0.28"/>
    <rect x="62" y="16" width="6" height="24" rx="2" stroke={P2} strokeWidth="1.4" strokeOpacity="0.65"/>
    <path d="M65 16 C61 10 60 4 65 1 C70 4 69 10 65 16Z" stroke={P} strokeWidth="1.1" strokeOpacity="0.8" fill={P} fillOpacity="0.15"/>
    <path d="M2 88 L3.5 83 L5 88 L10 88 L6 91 L7.5 96 L3.5 93 L-0.5 96 L1 91 L-3 88Z" fill={P} fillOpacity="0.14"/>
    <path d="M120 52 L121 48 L122 52 L126 52 L123 54 L124 58 L121 56 L118 58 L119 54 L116 52Z" fill={P} fillOpacity="0.12"/>
  </svg>
);

const AboutHero = () => (
  <section className="relative min-h-[62vh] flex items-center overflow-hidden bg-[#fdf2f8]">

    {/* soft center glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-30 blur-3xl pointer-events-none"
      style={{ background: "radial-gradient(ellipse, #f9a8d4 0%, transparent 70%)" }} />

    {/* dot pattern */}
    <div className="absolute inset-0 opacity-[0.06]"
      style={{ backgroundImage: "radial-gradient(circle, #ec4899 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

    {/* scattered doodles */}
    <motion.div {...float(7, 0.2)} className="absolute top-12 left-8 opacity-35 hidden lg:block">
      <Sparkle className="w-12 h-12" />
    </motion.div>
    <motion.div {...float(5, 1)} className="absolute top-24 right-[42%] opacity-30">
      <Sparkle className="w-8 h-8" />
    </motion.div>
    <motion.div {...float(8, 0.5)} className="absolute bottom-16 left-[38%] opacity-30 hidden md:block">
      <Heart className="w-10 h-10" />
    </motion.div>

    <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-14 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* ── Left: content ── */}
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border mb-6"
            style={{ color: "#ec4899", borderColor: "#ec489940", background: "#fff" }}>
            ✦ Our Story in Every Bake
          </span> */}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-4xl font-black text-slate-800 leading-[1.1] mb-6 tracking-tight">
          Baked With{" "}
          <span className="relative inline-block">
            <span style={{ color: "#ec4899" }}>Passion</span>
            {/* <motion.span
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left rounded-full"
              style={{ backgroundColor: "#ec4899" }} /> */}
          </span>
          {" "}&amp; Purpose
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-slate-500 text-lg leading-relaxed max-w-xl">
          From a small home kitchen to your most treasured celebrations — every layer we bake carries the warmth of tradition, the precision of craft, and the joy of sharing.
        </motion.p>
      </div>

      {/* ── Right: doodle cluster ── */}
      <div className="relative flex items-center justify-center h-64 lg:h-[340px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full border border-[#ec4899]/15" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-52 h-52 lg:w-64 lg:h-64 rounded-full border border-[#ec4899]/10" />
        </div>

        <motion.div {...float(7, 0)} className="relative z-10">
          <TieredCake className="w-44 h-auto lg:w-56" />
        </motion.div>

        <motion.div {...float(5, 0.8)} className="absolute top-4 right-8 lg:right-16">
          <Heart className="w-16 h-14 lg:w-20 lg:h-18" />
        </motion.div>
        <motion.div {...float(6, 1.5)} className="absolute bottom-8 left-4 lg:left-8">
          <RollingPin className="w-28 lg:w-36 opacity-80" />
        </motion.div>
        <motion.div {...float(8, 0.3)} className="absolute top-16 left-2 lg:left-4">
          <CakeSlice className="w-16 h-20 lg:w-20 lg:h-24" />
        </motion.div>
        <motion.div {...float(6, 2)} className="absolute bottom-4 right-4 lg:right-10">
          <WheatStalk className="w-10 h-auto lg:w-12 opacity-70" />
        </motion.div>
        <motion.div {...float(4, 1)} className="absolute top-2 left-[45%]">
          <Sparkle className="w-8 h-8 opacity-70" />
        </motion.div>
      </div>
    </div>
  </section>
);

export default AboutHero;
