"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * HealixSplash — Full-screen branded preloader shown once per session.
 * Plays a DNA helix animation + wordmark reveal, then exits with a wipe.
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
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070B13] overflow-hidden"
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />

          {/* Ambient glow blobs */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 0.12 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-[600px] h-[600px] rounded-full bg-blue-600 blur-[120px] pointer-events-none"
          />
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 0.08 }}
            transition={{ duration: 2.2, ease: "easeOut", delay: 0.2 }}
            className="absolute w-[400px] h-[400px] rounded-full bg-violet-600 blur-[100px] pointer-events-none translate-x-40 translate-y-20"
          />

          {/* DNA Helix SVG Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <svg
              width="64"
              height="80"
              viewBox="0 0 64 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              {/* Strand 1 */}
              <motion.path
                d="M8 10 C20 2, 44 2, 56 10 C44 18, 20 18, 8 26 C20 34, 44 34, 56 42 C44 50, 20 50, 8 58 C20 66, 44 66, 56 74"
                stroke="url(#helix-grad-1)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              {/* Strand 2 */}
              <motion.path
                d="M56 10 C44 18, 20 18, 8 26 C20 34, 44 34, 56 42 C44 50, 20 50, 8 58 C20 66, 44 66, 56 74"
                stroke="url(#helix-grad-2)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.15 }}
              />
              {/* Base pairs (rungs) */}
              {[26, 42, 58].map((y, i) => (
                <motion.line
                  key={y}
                  x1="8"
                  y1={y}
                  x2="56"
                  y2={y}
                  stroke="#3B82F6"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity={0.5}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.15 }}
                />
              ))}
              <defs>
                <linearGradient id="helix-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="helix-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Wordmark */}
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
                Healix{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  BioLabs
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85, duration: 0.5 }}
                className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-2 font-bold"
              >
                India&apos;s Biomedical Research Network
              </motion.p>
            </motion.div>
          </div>

          {/* Loading bar */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-[2px] bg-slate-800 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full"
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
