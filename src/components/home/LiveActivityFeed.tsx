"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Activity,
  FileText,
  FolderGit2,
  GraduationCap,
  UserCheck,
  CheckCircle,
  Zap,
  TrendingUp,
} from "lucide-react";

interface ActivityItem {
  id: string;
  type: "publication" | "project" | "fellowship" | "researcher" | "milestone";
  message: string;
  detail: string;
  time: string;
  href: string;
  color: string;
  icon: React.ReactNode;
}

const ACTIVITY_DATA: ActivityItem[] = [
  {
    id: "a1",
    type: "publication",
    message: "New publication indexed",
    detail: "CRISPR-Cas9 Off-Target Assessment in Hepatocyte Models — Dr. Priya Sharma",
    time: "2 min ago",
    href: "/publications",
    color: "from-blue-500 to-cyan-400",
    icon: <FileText className="w-3.5 h-3.5" />,
  },
  {
    id: "a2",
    type: "researcher",
    message: "Researcher verified",
    detail: "Dr. Avnish Verma (IIT Delhi) joined the Healix BioLabs network",
    time: "8 min ago",
    href: "/researchers",
    color: "from-emerald-500 to-teal-400",
    icon: <UserCheck className="w-3.5 h-3.5" />,
  },
  {
    id: "a3",
    type: "project",
    message: "Project milestone reached",
    detail: "Neural Prosthetics Lab: Phase 2 Signal Calibration completed",
    time: "15 min ago",
    href: "/projects",
    color: "from-violet-500 to-indigo-400",
    icon: <FolderGit2 className="w-3.5 h-3.5" />,
  },
  {
    id: "a4",
    type: "fellowship",
    message: "Fellowship application approved",
    detail: "Genomics Internship 2026 — 3 new positions filled",
    time: "32 min ago",
    href: "/fellowships",
    color: "from-amber-500 to-yellow-400",
    icon: <GraduationCap className="w-3.5 h-3.5" />,
  },
  {
    id: "a5",
    type: "milestone",
    message: "Network milestone",
    detail: "Healix BioLabs crosses 1,250 verified researchers",
    time: "1 hr ago",
    href: "/researchers",
    color: "from-rose-500 to-pink-400",
    icon: <TrendingUp className="w-3.5 h-3.5" />,
  },
  {
    id: "a6",
    type: "publication",
    message: "White paper approved",
    detail: "Lipid Nanoparticle Delivery Vectors for mRNA Therapeutics — IISc Bangalore",
    time: "2 hr ago",
    href: "/publications",
    color: "from-blue-500 to-cyan-400",
    icon: <FileText className="w-3.5 h-3.5" />,
  },
  {
    id: "a7",
    type: "researcher",
    message: "Profile boosted",
    detail: "Dr. Ranjit Kumar (AIIMS Delhi) achieved Research Score 9.4",
    time: "3 hr ago",
    href: "/researchers",
    color: "from-emerald-500 to-teal-400",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
  },
  {
    id: "a8",
    type: "project",
    message: "New collaboration formed",
    detail: "CRISPR Biomarker Lab + IIT Madras Bioinformatics Group",
    time: "5 hr ago",
    href: "/projects",
    color: "from-violet-500 to-indigo-400",
    icon: <Zap className="w-3.5 h-3.5" />,
  },
];

const TypeColors: Record<string, string> = {
  publication: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  researcher: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  project: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  fellowship: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  milestone: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export default function LiveActivityFeed() {
  const [visibleItems, setVisibleItems] = useState<ActivityItem[]>(
    ACTIVITY_DATA.slice(0, 5)
  );
  const [currentTop, setCurrentTop] = useState<ActivityItem | null>(null);
  const queueRef = useRef(3); // index pointer into a rotating cycle
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const nextIndex = queueRef.current % ACTIVITY_DATA.length;
      const next = ACTIVITY_DATA[nextIndex];
      queueRef.current += 1;

      setCurrentTop(next);
      setTimeout(() => {
        setCurrentTop(null);
        setVisibleItems((prev) => {
          const newList = [next, ...prev.slice(0, 4)];
          return newList;
        });
      }, 600);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section className="py-20 bg-[#070B13] border-b border-slate-900 relative z-10">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-violet-600/5 blur-3xl -translate-y-1/2" />
      </div>

      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Header + Live Stats */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Live Network Feed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight">
                Research Happening{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Right Now
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed max-w-sm">
                A live window into the Healix network — publications indexed, researchers verified, fellowships awarded, and milestones reached.
              </p>
            </div>

            {/* Pulse Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Publications Today", value: "12", trend: "+3", color: "text-blue-400" },
                { label: "Active Projects", value: "48", trend: "Live", color: "text-violet-400" },
                { label: "New Researchers", value: "7", trend: "Today", color: "text-emerald-400" },
                { label: "Fellowships Open", value: "23", trend: "Apply", color: "text-amber-400" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all"
                >
                  <div className={`text-2xl font-extrabold font-heading ${stat.color}`}>
                    {stat.value}
                    <span className="text-xs font-bold text-slate-500 ml-1.5">{stat.trend}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/researchers"
              className="inline-flex items-center space-x-2 text-xs font-bold text-accent-blue hover:text-white transition-colors border border-accent-blue/30 hover:border-accent-blue px-4 py-2.5 rounded-lg"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Browse Network</span>
            </Link>
          </div>

          {/* Right: Live Feed List */}
          <div className="lg:col-span-7 space-y-3 relative">
            {/* Live incoming item (animating in from top) */}
            <AnimatePresence>
              {currentTop && (
                <motion.div
                  key={`incoming-${currentTop.id}`}
                  initial={{ opacity: 0, y: -20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-slate-900 border border-accent-blue/40 rounded-xl p-4 flex items-center space-x-4 shadow-lg shadow-blue-500/5 ring-1 ring-accent-blue/10"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentTop.color} bg-opacity-10 flex items-center justify-center text-white shrink-0`}>
                    {currentTop.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{currentTop.message}</p>
                    <p className="text-xs text-slate-200 font-medium leading-snug truncate mt-0.5">{currentTop.detail}</p>
                  </div>
                  <span className="text-[9px] text-accent-blue font-bold shrink-0 bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20">
                    NEW
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Feed items */}
            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {visibleItems.map((item, index) => (
                  <motion.div
                    key={item.id + "-" + index}
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1 - index * 0.08, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    layout
                  >
                    <Link
                      href={item.href}
                      className="group bg-[#0B0F19] hover:bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex items-center space-x-4 transition-all duration-200 w-full block"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 ${TypeColors[item.type]} border`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.message}</p>
                          <span className="text-[9px] text-slate-600 font-mono shrink-0">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-snug truncate mt-0.5 group-hover:text-white transition-colors">
                          {item.detail}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Bottom fade-out gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#070B13] to-transparent pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
