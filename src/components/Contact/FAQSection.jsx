import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
// import { useSanity } from "../hooks/useSanity.js";
// import { FAQS_QUERY } from "../lib/queries.js";

const localFaqs = [
  { question: "How far in advance should I place my order?", answer: "For standard cakes and treats, we recommend ordering at least 2-3 days in advance. For custom designs and special occasions like weddings, please book 2-4 weeks ahead to ensure availability." },
  { question: "Do you deliver, and what is your delivery area?", answer: "Yes, we offer delivery services throughout the Salem area. Delivery charges may apply based on location and order size. We ensure that all our treats arrive in perfect condition." },
  { question: "Can you accommodate dietary restrictions?", answer: "Yes, we can create desserts to accommodate various dietary needs, including eggless options. Please let us know your specific requirements when placing your order." },
  { question: "How do I place an order?", answer: "You can place orders by phone, email, WhatsApp, or through our website. We'll confirm your order details and provide you with a quote and estimated completion time." },
  { question: "Do you offer sampling before ordering a wedding cake?", answer: "Yes, we offer cake tastings for wedding clients. Please contact us to schedule a tasting appointment at least 2-3 months before your event." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  // const { data: sanityData } = useSanity(FAQS_QUERY, null);
  const faqs = localFaqs;

  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="pt-14 pb-4">
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-3">
          Frequently Asked <span style={{ color: "#ec4899" }}>Questions</span>
        </h2>
        <div className="h-1 w-16 rounded-full mx-auto" style={{ backgroundColor: "#ec4899" }} />
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="overflow-hidden rounded-2xl border border-rose-50 bg-white shadow-sm">
              <button onClick={() => setOpenIndex(isOpen ? null : index)} className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-pink-50">
                <h3 className="pr-4 text-base font-semibold text-slate-800">{faq.question}</h3>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full" style={{ backgroundColor: isOpen ? "#ec4899" : "#fdf2f8", color: isOpen ? "white" : "#ec4899" }}>
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-6 pb-5 text-slate-800 text-sm leading-relaxed border-t border-pink-50 pt-3">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
