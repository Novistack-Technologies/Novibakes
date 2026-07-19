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

const Envelope = ({ className }) => (
  <svg className={className} viewBox="0 0 150 110" fill="none">
    <rect x="6" y="14" width="138" height="90" rx="6" stroke={P} strokeWidth="1.8" strokeOpacity="0.7"/>
    <path d="M6 20 L75 64 L144 20" stroke={P} strokeWidth="1.5" strokeOpacity="0.6" fill="none"/>
    <path d="M6 104 L50 60" stroke={P3} strokeWidth="1.1" strokeOpacity="0.35" fill="none"/>
    <path d="M144 104 L100 60" stroke={P3} strokeWidth="1.1" strokeOpacity="0.35" fill="none"/>
    <path d="M75 48 C75 48 62 38 62 30 C62 25 66 22 70 24 C72 25 74 27 75 30 C76 27 78 25 80 24 C84 22 88 25 88 30 C88 38 75 48 75 48Z" stroke={P} strokeWidth="1.3" strokeOpacity="0.6" fill={P} fillOpacity="0.08"/>
    <path d="M10 14 Q75 0 140 14" stroke={P3} strokeWidth="0.9" strokeOpacity="0.25" fill="none"/>
  </svg>
);

const ChatBubble = ({ className }) => (
  <svg className={className} viewBox="0 0 130 110" fill="none">
    <path d="M10 8 Q10 8 120 8 Q130 8 130 20 L130 72 Q130 84 120 84 L50 84 L24 104 L30 84 L20 84 Q10 84 10 72 L10 20 Q10 8 10 8Z" stroke={P} strokeWidth="1.7" strokeOpacity="0.65" fill="none" strokeLinejoin="round"/>
    <line x1="30" y1="32" x2="100" y2="32" stroke={P3} strokeWidth="1.3" strokeOpacity="0.4"/>
    <line x1="30" y1="48" x2="100" y2="48" stroke={P3} strokeWidth="1.3" strokeOpacity="0.4"/>
    <line x1="30" y1="64" x2="72" y2="64" stroke={P3} strokeWidth="1.3" strokeOpacity="0.4"/>
    <circle cx="110" cy="64" r="3.5" fill={P} fillOpacity="0.3"/>
    <circle cx="98" cy="64" r="3.5" fill={P} fillOpacity="0.3"/>
    <circle cx="86" cy="64" r="3.5" fill={P} fillOpacity="0.3"/>
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 90 140" fill="none">
    <rect x="10" y="8" width="70" height="124" rx="10" stroke={P} strokeWidth="1.7" strokeOpacity="0.65"/>
    <rect x="18" y="20" width="54" height="90" rx="4" stroke={P3} strokeWidth="1.2" strokeOpacity="0.4"/>
    <circle cx="45" cy="122" r="5" stroke={P} strokeWidth="1.3" strokeOpacity="0.6" fill="none"/>
    <line x1="34" y1="14" x2="56" y2="14" stroke={P2} strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round"/>
    <path d="M36 62 Q45 52 54 62" stroke={P} strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
    <path d="M30 70 Q45 56 60 70" stroke={P3} strokeWidth="1.2" strokeOpacity="0.35" fill="none"/>
    <path d="M24 78 Q45 60 66 78" stroke={P3} strokeWidth="1" strokeOpacity="0.25" fill="none"/>
    <circle cx="45" cy="66" r="3" stroke={P} strokeWidth="1.2" strokeOpacity="0.7" fill={P} fillOpacity="0.12"/>
  </svg>
);

const LocationPin = ({ className }) => (
  <svg className={className} viewBox="0 0 80 120" fill="none">
    <path d="M40 8 C22 8 8 22 8 40 C8 62 40 112 40 112 C40 112 72 62 72 40 C72 22 58 8 40 8Z" stroke={P} strokeWidth="1.7" strokeOpacity="0.65" fill={P} fillOpacity="0.06"/>
    <circle cx="40" cy="40" r="14" stroke={P} strokeWidth="1.4" strokeOpacity="0.6" fill="none"/>
    <circle cx="40" cy="40" r="5" fill={P} fillOpacity="0.3"/>
    <path d="M16 24 C22 16 32 12 40 12" stroke={P3} strokeWidth="1" strokeOpacity="0.3" fill="none" strokeLinecap="round"/>
  </svg>
);

const Sparkle = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    <path d="M20 4 L21.5 17 L34 20 L21.5 23 L20 36 L18.5 23 L6 20 L18.5 17Z"
      stroke={P} strokeWidth="1.3" strokeOpacity="0.6" fill={P} fillOpacity="0.08" strokeLinejoin="round"/>
  </svg>
);

const Star = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none">
    <path d="M24 4 L27 18 L42 18 L30 28 L34 42 L24 33 L14 42 L18 28 L6 18 L21 18Z"
      stroke={P} strokeWidth="1.4" strokeOpacity="0.55" fill={P} fillOpacity="0.06" strokeLinejoin="round"/>
  </svg>
);

const Support = () => (
  <section className="relative min-h-[62vh] flex items-center overflow-hidden bg-[#fdf2f8]">

    {/* soft glow center */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-30 blur-3xl pointer-events-none"
      style={{ background: "radial-gradient(ellipse, #f9a8d4 0%, transparent 70%)" }} />

    {/* subtle dot pattern */}
    <div className="absolute inset-0 opacity-[0.06]"
      style={{ backgroundImage: "radial-gradient(circle, #ec4899 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

    {/* bg doodles */}
    <motion.div {...float(6, 0.3)} className="absolute top-12 left-12 opacity-40 hidden lg:block">
      <Sparkle className="w-10 h-10" />
    </motion.div>
    <motion.div {...float(5, 1.1)} className="absolute top-24 right-[44%] opacity-35">
      <Star className="w-7 h-7" />
    </motion.div>
    <motion.div {...float(7, 0.6)} className="absolute bottom-20 left-[42%] opacity-35 hidden md:block">
      <Sparkle className="w-8 h-8" />
    </motion.div>

    <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-14 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

      {/* ── Left: content ── */}
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border mb-6"
            style={{ color: "#ec4899", borderColor: "#ec489940", background: "#fff" }}>
            ✦ Your Sweet Moments Are Our Priority
          </span> */}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-4xl font-black text-slate-800 leading-[1.1] mb-6 tracking-tight">
          Let's{" "}
          <span className="relative inline-block">
            <span style={{ color: "#ec4899" }}>Connect</span>
            {/* <motion.span
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left rounded-full"
              style={{ backgroundColor: "#ec4899" }} /> */}
          </span>
          {" "}&amp; Create Magic
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-slate-500 text-lg leading-relaxed max-w-xl">
          Have a custom order in mind? A question about our menu? We're just one message away — friendly, fast, and always happy to help turn your vision into something delicious.
        </motion.p>
      </div>

      {/* ── Right: doodle cluster ── */}
      <div className="relative flex items-center justify-center h-64 lg:h-[340px]">

        {/* rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full border border-[#ec4899]/15" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 lg:w-60 lg:h-60 rounded-full border border-[#ec4899]/10" />
        </div>

        {/* main doodle */}
        <motion.div {...float(7, 0)} className="relative z-10">
          <Envelope className="w-44 h-auto lg:w-56" />
        </motion.div>

        {/* orbiting */}
        <motion.div {...float(5, 0.9)} className="absolute top-4 right-4 lg:right-10">
          <ChatBubble className="w-24 lg:w-32 opacity-80" />
        </motion.div>
        <motion.div {...float(6, 1.7)} className="absolute bottom-6 left-2 lg:left-6">
          <PhoneIcon className="w-16 h-auto lg:w-20 opacity-75" />
        </motion.div>
        <motion.div {...float(8, 0.4)} className="absolute top-10 left-4 lg:left-10">
          <LocationPin className="w-12 h-auto lg:w-14 opacity-70" />
        </motion.div>
        <motion.div {...float(4, 1.4)} className="absolute bottom-8 right-6 lg:right-14">
          <Sparkle className="w-10 h-10 opacity-60" />
        </motion.div>
        <motion.div {...float(5, 2.2)} className="absolute top-2 left-[46%]">
          <Star className="w-8 h-8 opacity-55" />
        </motion.div>
      </div>
    </div>
  </section>
);

export default Support;
