"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, 
  Search, 
  Check, 
  Activity, 
  User, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  Award,
  Users
} from "lucide-react";
import type { HealixUser } from "@/lib/auth";

interface ResearchGateClientProps {
  currentUser: HealixUser | null;
}

export default function ResearchGateClient({ currentUser }: ResearchGateClientProps) {
  const [profileUrl, setProfileUrl] = useState("");
  const [step, setStep] = useState<"input" | "searching" | "found" | "syncing" | "complete">("input");
  
  // Mock found RG author data
  const [authorData, setAuthorData] = useState({
    name: "Dr. Avnish Verma",
    affiliation: "Director of Research, Healix BioLabs / IIT Delhi",
    rgScore: 42.8,
    coAuthors: 14,
    projectsCount: 6,
    researchItems: 12
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl) return;

    setStep("searching");
    
    // Auto-prefill mock author name if user has a name in session
    if (currentUser?.name) {
      setAuthorData(prev => ({
        ...prev,
        name: currentUser.name || "Dr. Avnish Verma",
        affiliation: "Research Scholar, Healix BioLabs"
      }));
    }

    setTimeout(() => {
      setStep("found");
    }, 2000);
  };

  const handleSync = () => {
    setStep("syncing");
    setTimeout(() => {
      setStep("complete");
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative z-10 text-slate-200">
      
      {/* Headings */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center space-x-2 bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest text-[#3B82F6] uppercase mb-2 select-none">
          <Network className="w-3.5 h-3.5" />
          <span>Academic Indexing Integration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white leading-tight">
          ResearchGate Profile Sync
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Connect your ResearchGate profile link to pull your active research interest score, co-authors list, and active project timelines directly into your verified BioLabs profile card.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {/* STEP 1: INPUT FORM */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                    Enter ResearchGate Profile URL
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      required
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      placeholder="e.g. https://www.researchgate.net/profile/Avnish-Verma"
                      className="w-full bg-[#070B13] border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  <span>Search & Fetch ResearchGate Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="border-t border-slate-900 pt-5 space-y-3">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Important Information</span>
                <p className="text-[10px] text-slate-400 leading-relaxed font-normal">
                  Make sure your ResearchGate profile visibility is set to public so that our automated sync crawler can retrieve your profile interest score and metadata. Your co-author connections will also be imported to map potential BioLabs project matches.
                </p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: SEARCHING LOADER */}
          {step === "searching" && (
            <motion.div
              key="searching"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 text-center space-y-4"
            >
              <RefreshCw className="w-10 h-10 text-[#3B82F6] animate-spin" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Crawling ResearchGate Public Profile</h4>
                <p className="text-[10px] text-slate-500">Resolving author name, RG Score index, and active project timelines...</p>
              </div>
            </motion.div>
          )}

          {/* STEP 3: AUTHOR FOUND */}
          {step === "found" && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="bg-[#070B13]/70 border border-slate-800 p-5 rounded-2xl space-y-4 relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-[#3B82F6]">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{authorData.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{authorData.affiliation}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-extrabold tracking-widest bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md uppercase">
                    Profile Located
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-slate-900 pt-4 text-center">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">RG Score</span>
                    <span className="text-base font-extrabold text-white mt-1 block">{authorData.rgScore}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Co-Authors</span>
                    <span className="text-base font-extrabold text-white mt-1 block">{authorData.coAuthors}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Research Items</span>
                    <span className="text-base font-extrabold text-white mt-1 block">{authorData.researchItems}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-900 pt-5 mt-6">
                <button
                  onClick={() => setStep("input")}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  Change Profile
                </button>
                <button
                  onClick={handleSync}
                  className="px-6 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Synchronize Profile ({authorData.researchItems} items)
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SYNCING LOADER */}
          {step === "syncing" && (
            <motion.div
              key="syncing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-12 text-center space-y-4"
            >
              <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
              <div className="space-y-1.5 w-full max-w-xs">
                <h4 className="text-sm font-bold text-white">Importing Research items & Score</h4>
                <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mt-2 border border-slate-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                    className="h-full bg-emerald-500"
                  />
                </div>
                <p className="text-[8px] text-slate-500 pt-1 font-mono uppercase tracking-widest">Saving records to PostgreSQL database</p>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SYNC COMPLETED */}
          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-8 text-center space-y-5"
            >
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
                <Check className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white">ResearchGate Profile Synced!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Your research score and co-author index connections have been linked to your BioLabs profile.
                </p>
              </div>
              
              <div className="bg-[#070B13]/40 border border-slate-900/60 p-4 rounded-xl text-left w-full space-y-2.5">
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#3B82F6] flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>RG Synced Metrics Summary</span>
                </span>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Research Interest Score:</span>
                  <span className="font-semibold text-white">{authorData.rgScore}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Imported Research Items:</span>
                  <span className="font-semibold text-emerald-400">{authorData.researchItems} items</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Co-Author Connections:</span>
                  <span className="font-semibold text-white">{authorData.coAuthors} researchers</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-slate-900 w-full justify-center">
                <button
                  onClick={() => setStep("input")}
                  className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Configure Sync Again
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
