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
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
                  className="group relative bg-[#0B0F19]/80 backdrop-blur-md border border-slate-800 hover:border-slate-700 rounded-3xl overflow-hidden flex flex-col shadow-md hover:shadow-xl hover:shadow-slate-900/50 transition-all duration-300"
                >
                  {/* ── Card Header Banner with gradient + institution logo ── */}
                  <div
                    className="relative h-24 shrink-0 overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, hsl(${hue},55%,12%) 0%, hsl(${(hue+40)%360},45%,8%) 100%)`,
                    }}
                  >
                    {/* Subtle grid texture */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `radial-gradient(circle, hsl(${hue},60%,60%) 1px, transparent 1px)`,
                        backgroundSize: "18px 18px",
                      }}
                    />

                    {/* Verified ribbon */}
                    {res.isVerified && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-blue-950/70 border border-blue-800/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3 text-accent-blue" />
                        <span className="text-[9px] font-bold text-accent-blue uppercase tracking-wider">Verified</span>
                      </div>
                    )}

                    {/* Research Score chip */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-950/70 border border-amber-800/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      <Award className="w-3 h-3 text-primary-yellow" />
                      <span className="text-[10px] font-extrabold text-primary-yellow">{res.researchScore.toFixed(1)}</span>
                    </div>

                    {/* Institution logo — top-right corner of banner */}
                    {res.institutionLogo ? (
                      <div className="absolute bottom-[-20px] right-4 w-12 h-12 rounded-xl border-2 border-slate-800 bg-slate-950 shadow-lg overflow-hidden shrink-0">
                        <img
                          src={res.institutionLogo}
                          alt={res.institutionName || "Institution"}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                    ) : res.institutionName ? (
                      <div className="absolute bottom-[-20px] right-4 w-12 h-12 rounded-xl border-2 border-slate-800 bg-slate-900 shadow-lg flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-slate-500" />
                      </div>
                    ) : null}
                  </div>

                  {/* ── Card Body ── */}
                  <div className="flex flex-col flex-1 p-5 pt-4">

                    {/* Researcher avatar + name */}
                    <div className="flex items-start gap-3 mb-3" style={{ marginTop: res.institutionLogo || res.institutionName ? "4px" : "0" }}>
                      <div className="relative shrink-0">
                        <img
                          src={res.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(res.fullName)}`}
                          alt={res.fullName}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-800 bg-slate-950 shadow-md group-hover:border-slate-700 transition-colors"
                        />
                        {/* Online indicator dot */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0B0F19]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold font-heading text-slate-100 leading-tight line-clamp-1">
                          {res.fullName}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono tracking-wider mt-0.5">{res.researchId}</p>
                        {res.institutionName && (
                          <div className="flex items-center gap-1 mt-1">
                            <GraduationCap className="w-3 h-3 text-slate-600 shrink-0" />
                            <span className="text-[10px] font-semibold text-slate-400 truncate">{res.institutionName}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3 flex-shrink-0">
                      {res.bio || "Biomedical researcher on the Healix BioLabs network."}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-800/70">
                      <div className="text-center flex-1">
                        <p className="text-sm font-extrabold font-heading text-research-blue">{res.publicationCount || 0}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Papers</p>
                      </div>
                      <div className="w-px h-8 bg-slate-800" />
                      <div className="text-center flex-1">
                        <p className="text-sm font-extrabold font-heading text-primary-yellow">{res.projectCount || 0}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Projects</p>
                      </div>
                      <div className="w-px h-8 bg-slate-800" />
                      <div className="text-center flex-1">
                        <p className="text-sm font-extrabold font-heading" style={{ color: `hsl(${hue},70%,65%)` }}>
                          {res.researchScore.toFixed(0)}
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600">Score</p>
                      </div>
                    </div>

                    {/* Interest tags */}
                    {interests.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {interests.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[9px] font-bold rounded-md border border-slate-800 bg-slate-900/60 text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {interests.length > 3 && (
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded-md border border-slate-800 bg-slate-900/60 text-slate-500">
                            +{interests.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="mt-auto">
                      <Link
                        href={`/researcher/${res.slug}`}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-accent-blue hover:border-accent-blue hover:text-white transition-all duration-200 group/btn shadow-sm"
                      >
                        View Profile
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
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
