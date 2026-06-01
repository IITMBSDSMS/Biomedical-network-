"use client";

import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import { 
  ShieldCheck, 
  Network, 
  Milestone, 
  Dna, 
  Globe2, 
  Users, 
  FileText, 
  GraduationCap, 
  Zap,
  Sparkles,
  ArrowRight,
  BookOpen,
  Briefcase,
  Calendar,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Building,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import PageWrapper, { FadeIn, StaggerParent, StaggerChild, SlideIn } from "@/components/ui/PageTransitions";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// The 8 structural pillars mapping to active platform URLs
const pillars = [
  {
    icon: <BookOpen className="w-5 h-5 text-blue-400" />,
    title: "Research Academy",
    desc: "Paid & free curriculum (Research Methodology, Bioinformatics, Python for Biology, Medical AI) teaching how to do research from scratch.",
    link: "/training",
    linkText: "Launch Academy"
  },
  {
    icon: <Zap className="w-5 h-5 text-indigo-400" />,
    title: "Research Accelerator",
    desc: "8-week YC-style cohorts providing dedicated PhD mentors, collaborative teams, and weekly sprints to produce publication-ready drafts.",
    link: "/fellowships",
    linkText: "Join Cohort"
  },
  {
    icon: <Building className="w-5 h-5 text-amber-400" />,
    title: "Research Club Chapters",
    desc: "Campus Chapters (IIT Delhi, AIIMS, DU, VIT) run by Student Ambassadors. Organizing workshops, journal clubs, and hackathons.",
    link: "/opportunities",
    linkText: "Apply Ambassador"
  },
  {
    icon: <Users className="w-5 h-5 text-emerald-400" />,
    title: "Mentor Network",
    desc: "Direct Advisory support and 1-on-1 counseling from verified researchers at AIIMS Delhi, IIT Bombay, IIT Madras, and IISc.",
    link: "/researchers",
    linkText: "Meet Mentors"
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
    title: "Research Fellowship",
    desc: "Structured 2, 3, or 6-month elite research roles working on cutting-edge problems. Selected fellows earn verified digital credentials.",
    link: "/fellowships",
    linkText: "Apply Fellowship"
  },
  {
    icon: <Briefcase className="w-5 h-5 text-purple-400" />,
    title: "Projects Marketplace",
    desc: "An Upwork/Internshala style match portal connecting professors posting biological workflows with qualified student scholars.",
    link: "/opportunities",
    linkText: "Explore Projects"
  },
  {
    icon: <FileText className="w-5 h-5 text-rose-400" />,
    title: "Publication Support",
    desc: "Guidance on citation bibliographies, manuscript formatting, abstract writing, journal indexing checks, and peer-review audits.",
    link: "/publications",
    linkText: "Read Papers"
  },
  {
    icon: <Calendar className="w-5 h-5 text-pink-400" />,
    title: "Events & Masterclasses",
    desc: "Monthly guest seminars and masterclasses (How to publish in Scopus, getting PhD admits, SOP reviews) hosted by IIT/AIIMS faculty.",
    link: "/gallery",
    linkText: "Explore Events"
  }
];



const roadmapPhases = [
  {
    phase: "Phase 1: Foundation",
    goals: [
      "Launch BioLabs platform and index profiles",
      "Onboard initial board of 20+ verified PhD mentors",
      "Build core community and enroll first 100 students"
    ],
    status: "Active"
  },
  {
    phase: "Phase 2: Acceleration",
    goals: [
      "Launch 8-week YC-style Research Accelerator",
      "Kickstart specialized Fellowship program cycle",
      "Deploy Campus Ambassador chapters (IITs, AIIMS, VIT)"
    ],
    status: "Incoming"
  },
  {
    phase: "Phase 3: Marketplace Scale",
    goals: [
      "Reach 1,000+ active students and 100+ mentors",
      "Deploy Upwork-style matching Projects Marketplace",
      "Streamline automated publication check pipelines"
    ],
    status: "Incoming"
  },
  {
    phase: "Phase 4: National Network",
    goals: [
      "Integrate MedTech and Pharma project sponsorships",
      "Establish physical micro-innovation labs in college hubs",
      "Organize the annual national BioLabs Conference"
    ],
    status: "Incoming"
  }
];

export default function AboutClient({ currentUser }: { currentUser: any }) {
  return (
    <PageWrapper>
      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 py-12 space-y-28 relative z-10 text-slate-200">
        
        {/* ============================================================== */}
        {/* HERO VISION SECTION */}
        {/* ============================================================== */}
        <section className="text-center space-y-6 max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center space-x-2 bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest text-[#3B82F6] uppercase mb-4 select-none">
              <Target className="w-3.5 h-3.5" />
              <span>BioLabs Platform Ecosystem</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Helping students and early researchers learn, conduct,{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-heading">
                publish, and commercialize research.
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto mt-4">
              BioLabs bridges the gap between textbook theory and actual scientific breakthroughs. We provide the mentorship, community, tools, and project connections required to build a prestigious research career.
            </p>
          </FadeIn>
        </section>

        {/* ============================================================== */}
        {/* THE PROBLEM vs SOLUTION BOX */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <SlideIn direction="left" className="h-full">
            <div className="bg-[#0B0F19]/50 border border-red-500/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-red-400 uppercase tracking-widest bg-red-950/20 px-3 py-1 rounded-full border border-red-900/20">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>The Academic Hurdle</span>
                </div>
                <h3 className="text-xl font-heading font-extrabold text-white">Why Early Research Feels Out of Reach</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Most motivated students and early scholars want to conduct scientific research, but they run into massive entry barriers:
                </p>
                
                <ul className="space-y-3 pt-2">
                  {[
                    "Not knowing how to start or write academic papers",
                    "Difficulty finding credentialed PhD or clinical mentors",
                    "No access to active lab projects or bioinformatics tools",
                    "Confusion regarding citation indices, manuscript editing, and journals",
                    "Finding it hard to secure research internships or get admits to IITs, AIIMS, or IISc programs"
                  ].map((errText, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs text-slate-400">
                      <span className="text-red-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{errText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SlideIn>

          <SlideIn direction="right" className="h-full">
            <div className="bg-[#0B0F19]/50 border border-blue-500/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-950/20 px-3 py-1 rounded-full border border-blue-900/20">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span>The BioLabs Solution</span>
                </div>
                <h3 className="text-xl font-heading font-extrabold text-white">A Complete Ecosystem for Scholars</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  BioLabs replaces academic exclusion with an open, verified digital layer designed to support your development from day one:
                </p>
                
                <ul className="space-y-3 pt-2">
                  {[
                    "Learn fundamental research methodology & bioinformatics online",
                    "Connect directly with active mentors at IITs, AIIMS, and CSIR Labs",
                    "Contribute to real datasets via our matching Projects Marketplace",
                    "Get full peer-review simulations and publication layout support",
                    "Earn verifiable credentials proving your contributions to clinical research"
                  ].map((solText, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs text-slate-300">
                      <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{solText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SlideIn>
        </section>

        {/* ============================================================== */}
        {/* THE 8 PILLARS SHOWCASE */}
        {/* ============================================================== */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-[10px] uppercase tracking-widest font-extrabold text-[#3B82F6]">Ecosystem Architecture</h2>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">The Eight Pillars of BioLabs</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Every route on our website corresponds to an active structural module designed to accelerate your research cycle.
            </p>
          </div>

          <StaggerParent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.06}>
            {pillars.map((p, idx) => (
              <StaggerChild key={idx}>
                <div className="bg-[#0B0F19]/60 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-full hover:border-slate-700 transition-all hover:scale-[1.02] duration-300 relative overflow-hidden group">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
                      {p.icon}
                    </div>
                    <h4 className="text-sm font-bold font-heading text-white">{p.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-normal">{p.desc}</p>
                  </div>
                  
                  <Link
                    href={p.link}
                    className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-[#3B82F6] hover:text-white transition-colors mt-6 pt-4 border-t border-slate-900"
                  >
                    <span>{p.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </StaggerChild>
            ))}
          </StaggerParent>
        </section>



        {/* ============================================================== */}
        {/* FIRST YEAR ROADMAP TIMELINE */}
        {/* ============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-[10px] uppercase tracking-widest font-extrabold text-[#3B82F6]">Widescreen Strategy</h2>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight">First-Year Roadmap</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A phased execution timeline mapping platform features from foundational setups to corporate sponsor alignments.
            </p>
            <div className="pt-4 border-t border-slate-900 hidden lg:block">
              <span className="text-[10px] text-slate-600 font-mono">Platform v2.0 - 2026</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6 relative pl-6 lg:pl-10">
            {/* Timeline line */}
            <div className="absolute left-[7px] lg:left-[11px] top-4 bottom-4 w-[1px] bg-slate-800" />
            
            {roadmapPhases.map((phase, idx) => (
              <div key={idx} className="relative flex items-start space-x-6 pl-4 lg:pl-6 group">
                {/* Connector point */}
                <div className={`absolute left-[-22px] lg:left-[-27px] top-1.5 w-4 h-4 rounded-full flex items-center justify-center border ${
                  phase.status === "Active" 
                    ? "bg-blue-500/20 border-blue-500/50" 
                    : "bg-slate-900/60 border-slate-800"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    phase.status === "Active" ? "bg-blue-500" : "bg-slate-700"
                  }`} />
                </div>

                <div className="bg-[#0B0F19]/30 border border-slate-800/80 rounded-2xl p-5 flex-1 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-heading font-black text-white">{phase.phase}</h4>
                    <span className={`text-[8px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded ${
                      phase.status === "Active" 
                        ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" 
                        : "bg-slate-950/60 border border-slate-800 text-slate-500"
                    }`}>
                      {phase.status}
                    </span>
                  </div>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                    {phase.goals.map((g, gIdx) => (
                      <li key={gIdx} className="text-[10px] text-slate-400 flex items-center space-x-2 leading-relaxed">
                        <span className="text-[#3B82F6] font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* COLLABORATIVE SCIENTIFIC NETWORK */}
        {/* ============================================================== */}
        <section className="bg-gradient-to-r from-blue-950/20 via-[#0B0F19] to-purple-950/20 border border-slate-800 rounded-3xl p-8 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          
          <div className="max-w-2xl mx-auto space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest font-extrabold text-[#3B82F6] mb-2.5">Collaborative Scientific Network</h4>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white">Why Our Model Succeeds</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our strength lies in our collaborative ecosystem: connecting <strong>PhD Mentors, Academic Researchers, and Student Scholars</strong> to work on peer-to-peer projects and computational workflows.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              By establishing BioLabs as a premier online hub for student training and scientific collaboration, we build a global research community. We support researchers in securing academic grants, conducting joint literature reviews, sharing datasets, and preparing manuscripts for peer-reviewed journals.
            </p>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
