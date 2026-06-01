"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScientificBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Generate fixed coordinates for clean grid intersection nodes
  const blueprintNodes = [
    { cx: "10%", cy: "15%", r: 3 },
    { cx: "25%", cy: "35%", r: 3.5 },
    { cx: "15%", cy: "65%", r: 3 },
    { cx: "75%", cy: "15%", r: 3.5 },
    { cx: "85%", cy: "45%", r: 3 },
    { cx: "70%", cy: "70%", r: 4 },
  ];

  // Helper for slow drift/float effect on floating particles
  const floatingParticles = [
    { x: "8%", y: "40%", size: 4, delay: 0, duration: 8 },
    { x: "82%", y: "25%", size: 3, delay: 1, duration: 10 },
    { x: "45%", y: "80%", size: 5, delay: 2, duration: 12 },
    { x: "20%", y: "85%", size: 3, delay: 0.5, duration: 9 },
    { x: "90%", y: "75%", size: 4.5, delay: 1.5, duration: 11 },
    { x: "60%", y: "20%", size: 3.5, delay: 3, duration: 9.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-transparent">
      {/* Crisp Institutional Grid Layer (Increased clarity) */}
      <div 
        className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(to_right,#64748B_1px,transparent_1px),linear-gradient(to_bottom,#64748B_1px,transparent_1px)] bg-[size:48px_48px]" 
        style={{ 
          maskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, #000 65%, transparent 100%)", 
          WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 50%, #000 65%, transparent 100%)" 
        }}
      />

      {/* Blueprint vectors (Clean academic lines - increased opacity and pulse animations) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.26]" xmlns="http://www.w3.org/2000/svg">
        {/* Connection paths */}
        <line x1="10%" y1="15%" x2="25%" y2="35%" stroke="#475569" strokeWidth="1" />
        <line x1="25%" y1="35%" x2="15%" y2="65%" stroke="#475569" strokeWidth="1" />
        <line x1="75%" y1="15%" x2="85%" y2="45%" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="85%" y1="45%" x2="70%" y2="70%" stroke="#475569" strokeWidth="1" />
        
        {blueprintNodes.map((n, i) => (
          <g key={`node-${i}`}>
            {/* Pulsing ring behind node */}
            <motion.circle
              cx={n.cx}
              cy={n.cy}
              r={n.r * 2.2}
              fill="#3b82f6"
              opacity={0.15}
              animate={{
                scale: [0.9, 1.4, 0.9],
                opacity: [0.08, 0.22, 0.08],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Core node */}
            <circle
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              fill="#475569"
            />
          </g>
        ))}

        {/* Floating background molecules */}
        {floatingParticles.map((p, i) => (
          <motion.circle
            key={`particle-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill="#3b82f6"
            className="opacity-[0.25]"
            animate={{
              y: ["0%", "4%", "-4%", "0%"],
              x: ["0%", "1.5%", "-1.5%", "0%"],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>

      {/* Thin, clean blueprint DNA design (Clearer with rotating rung animations) */}
      <div className="absolute right-[4%] top-0 bottom-0 w-[60px] opacity-[0.22] hidden lg:block">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 16 }).map((_, i) => {
            const y = 5 + i * 6; // percentage heights
            const offset = i % 2 === 0 ? 10 : -10;
            return (
              <g key={`blueprint-dna-${i}`}>
                {/* Horizontal rung */}
                <line
                  x1={`${30 - offset}%`}
                  y1={`${y}%`}
                  x2={`${70 + offset}%`}
                  y2={`${y}%`}
                  stroke="#475569"
                  strokeWidth="1"
                />
                {/* Nodes with pulsing animations */}
                <motion.circle
                  cx={`${30 - offset}%`}
                  cy={`${y}%`}
                  r="2.5"
                  fill="#2563eb"
                  animate={{
                    scale: [0.8, 1.25, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.circle
                  cx={`${70 + offset}%`}
                  cy={`${y}%`}
                  r="2.5"
                  fill="#2563eb"
                  animate={{
                    scale: [0.8, 1.25, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.15 + 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Decorative top institutional borders */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-research-blue to-accent-blue opacity-95" />
    </div>
  );
}
