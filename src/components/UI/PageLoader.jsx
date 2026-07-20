import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CakeSlice } from "lucide-react";

const PageLoader = ({ show = true }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        key="page-loader"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      >
        <div className="relative flex items-center justify-center mb-6">
          <motion.div
            className="absolute rounded-full"
            style={{ width: 90, height: 90, background: "radial-gradient(circle, #ec489930, transparent 70%)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full border-2 border-t-transparent"
            style={{ width: 76, height: 76, borderColor: "#ec489950", borderTopColor: "#ec4899" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          {/* CakeSlice icon as logo */}
          <motion.div
            className="w-14 h-14 rounded-full flex items-center justify-center relative z-10 shadow-md"
            style={{ backgroundColor: "#ec4899" }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "backOut" }}
          >
            <CakeSlice className="w-7 h-7 text-white" />
          </motion.div>
        </div>

        <motion.p
          className="text-lg font-bold tracking-wide text-slate-800"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          NoviBakes
        </motion.p>

        <div className="flex items-center gap-1.5 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#ec4899" }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
            />
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const MiniLoader = ({ className = "py-24" }) => (
  <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute rounded-full"
        style={{ width: 64, height: 64, background: "radial-gradient(circle, #ec489930, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full border-2 border-t-transparent"
        style={{ width: 54, height: 54, borderColor: "#ec489950", borderTopColor: "#ec4899" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center relative z-10 shadow-sm"
        style={{ backgroundColor: "#ec4899" }}
      >
        <CakeSlice className="w-5 h-5 text-white" />
      </div>
    </div>
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#ec4899" }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  </div>
);

export default PageLoader;