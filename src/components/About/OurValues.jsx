import { motion } from "framer-motion";
import { Heart, Award, Leaf, Clock } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Passion",
    description:
      "Every creation is made with love and dedication, reflecting our deep passion for the art of baking.",
    iconColor: "text-[#ec4899]",
    bgColor: "bg-pink-50",
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "We use only the finest, locally-sourced ingredients. No shortcuts, no compromises — only excellence.",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "From eco-friendly packaging to supporting local farmers, we bake with the planet firmly in mind.",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Clock,
    title: "Tradition",
    description:
      "Honoring time-tested recipes and techniques passed down through generations of master bakers.",
    iconColor: "text-[#ec4899]",
    bgColor: "bg-pink-50",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const OurValues = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Our Values</h2>
          <div className="h-1 w-20 rounded-full mx-auto mb-4" style={{ backgroundColor: "#ec4899" }} />
          <p className="text-slate-800 max-w-xl mx-auto">
            The principles that guide everything we do
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-8 text-center border border-transparent hover:border-rose-50 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${value.bgColor}`}>
                  <Icon className={`w-8 h-8 ${value.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-800 leading-relaxed text-sm">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default OurValues;
