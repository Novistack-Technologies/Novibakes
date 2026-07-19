import { motion } from "framer-motion";
import { Shield, Eye, Lock, Database, Bell, Mail } from "lucide-react";

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

const ShieldDoodle = ({ className }) => (
  <svg className={className} viewBox="0 0 100 120" fill="none">
    <path d="M50 8 L88 24 L88 60 Q88 90 50 112 Q12 90 12 60 L12 24 Z" stroke={P} strokeWidth="1.8" strokeOpacity="0.65" fill={P} fillOpacity="0.04" strokeLinejoin="round"/>
    <path d="M50 28 L70 38 L70 60 Q70 78 50 90 Q30 78 30 60 L30 38 Z" stroke={P3} strokeWidth="1.2" strokeOpacity="0.4" fill="none"/>
    <path d="M38 58 L47 67 L65 48" stroke={P} strokeWidth="2" strokeOpacity="0.55" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="20" cy="20" r="3" fill={P} fillOpacity="0.2"/>
    <circle cx="80" cy="100" r="2.5" fill={P} fillOpacity="0.18"/>
    <path d="M8 8 L9.5 3 L11 8 L16 8 L12 11 L13.5 16 L9.5 13 L5.5 16 L7 11 L3 8Z" fill={P} fillOpacity="0.14"/>
  </svg>
);

const LockDoodle = ({ className }) => (
  <svg className={className} viewBox="0 0 90 110" fill="none">
    <rect x="10" y="48" width="70" height="55" rx="8" stroke={P} strokeWidth="1.8" strokeOpacity="0.65" fill={P} fillOpacity="0.04"/>
    <path d="M28 48 L28 30 Q28 10 45 10 Q62 10 62 30 L62 48" stroke={P} strokeWidth="1.8" strokeOpacity="0.6" fill="none" strokeLinecap="round"/>
    <circle cx="45" cy="72" r="9" stroke={P3} strokeWidth="1.4" strokeOpacity="0.5" fill={P} fillOpacity="0.08"/>
    <rect x="42" y="72" width="6" height="10" rx="2" fill={P} fillOpacity="0.25"/>
    <path d="M85 8 L86.5 3 L88 8 L93 8 L89 11 L90.5 16 L86.5 13 L82.5 16 L84 11 L80 8Z" fill={P} fillOpacity="0.13"/>
    <circle cx="15" cy="100" r="2.5" fill={P} fillOpacity="0.2"/>
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
    icon: Database,
    title: "Information We Collect",
    color: "text-[#ec4899]",
    bg: "bg-pink-50",
    content: [
      "Personal details you provide when placing an order — name, phone number, delivery address, and email address.",
      "Payment information processed securely through our payment partners. We do not store card or UPI credentials on our servers.",
      "Order history and preferences to help us personalise your experience and recommend products you may enjoy.",
      "Device and usage data (browser type, IP address, pages visited) collected automatically to improve site performance.",
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    color: "text-purple-500",
    bg: "bg-purple-50",
    content: [
      "To process, fulfil, and deliver your orders and send you confirmation and status updates.",
      "To respond to your enquiries and provide customer support.",
      "To send promotional offers, new product announcements, or seasonal deals — only if you have opted in.",
      "To improve our website, product range, and overall customer experience based on aggregated usage patterns.",
      "To comply with legal obligations and prevent fraudulent transactions.",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    content: [
      "We use industry-standard SSL encryption on all pages where personal information is submitted.",
      "Access to your data is restricted to authorised personnel only, and all staff are trained in data privacy best practices.",
      "We regularly review our security practices and update them to address emerging threats.",
      "While we take every reasonable precaution, no method of transmission over the internet is 100% secure. We encourage you to use strong, unique passwords for any accounts.",
    ],
  },
  {
    icon: Bell,
    title: "Cookies & Tracking",
    color: "text-blue-500",
    bg: "bg-blue-50",
    content: [
      "We use essential cookies to keep items in your cart and maintain your session.",
      "Analytics cookies (such as Google Analytics) help us understand how visitors interact with our site so we can improve it.",
      "You can control cookie preferences through your browser settings. Disabling certain cookies may affect site functionality.",
      "We do not sell or share cookie data with third-party advertisers.",
    ],
  },
  {
    icon: Shield,
    title: "Sharing Your Information",
    color: "text-rose-500",
    bg: "bg-rose-50",
    content: [
      "We do not sell, rent, or trade your personal information to any third party.",
      "We may share data with trusted service providers (delivery partners, payment gateways) solely to fulfil your order. They are bound by confidentiality agreements.",
      "We may disclose information if required by law, court order, or government authority.",
      "In the event of a business transfer, your data may be transferred as part of the transaction, with the same privacy protections in place.",
    ],
  },
  {
    icon: Mail,
    title: "Your Rights & Contact",
    color: "text-[#ec4899]",
    bg: "bg-pink-50",
    content: [
      "You have the right to access, correct, or delete the personal data we hold about you at any time.",
      "To opt out of marketing emails, click the unsubscribe link in any email or contact us directly.",
      "To request data deletion or a copy of your data, email us at privacy@novibakes.com.",
      "We will respond to all privacy-related requests within 7 business days.",
    ],
  },
];

const PrivacyPolicy = () => (
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
            Privacy{" "}
            <span className="relative inline-block">
              <span style={{ color: "#ec4899" }}>Policy</span>
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
            We value your trust. Here's exactly how we collect, use, and protect your personal information.
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
            <ShieldDoodle className="w-44 h-auto lg:w-56" />
          </motion.div>

          <motion.div {...float(5, 0.8)} className="absolute top-4 right-8 lg:right-16">
            <LockDoodle className="w-16 h-20 lg:w-20 lg:h-24" />
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
          NoviBakes ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains
          what information we collect when you visit our website or place an order, how we use it, and the
          choices you have. By using our services, you agree to the practices described in this policy.
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
        <p className="text-slate-500 text-sm mb-2">Questions about this policy?</p>
        <p className="font-semibold text-base mb-1" style={{ color: "#ec4899" }}>privacy@novibakes.com</p>
        <p className="text-slate-400 text-xs">We'll get back to you within 7 business days.</p>
      </motion.div>
    </div>
  </div>
);

export default PrivacyPolicy;
