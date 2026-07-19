import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingBag, Ruler, CreditCard, MessageCircle,
  Bell, Database, MapPin, ArrowRight, CheckCircle2,
} from "lucide-react";

const STEPS = [
  {
    n: 1,
    icon: ShoppingBag,
    title: "Choose Your Product",
    desc: "Browse our menu and pick your favourite cake, brownie, cupcake, or dessert box.",
    color: "#ec4899",
    bg: "#fdf2f8",
  },
  {
    n: 2,
    icon: Ruler,
    title: "Select Size & Quantity",
    desc: "Pick your preferred size, weight, and quantity. Add any custom notes for your order.",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  {
    n: 3,
    icon: CreditCard,
    title: "Complete Payment",
    desc: "Pay via GPay, PhonePe, Paytm, or any UPI. Save your transaction ID after payment.",
    color: "#0ea5e9",
    bg: "#f0f9ff",
  },
  {
    n: 4,
    icon: MessageCircle,
    title: "Confirm via WhatsApp",
    desc: "Send your order details, delivery address, and payment screenshot to us on WhatsApp to confirm.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
];

const INFO_CARDS = [
  {
    icon: Bell,
    color: "#d97706",
    bg: "#fef3c7",
    title: "WhatsApp Notification",
    desc: "Once your order is confirmed, you'll receive your unique Order ID on WhatsApp. We'll also update you when your order is being prepared and out for delivery.",
  },
  {
    icon: Database,
    color: "#7c3aed",
    bg: "#ede9fe",
    title: "Order Stored Securely",
    desc: "Your order details — items, delivery address, payment info, and status — are saved securely in our system so nothing gets lost.",
  },
  {
    icon: MapPin,
    color: "#ec4899",
    bg: "#fdf2f8",
    title: "Track Your Order",
    desc: "Use your Order ID on our Track Order page anytime to check your order status — from preparation to delivery.",
    cta: { label: "Track Order", to: "/track-order" },
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

const OrderDetails = () => {
  return (
    <section className="bg-white px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
      <div className="max-w-5xl mx-auto mt-5">

        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.5 }}
        >
          {/* <span className="inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full mb-4"
            style={{ backgroundColor: "#fdf2f8", color: "#ec4899" }}>
            Simple Ordering Process
          </span> */}
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">How to Order</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            Ordering your favourite bakes is quick and easy. Follow these 4 steps and we'll take care of the rest.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.n}
                className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                {/* step number badge */}
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center text-white shadow"
                  style={{ backgroundColor: step.color }}
                >
                  {step.n}
                </span>

                {/* icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mt-2"
                  style={{ backgroundColor: step.bg }}
                >
                  <Icon size={24} style={{ color: step.color }} />
                </div>

                <h3 className="text-sm font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>

                {/* arrow connector (not on last) */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-100 shadow flex items-center justify-center">
                      <ArrowRight size={12} className="text-slate-300" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Info cards — WhatsApp, Database, Track */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {INFO_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className="rounded-2xl p-5 border border-gray-100 flex flex-col gap-3"
                style={{ backgroundColor: card.bg }}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={fadeUp} transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: card.color + "22" }}
                >
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-1">{card.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
                {card.cta && (
                  <Link
                    to={card.cta.to}
                    className="inline-flex items-center gap-1.5 text-xs font-bold mt-auto transition-colors"
                    style={{ color: card.color }}
                  >
                    {card.cta.label} <ArrowRight size={12} />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Important notice */}
        <motion.div
          className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-10 flex gap-3"
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fadeUp} transition={{ duration: 0.4 }}
        >
          <CheckCircle2 size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 mb-1">Important Notice</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              All orders are verified before processing. Please provide accurate delivery details and a valid transaction ID. Orders with incorrect payment info or edited screenshots may be cancelled without notice.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-white font-semibold rounded-full shadow-md hover:opacity-90 transition-all duration-300"
            style={{ backgroundColor: "#ec4899" }}
          >
            <ShoppingBag size={16} /> Start Ordering
          </Link>
          <Link
            to="/track-order"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold rounded-full border-2 transition-all duration-300"
            style={{ borderColor: "#ec4899", color: "#ec4899" }}
          >
            <MapPin size={16} /> Track My Order
          </Link>
        </div>

      </div>
    </section>
  );
};

export default OrderDetails;
