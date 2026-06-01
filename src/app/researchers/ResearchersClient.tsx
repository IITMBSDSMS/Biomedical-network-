"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, CheckCircle, GraduationCap, ArrowRight, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper, { FadeIn, StaggerParent, StaggerChild } from "@/components/ui/PageTransitions";

interface ResearcherData {
  id: string;
  researchId: string;
  fullName: string;
  photoUrl: string | null;
  bio: string | null;
  institutionName: string | null;
  researchInterests: string; // JSON string array
  skills: string; // JSON string array
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
  } catch (e) {
    if (typeof val === "string" && val.trim() !== "") {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }
};

export default function ResearchersClient({ researchers }: ResearchersClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);

  // Extract all unique interests from seeded database rows to build quick-filters
  const allInterests = useMemo(() => {
    const set = new Set<string>();
    researchers.forEach((r) => {
      const interests = safeJsonParseArray(r.researchInterests);
      interests.forEach((item) => set.add(item));
    });
    return Array.from(set);
  }, [researchers]);

  // Filter researchers based on search input and selected tags
  const filteredResearchers = useMemo(() => {
    return researchers.filter((r) => {
      const interestsArray = safeJsonParseArray(r.researchInterests);
      const skillsArray = safeJsonParseArray(r.skills);
      
      const matchesSearch =
        r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.bio && r.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.institutionName && r.institutionName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        interestsArray.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        skillsArray.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesInterest = !selectedInterest || interestsArray.includes(selectedInterest);

      return matchesSearch && matchesInterest;
    });
  }, [researchers, searchQuery, selectedInterest]);

  return (
    <PageWrapper>
    <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
      

      {/* Page Title & Search Bar */}
      <FadeIn className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-research-blue tracking-tight">
          Biomedical Researcher Directory
        </h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed max-w-2xl mx-auto">
          Discover verified scientists, network specialists, and students collaborating across Indian medical schools and engineering labs.
        </p>

        {/* Search Input */}
        <div className="relative mt-8 max-w-xl mx-auto">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, expertise, interest, or institution..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-3.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-colors shadow-sm"
          />
        </div>
      </FadeIn>

      {/* Category Filter Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
        <button
          onClick={() => setSelectedInterest(null)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            !selectedInterest
              ? "bg-accent-blue text-white border-accent-blue font-bold shadow-sm"
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
                ? "bg-accent-blue text-white border-accent-blue font-bold shadow-sm"
                : "bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-100 hover:border-slate-700"
            }`}
          >
            {interest}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredResearchers.map((res) => {
            const interests = safeJsonParseArray(res.researchInterests);
            const skills = safeJsonParseArray(res.skills);

            return (
              <motion.div
                layout
                key={res.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={`relative bg-[#0B0F19]/65 backdrop-blur-md border ${
                  res.isVerified ? "border-l-4 border-l-accent-blue border-y-slate-800 border-r-slate-800" : "border-slate-800"
                } rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-700 group`}
              >
                <div>
                  
                  {/* Top Card Section: Avatar, Verification, Score */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={res.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${res.fullName}`}
                        alt={res.fullName}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-800 shadow-inner"
                      />
                      <div>
                        <h3 className="text-base font-bold font-heading text-slate-100 flex items-center space-x-1.5">
                          <span>{res.fullName}</span>
                          {res.isVerified && (
                            <CheckCircle className="w-3.5 h-3.5 text-accent-blue fill-blue-950/20" />
                          )}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono tracking-wider font-bold">
                          {res.researchId}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-yellow bg-amber-950/20 border border-amber-900/40 px-2.5 py-0.5 rounded flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5 text-primary-yellow" />
                      <span>{res.researchScore.toFixed(1)}</span>
                    </span>
                  </div>

                  {/* Institution details */}
                  <div className="flex items-center space-x-1.5 text-slate-400 mt-4">
                    <GraduationCap className="w-4 h-4 shrink-0 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-300 truncate">{res.institutionName || "Independent Scholar"}</span>
                  </div>

                  {/* Bio Description */}
                  <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {res.bio || "No biography provided yet."}
                  </p>

                  {/* Research Stats Summary Bar */}
                  <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-slate-800/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0" />
                      <span>{res.publicationCount || 0} Publications</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-yellow shrink-0" />
                      <span>{res.projectCount || 0} Workspaces</span>
                    </div>
                  </div>

                  {/* Research Interests Tags */}
                  <div className="mt-4 pt-3 border-t border-slate-800">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1.5">
                      {interests.slice(0, 3).map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-0.5 rounded bg-slate-900/60 text-[10px] text-slate-300 border border-slate-800 font-semibold"
                        >
                          {interest}
                        </span>
                      ))}
                      {interests.length > 3 && (
                        <span className="px-2 py-0.5 rounded bg-slate-900/60 text-[10px] text-slate-400 border border-slate-800 font-bold">
                          +{interests.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Bottom CTA View Profile */}
                <div className="pt-5 mt-5 border-t border-slate-800">
                  <Link
                    href={`/researcher/${res.slug}`}
                    className="w-full bg-slate-900/60 hover:bg-accent-blue hover:text-white border border-slate-800 hover:border-accent-blue text-xs font-bold text-slate-300 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <span>View Full Profile</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredResearchers.length === 0 && (
          <div className="col-span-full py-16 text-center">
            <p className="text-slate-500 text-sm">No researchers matched your search query or filters.</p>
          </div>
        )}
      </motion.div>

    </div>
    </PageWrapper>
  );
}
