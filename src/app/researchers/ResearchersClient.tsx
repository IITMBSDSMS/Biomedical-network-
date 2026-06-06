"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, CheckCircle, GraduationCap, ArrowRight, Award, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper, { FadeIn } from "@/components/ui/PageTransitions";

interface ResearcherData {
  id: string;
  researchId: string;
  fullName: string;
  photoUrl: string | null;
  institutionLogo: string | null;
  bio: string | null;
  institutionName: string | null;
  researchInterests: string;
  skills: string;
  linkedIn: string | null;
  isVerified: boolean;
  researchScore: number;
  publicationCount: number;
  projectCount: number;
  slug: string;
}

interface ResearchersClientProps {
  researchers: ResearcherData[];
}

const safeJsonParseArray = (val: string | null | undefined): string[] => {
  if (!val) return [];
  try {
    const parsed = JSON.parse(val);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    if (typeof val === "string" && val.trim() !== "")
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    return [];
  }
};

/** Deterministic hue from researcher name for gradient fallback */
function nameToHue(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

export default function ResearchersClient({ researchers }: ResearchersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  const allInterests = useMemo(() => {
    const set = new Set<string>();
    researchers.forEach((r) => {
      safeJsonParseArray(r.researchInterests).forEach((i) => set.add(i));
    });
    return Array.from(set).slice(0, 18);
  }, [researchers]);

  const filtered = useMemo(() => {
    return researchers.filter((r) => {
      const interests = safeJsonParseArray(r.researchInterests);
      const skills    = safeJsonParseArray(r.skills);
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        (r.bio?.toLowerCase().includes(q)) ||
        (r.institutionName?.toLowerCase().includes(q)) ||
        interests.some((t) => t.toLowerCase().includes(q)) ||
        skills.some((t) => t.toLowerCase().includes(q));
      const matchInterest = !selectedInterest || interests.includes(selectedInterest);
      return matchSearch && matchInterest;
    });
  }, [researchers, searchQuery, selectedInterest]);

  return (
    <PageWrapper>
      <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <FadeIn className="text-center max-w-4xl mx-auto mb-12">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-accent-blue bg-blue-950/30 border border-blue-900/40 px-3 py-1 rounded-full mb-4">
            Healix BioLabs Network
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-research-blue tracking-tight">
            Researcher Directory
          </h1>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-2xl mx-auto">
            Discover verified scientists, network leads, and research collaborators across India's premier institutions.
          </p>

          <div className="relative mt-8 max-w-xl mx-auto">
            <Search className="absolute inset-y-0 left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, expertise, institution…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-3.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors shadow-sm"
            />
          </div>
        </FadeIn>

        {/* ── Interest Filters ── */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedInterest(null)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              !selectedInterest
                ? "bg-accent-blue text-white border-accent-blue shadow-sm"
                : "bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-100 hover:border-slate-700"
            }`}
          >
            All Fields
          </button>
          {allInterests.map((interest) => (
            <button
              key={interest}
              onClick={() => setSelectedInterest(interest)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                selectedInterest === interest
                  ? "bg-accent-blue text-white border-accent-blue shadow-sm"
                  : "bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-100 hover:border-slate-700"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>

        {/* ── Count Badge ── */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Showing {filtered.length} of {researchers.length} researchers
          </span>
          <span className="flex-1 h-px bg-slate-800/60" />
        </div>

        {/* ── Card Grid ── */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((res) => {
              const interests = safeJsonParseArray(res.researchInterests);
              const hue = nameToHue(res.fullName);

              return (
                <motion.div
                  layout
                  key={res.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.3 }}
                  className="group relative bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 hover:border-slate-700/80 rounded-3xl overflow-hidden flex flex-col shadow-lg hover:shadow-2xl hover:shadow-slate-900/50 transition-all duration-300"
                >
                  {/* ── Card Main Section (Split Left/Right) ── */}
                  <div className="grid grid-cols-12 items-stretch min-h-[210px] flex-1">
                    
                    {/* Left Column: Portrait Large Photo */}
                    <div className="col-span-5 relative overflow-hidden border-r border-slate-800/80 bg-slate-950">
                      <img
                        src={res.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(res.fullName)}`}
                        alt={res.fullName}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Online status indicator */}
                      <span className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0B0F19] shadow-sm shadow-emerald-500/50" />

                      {/* Verified Badge */}
                      {res.isVerified && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-blue-950/85 border border-blue-800/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                          <CheckCircle className="w-2.5 h-2.5 text-accent-blue" />
                          <span className="text-[7.5px] font-bold text-accent-blue uppercase tracking-wider">Verified</span>
                        </div>
                      )}

                      {/* Research Score Ribbon */}
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-amber-950/80 border border-amber-905/50 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
                        <Award className="w-2.5 h-2.5 text-primary-yellow" />
                        <span className="text-[8.5px] font-black text-primary-yellow">{res.researchScore.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Right Column: College Logo, Name, ID, College Name, Papers/Projects */}
                    <div className="col-span-7 p-4 flex flex-col justify-between space-y-3">
                      
                      {/* Top Row: Big College Logo */}
                      <div className="flex justify-between items-start">
                        {res.institutionLogo ? (
                          <div className="w-14 h-14 rounded-xl border border-slate-800 bg-white shadow-sm overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                            <img
                              src={res.institutionLogo}
                              alt={res.institutionName || "Institution"}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm flex items-center justify-center shrink-0">
                            <Building2 className="w-6 h-6 text-slate-500" />
                          </div>
                        )}
                      </div>

                      {/* Middle: Name, ID, CollegeName */}
                      <div className="space-y-1 text-left">
                        <h3 className="text-xs font-bold font-heading text-white leading-snug line-clamp-2 group-hover:text-accent-blue transition-colors">
                          {res.fullName}
                        </h3>
                        <p className="text-[9px] text-slate-400 font-mono tracking-wider">{res.researchId}</p>
                        
                        {res.institutionName && (
                          <div className="flex items-center gap-1 mt-1 text-slate-300">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="text-[10px] font-bold truncate max-w-[125px]" title={res.institutionName}>
                              {res.institutionName}
                            </span>
                          </div>
                        )}

                        {/* Interests tags as small pills */}
                        {interests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {interests.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 text-[8px] font-semibold rounded bg-slate-900/80 border border-slate-800 text-slate-400 truncate max-w-[80px]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Section: Papers and Projects */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-left">
                        <div className="flex-1">
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Papers</p>
                          <p className="text-xs font-black text-white mt-0.5">{res.publicationCount || 0}</p>
                        </div>
                        <div className="w-px h-5 bg-slate-800 mx-2" />
                        <div className="flex-1">
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Projects</p>
                          <p className="text-xs font-black text-white mt-0.5">{res.projectCount || 0}</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ── View Profile CTA spanning full width at bottom ── */}
                  <div className="border-t border-slate-800/80">
                    <Link
                      href={`/researcher/${res.slug}`}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-3 bg-[#0B0F19]/40 hover:bg-accent-blue text-slate-300 hover:text-white transition-all duration-200 group/btn cursor-pointer"
                    >
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-slate-500 text-sm">No researchers matched your search or filters.</p>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
