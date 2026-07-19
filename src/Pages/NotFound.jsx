import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ShoppingBag } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-8xl font-bold" style={{ color: "#ec4899" }}>404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-800">Page Not Found</h1>
        <p className="mt-3 text-slate-700 max-w-sm mx-auto text-sm leading-relaxed">
          Looks like this page got eaten before we could bake it. Let's get you back to something delicious.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#ec4899" }}
          >
            <Home className="w-4 h-4" /> Go Home
          </button>
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-slate-700 text-sm font-semibold hover:bg-gray-50 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" /> Browse Shop
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
