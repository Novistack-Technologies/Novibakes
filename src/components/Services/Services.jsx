import { motion } from "framer-motion";
import { Cake, Gift, Truck, UtensilsCrossed, ShoppingBag, ArrowRight, GraduationCap } from "lucide-react";
import { ourProcess as localProcess, serviceCardInfo as localServices } from "../../data/data.js";
// import { useSanity } from "../hooks/useSanity.js";
// import { OUR_PROCESS_QUERY, SERVICES_QUERY } from "../lib/queries.js";

const ICON_MAP = { Cake, Gift, Truck, UtensilsCrossed, ShoppingBag, GraduationCap };
const COLOR_MAP = { Cake: "text-[#ec4899]", UtensilsCrossed: "text-[#ec4899]", Gift: "text-purple-500", GraduationCap: "text-blue-500", ShoppingBag: "text-emerald-500", Truck: "text-[#ec4899]" };

const hardcodedServices = [
  { icon: Cake, title: "Custom Cake Orders", color: "text-[#ec4899]", description: "From elegant wedding cakes to whimsical birthday creations, our pastry chefs bring your sweetest dreams to life. Every cake is a unique masterpiece designed just for you.", tag: "Most Popular" },
  { icon: UtensilsCrossed, title: "Catering Services", color: "text-[#ec4899]", description: "Elevate your events with our premium catering. From corporate gatherings to intimate celebrations, we craft dessert spreads that leave lasting impressions on every guest.", tag: "Events" },
  { icon: Gift, title: "Corporate Gifting", color: "text-purple-500", description: "Impress clients and reward your team with beautifully curated gift boxes. Premium packaging, personalized branding, and our finest baked creations — all in one.", tag: "Corporate" },
  { icon: GraduationCap, title: "Baking Classes", color: "text-blue-500", description: "Learn the art of baking from our master chefs. Weekend workshops for beginners, advanced courses for enthusiasts. Small groups ensure personal attention.", tag: "Learn" },
  { icon: ShoppingBag, title: "Wholesale Orders", color: "text-emerald-500", description: "Partner with us for your restaurant, cafe, or retail business. Consistent quality, reliable delivery, and competitive pricing for bulk orders of our signature products.", tag: "Business" },
  { icon: Truck, title: "Delivery & Shipping", color: "text-[#ec4899]", description: "Fresh from our ovens to your doorstep. Same-day local delivery and carefully packaged shipping available for select items — free on orders above ₹500.", tag: "Delivery" },
];

const ServiceDetail = () => {
  // const { data: sanityServices } = useSanity(SERVICES_QUERY, null);
  // const { data: sanityProcess } = useSanity(OUR_PROCESS_QUERY, null);

  const services = hardcodedServices;
  const process = localProcess;

  return (
    <div className="pt-5">
      <div className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
              Our <span style={{ color: "#ec4899" }}>Services</span>
            </motion.h1>
            <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="h-1 rounded-full mx-auto mb-6" style={{ width: 80, backgroundColor: "#ec4899" }} />
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="text-base md:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
              Discover how we can sweeten your celebrations and everyday moments with our handcrafted baking experiences.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div key={service.title} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-white rounded-3xl p-5 md:p-6 hover:shadow-xl transition-all duration-300 group border border-neutral-100 hover:border-rose-50 flex flex-col">
                <div className="mb-5 w-full flex justify-center">
                  <service.icon className={`w-10 h-10 md:w-11 md:h-11 ${service.color} transition-transform duration-300 group-hover:scale-110`} strokeWidth={1.8} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3 text-center">{service.title}</h3>
                <p className="text-slate-700 leading-relaxed mb-6 text-sm flex-grow">{service.description}</p>
                <div className="flex justify-center mt-auto">
                  <a href="#cta" className="inline-flex items-center gap-1 font-medium text-sm transition-all duration-200 hover:gap-2" style={{ color: "#ec4899" }}>
                    Get Quote <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
