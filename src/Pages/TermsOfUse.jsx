import { motion } from "framer-motion";
import { FileText, ShoppingBag, CreditCard, Truck, RefreshCw, AlertCircle, Scale } from "lucide-react";

const P = "#ec4899";
const P2 = "#db2777";
const P3 = "#f9a8d4";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: d, ease: "easeOut" } }),
};

const float = (duration = 6, delay = 0) => ({
  animate: {
    y: [0, -14, 0],
    rotate: [0, 3, 0],
    transition: { duration, repeat: Infinity, ease: "easeInOut", delay },
  },
});

const Sparkle = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    <path d="M20 4 L21.5 17 L34 20 L21.5 23 L20 36 L18.5 23 L6 20 L18.5 17Z" stroke={P} strokeWidth="1.3" strokeOpacity="0.6" fill={P} fillOpacity="0.08" strokeLinejoin="round"/>
  </svg>
);

const ScrollDoodle = ({ className }) => (
  <svg className={className} viewBox="0 0 100 130" fill="none">
    <rect x="12" y="8" width="76" height="110" rx="10" stroke={P} strokeWidth="1.8" strokeOpacity="0.65" fill={P} fillOpacity="0.04"/>
    <rect x="8" y="12" width="8" height="100" rx="4" stroke={P2} strokeWidth="1.4" strokeOpacity="0.55" fill="none"/>
    <line x1="28" y1="32" x2="76" y2="32" stroke={P3} strokeWidth="1.2" strokeOpacity="0.45"/>
    <line x1="28" y1="46" x2="76" y2="46" stroke={P3} strokeWidth="1.2" strokeOpacity="0.4"/>
    <line x1="28" y1="60" x2="76" y2="60" stroke={P3} strokeWidth="1.2" strokeOpacity="0.4"/>
    <line x1="28" y1="74" x2="60" y2="74" stroke={P3} strokeWidth="1.2" strokeOpacity="0.35"/>
    <line x1="28" y1="88" x2="68" y2="88" stroke={P3} strokeWidth="1.2" strokeOpacity="0.35"/>
    <circle cx="22" cy="32" r="3" fill={P} fillOpacity="0.3"/>
    <circle cx="22" cy="46" r="3" fill={P} fillOpacity="0.25"/>
    <circle cx="22" cy="60" r="3" fill={P} fillOpacity="0.25"/>
    <path d="M86 4 L87.5 -1 L89 4 L94 4 L90 7 L91.5 12 L87.5 9 L83.5 12 L85 7 L81 4Z" fill={P} fillOpacity="0.14"/>
    <circle cx="82" cy="118" r="2.5" fill={P} fillOpacity="0.2"/>
  </svg>
);

const GavelDoodle = ({ className }) => (
  <svg className={className} viewBox="0 0 110 110" fill="none">
    <rect x="10" y="30" width="55" height="28" rx="8" transform="rotate(-40 10 30)" stroke={P} strokeWidth="1.8" strokeOpacity="0.65" fill={P} fillOpacity="0.05"/>
    <line x1="55" y1="60" x2="88" y2="95" stroke={P2} strokeWidth="3.5" strokeOpacity="0.5" strokeLinecap="round"/>
    <rect x="72" y="88" width="32" height="14" rx="4" transform="rotate(-40 72 88)" stroke={P} strokeWidth="1.5" strokeOpacity="0.55" fill="none"/>
    <circle cx="20" cy="20" r="3" fill={P} fillOpacity="0.2"/>
    <path d="M95 8 L96.5 3 L98 8 L103 8 L99 11 L100.5 16 L96.5 13 L92.5 16 L94 11 L90 8Z" fill={P} fillOpacity="0.13"/>
  </svg>
);

const Heart = ({ className }) => (
  <svg className={className} viewBox="0 0 80 72" fill="none">
    <path d="M40 64 C40 64 6 44 6 22 C6 12 14 4 24 4 C30 4 36 8 40 14 C44 8 50 4 56 4 C66 4 74 12 74 22 C74 44 40 64 40 64Z" stroke={P} strokeWidth="1.8" strokeOpacity="0.7" fill={P} fillOpacity="0.06"/>
    <circle cx="28" cy="18" r="3" fill={P} fillOpacity="0.25"/>
  </svg>
);

const sections = [
  {
    icon: ShoppingBag,
    title: "Orders & Availability",
    color: "text-[#ec4899]",
    bg: "bg-pink-50",
    content: [
      "All orders are subject to availability. We reserve the right to limit quantities or refuse orders at our discretion.",
      "Custom cake orders require a minimum of 48 hours' notice. Orders for special occasions (weddings, large events) require at least 7 days' advance notice.",
      "By placing an order you confirm that all information provided — including delivery address and contact details — is accurate and complete.",
      "We will contact you via phone or WhatsApp to confirm your order. Orders are only confirmed once you receive a confirmation message from us.",
    ],
  },
  {
    icon: CreditCard,
    title: "Pricing & Payments",
    color: "text-purple-500",
    bg: "bg-purple-50",
    content: [
      "All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise.",
      "Prices are subject to change without prior notice. The price at the time of order confirmation is the final price.",
      "We accept payments via UPI, credit/debit cards, net banking, and cash on delivery (where available).",
      "Full payment or a deposit may be required for custom or large orders before production begins.",
      "In case of a payment dispute, please contact us within 48 hours of the transaction.",
    ],
  },
  {
    icon: Truck,
    title: "Delivery Policy",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    content: [
      "We deliver within our serviceable areas. Delivery availability will be confirmed when you place your order.",
      "Estimated delivery times are provided in good faith. NoviBakes is not liable for delays caused by traffic, weather, or other circumstances beyond our control.",
      "Orders above ₹1,000 qualify for free delivery. A delivery fee of ₹50 applies to orders below this threshold.",
      "You are responsible for ensuring someone is available at the delivery address to receive the order. Failed deliveries due to unavailability may incur additional charges.",
    ],
  },
  {
    icon: RefreshCw,
    title: "Cancellations & Refunds",
    color: "text-blue-500",
    bg: "bg-blue-50",
    content: [
      "Standard orders may be cancelled up to 12 hours before the scheduled delivery time for a full refund.",
      "Custom cake orders cancelled within 24 hours of the requested delivery time will not be eligible for a refund, as ingredients and labour are committed.",
      "Refunds for quality issues will be considered on a case-by-case basis. Please contact us within 2 hours of receiving your order with photos.",
      "Approved refunds will be processed to the original payment method within 5–7 business days.",
    ],
  },
  {
    icon: AlertCircle,
    title: "Allergen & Dietary Notice",
    color: "text-rose-500",
    bg: "bg-rose-50",
    content: [
      "Our products may contain or have been prepared in a facility that handles nuts, dairy, eggs, gluten, and other allergens.",
      "While we take care to accommodate dietary requirements, we cannot guarantee a completely allergen-free environment.",
      "Customers with severe allergies or specific dietary restrictions must notify us at the time of ordering. We will advise accordingly.",
      "NoviBakes is not liable for allergic reactions resulting from failure to disclose known allergies when ordering.",
    ],
  },
  {
    icon: Scale,
    title: "Intellectual Property",
    color: "text-[#ec4899]",
    bg: "bg-pink-50",
    content: [
      "All content on this website — including logos, images, text, and design — is the property of NoviBakes and protected by applicable copyright laws.",
      "You may not reproduce, redistribute, or use our content for commercial purposes without prior written permission.",
      "User-submitted content (reviews, photos) remains your property, but by submitting you grant NoviBakes a non-exclusive licence to use it for marketing purposes.",
    ],
  },
  {
    icon: FileText,
    title: "Governing Law & Disputes",
    color: "text-teal-500",
    bg: "bg-teal-50",
    content: [
      "These Terms of Use are governed by the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of courts in the relevant local district.",
      "We encourage customers to contact us directly to resolve any issues before pursuing formal legal action.",
      "NoviBakes reserves the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.",
      "If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force.",
    ],
  },
];

const TermsOfUse = () => (
  <div className="pt-16 bg-white min-h-screen">

    {/* ── Hero ── */}
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

        {/* Left: content */}
        <div>
          {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border mb-6"
              style={{ color: "#ec4899", borderColor: "#ec489940", background: "#fff" }}>
              ✦ Legal
            </span>
          </motion.div> */}

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-4xl font-black text-slate-800 leading-[1.1] mb-6 tracking-tight">
            Terms of{" "}
            <span className="relative inline-block">
              <span style={{ color: "#ec4899" }}>Service</span>
              <motion.span
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -bottom-1 left-0 right-0 h-0.5 origin-left rounded-full"
                style={{ backgroundColor: "#ec4899" }} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-slate-500 text-lg leading-relaxed max-w-xl">
            Please read these terms carefully before using our website or placing an order with NoviBakes.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-slate-400 text-sm mt-4">
            Last updated: June 2026
          </motion.p>
        </div>

        {/* Right: doodle cluster */}
        <div className="relative flex items-center justify-center h-64 lg:h-[340px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full border border-[#ec4899]/15" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-52 h-52 lg:w-64 lg:h-64 rounded-full border border-[#ec4899]/10" />
          </div>

          <motion.div {...float(7, 0)} className="relative z-10">
            <ScrollDoodle className="w-44 h-auto lg:w-56" />
          </motion.div>

          <motion.div {...float(5, 0.8)} className="absolute top-4 right-8 lg:right-16">
            <GavelDoodle className="w-16 h-20 lg:w-20 lg:h-24" />
          </motion.div>
          <motion.div {...float(6, 1.5)} className="absolute bottom-8 left-4 lg:left-8">
            <Heart className="w-16 h-14 lg:w-20 opacity-80" />
          </motion.div>
          <motion.div {...float(4, 1)} className="absolute top-2 left-[45%]">
            <Sparkle className="w-8 h-8 opacity-70" />
          </motion.div>
          <motion.div {...float(6, 2)} className="absolute bottom-4 right-4 lg:right-10">
            <Sparkle className="w-10 h-10 opacity-50" />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Content */}
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-14">

      {/* Intro card */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="bg-white rounded-2xl border border-rose-50 shadow-sm p-6 mb-10">
        <p className="text-slate-700 leading-relaxed text-sm sm:text-base">
          Welcome to NoviBakes. By accessing our website or placing an order, you agree to be bound by these
          Terms of Service. If you do not agree with any part of these terms, please do not use our services.
          These terms apply to all visitors, customers, and anyone who interacts with our platform.
        </p>
      </motion.div>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.title}
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}
              variants={fadeUp} custom={i * 0.05}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">{s.title}</h2>
              </div>
              <ul className="px-6 py-5 space-y-3">
                {s.content.map((line, j) => (
                  <li key={j} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#ec4899" }} />
                    {line}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      {/* Contact footer */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="mt-10 rounded-2xl p-6 text-center border border-pink-100"
        style={{ backgroundColor: "#fdf2f8" }}>
        <p className="text-slate-500 text-sm mb-2">Questions about these terms?</p>
        <p className="font-semibold text-base mb-1" style={{ color: "#ec4899" }}>legal@novibakes.com</p>
        <p className="text-slate-400 text-xs">We'll get back to you within 7 business days.</p>
      </motion.div>
    </div>
  </div>
);

export default TermsOfUse;
