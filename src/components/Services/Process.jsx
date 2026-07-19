import React from 'react';
import { motion } from 'framer-motion';
import { ourProcess as localProcess } from "../../data/data.js";

const Process = () => {
  return (
    <div className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-white">

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-3 tracking-tight">
            From Order to <span style={{ color: "#ec4899" }}>Your Door</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
            A simple, seamless experience — focus on celebrating while we handle every detail of the baking.
          </p>
        </motion.div>

        {/* steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">

          {/* connector line — desktop */}
          <div
            className="hidden lg:block absolute top-11 left-[14%] right-[14%] h-px z-0"
            style={{ background: "linear-gradient(to right, transparent, #ec489945, #ec489945, transparent)" }}
          />

          {localProcess.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="relative flex flex-col items-center text-center z-10 group"
            >
              {/* icon circle */}
              <div className="relative mb-5">
                <div
                  className="w-[88px] h-[88px] rounded-full flex flex-col items-center justify-center border transition-all duration-300 group-hover:scale-105"
                  style={{
                    background: "#fdf2f8",
                    borderColor: "#f9a8d4",
                    boxShadow: "0 0 0 6px rgba(236,72,153,0.06)",
                  }}
                >
                  <span className="text-3xl leading-none">{item.emoji}</span>
                </div>
                {/* step badge */}
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white"
                  style={{ background: "#ec4899", boxShadow: "0 2px 8px #ec489966" }}
                >
                  {idx + 1}
                </div>
              </div>

              {/* card body */}
              <div
                className="w-full rounded-2xl px-4 py-5 flex flex-col items-center gap-2 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg"
                style={{
                  background: "#fff",
                  border: "1px solid #fce7f3",
                }}
              >
                <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#ec4899" }}>
                  Step {item.step}
                </p>
                <h3 className="text-sm font-bold text-slate-800 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Process;