"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * HealixSplash — Pure white background, big fast-spinning circular ring preloader with official logo.
 */
export default function HealixSplash() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Only show once per session
    const alreadySeen = typeof window !== "undefined" ? sessionStorage.getItem("healix_splash_seen") : null;
    if (alreadySeen) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 0);

    // Auto dismiss after 2.4 s
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => {
        setVisible(false);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("healix_splash_seen", "1");
        }
      }, 700);
    }, 2400);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(timer);
    };
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
        >
          {/* Subtle Ambient Light Glows */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 right-20 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />

          {/* Dynamic Nested Spinning Rings with Official Logo */}
          <div className="relative w-52 h-52 flex items-center justify-center mb-8">
            {/* Outer Ring - Spins Fast Clockwise */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-indigo-600 border-b-transparent border-l-transparent"
            />

            {/* Inner Ring - Spins Faster Counter-Clockwise */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
              className="absolute inset-3 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-purple-500 border-l-transparent opacity-90"
            />

            {/* Logo Center Card */}
            <div className="absolute inset-7 rounded-full bg-white shadow-2xl border border-slate-100 flex items-center justify-center p-3.5">
              <motion.img
                src="/logo.png"
                alt="Healix BioLabs Logo"
                className="w-full h-full object-contain"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              />
            </div>
          </div>

          {/* Wordmark Section */}
          <div className="overflow-hidden mb-8">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              className="text-center"
            >
              <h1 className="text-3xl font-heading font-extrabold !text-slate-900 tracking-tight">
                Healix{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  BioLabs
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65, duration: 0.4 }}
                className="text-[10px] !text-slate-500 uppercase tracking-[0.35em] mt-2.5 font-bold"
              >
                India&apos;s Biomedical Research Network
              </motion.p>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-[3px] bg-slate-100 rounded-full overflow-hidden border border-slate-50"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.0, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
