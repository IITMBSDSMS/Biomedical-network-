"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  Users,
  MapPin,
  Calendar,
  Plus,
  X,
  Check,
  Award,
  Activity,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Link as LinkIcon
} from "lucide-react";
import type { HealixUser } from "@/lib/auth";

interface Chapter {
  id: string;
  name: string;
  department: string;
  location: string;
  membersCount: number;
  established: string;
  leadAmbassador: string;
  activeProjects: number;
  status: "Active" | "Launching";
  image: string;
  description: string;
  achievements: string[];
}

const INITIAL_CHAPTERS: Chapter[] = [
  {
    id: "chap-1",
    name: "AIIMS Delhi BioLabs Club",
    department: "Department of Biophysics & Clinical Research",
    location: "New Delhi, Delhi",
    membersCount: 48,
    established: "September 2025",
    leadAmbassador: "Rohan Malhotra",
    activeProjects: 5,
    status: "Active",
    image: "/aiims_delhi_campus.png",
    description: "Focusing on computational neuroscience workflows, EEG signal decoding models, and joint literature reviews on cardiac deep learning datasets.",
    achievements: [
      "Completed 3 clinical validation audits in cardiac research",
      "Drafted joint paper for Scopus-indexed Cardiology journal",
      "Onboarded 12 junior medical residents into bioinformatics tools"
    ]
  },
  {
    id: "chap-2",
    name: "IIT Delhi GenTech Chapter",
    department: "School of Biological Sciences",
    location: "New Delhi, Delhi",
    membersCount: 72,
    established: "October 2025",
    leadAmbassador: "Sneha Mukhopadhyay",
    activeProjects: 8,
    status: "Active",
    image: "/iit_delhi_campus.png",
    description: "Centering on CRISPR engineering pipelines, lipid nanoparticle delivery simulations, and custom Python scripts for high-dimensional genomic datasets.",
    achievements: [
      "Simulated PCSK9 gene knockdown vector with 94% target accuracy",
      "Hosted regional GenTech hackathon with 120+ participants",
      "Shared 4 computational pipelines on the Projects Marketplace"
    ]
  },
  {
    id: "chap-3",
    name: "Vellore Institute of Technology Bio-Hub",
    department: "School of Bio Sciences & Technology",
    location: "Vellore, Tamil Nadu",
    membersCount: 110,
    established: "January 2026",
    leadAmbassador: "Amit Ramachandran",
    activeProjects: 4,
    status: "Active",
    image: "/vit_vellore_campus.png",
    description: "Pioneering student-led structural biochemistry research, yeast metabolic simulation runs, and molecular docking algorithms for virtual screening.",
    achievements: [
      "Discovered 2 high-value targets for biosynthetic compounds",
      "Built custom yeast strain pathway mapping tools in R",
      "Organized biweekly journal reviews covering synthetic biology"
    ]
  },
  {
    id: "chap-4",
    name: "BITS Pilani Bio-Intelligence Chapter",
    department: "Department of Biological Sciences",
    location: "Pilani, Rajasthan",
    membersCount: 65,
    established: "February 2026",
    leadAmbassador: "Vikram Sengupta",
    activeProjects: 6,
    status: "Active",
    image: "/bits_pilani_campus.png",
    description: "Developing machine learning algorithms for medical imaging datasets, protein secondary structure prediction, and genomic sequence indexing.",
    achievements: [
      "Trained custom CNN classification model for tumor detection",
      "Developed web database mapping genomic sequence indexes",
      "Onboarded 3 senior PhD mentors from IISc Bangalore"
    ]
  },
  {
    id: "chap-5",
    name: "Delhi University Botany & Bio-Computing",
    department: "Department of Botany & Computer Science",
    location: "Delhi, India",
    membersCount: 35,
    established: "March 2026",
    leadAmbassador: "Priyanka Roy",
    activeProjects: 2,
    status: "Launching",
    image: "/lab_workbench.png",
    description: "Linking traditional plant molecular biology with high-throughput bioinformatics, mapping agricultural stress transcriptomes.",
    achievements: [
      "Structured reference library for regional stress genotypes",
      "Coordinated intro bioinformatics workshops for 50+ botanists",
      "Established faculty coordination board for research validation"
    ]
  }
];

interface ChaptersClientProps {
  currentUser: HealixUser | null;
}

export default function ChaptersClient({ currentUser }: ChaptersClientProps) {
  const [chapters, setChapters] = useState<Chapter[]>(INITIAL_CHAPTERS);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  // Load CMS chapter photo overrides
  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(data => {
        if (data?.chapters) {
          setChapters(prev =>
            prev.map(ch => {
              const override = data.chapters[ch.id];
              if (override?.image) {
                return { ...ch, image: override.image };
              }
              return ch;
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAmbassadorOpen, setIsAmbassadorOpen] = useState(false);

  // Form states
  const [registerForm, setRegisterForm] = useState({
    collegeName: "",
    department: "",
    location: "",
    proposerName: "",
    proposerEmail: "",
    plannedActivities: "",
    proposedMentor: ""
  });
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const [ambassadorForm, setAmbassadorForm] = useState({
    fullName: "",
    collegeName: "",
    degreeProgram: "",
    yearOfStudy: "3rd Year",
    email: "",
    sop: "",
    linkedin: ""
  });
  const [ambassadorSuccess, setAmbassadorSuccess] = useState(false);

  // Reset/Start autoplay
  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % chapters.length);
    }, 5500);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [chapters.length]);

  const handlePrev = () => {
    stopAutoplay();
    setActiveIndex(prev => (prev - 1 + chapters.length) % chapters.length);
    startAutoplay();
  };

  const handleNext = () => {
    stopAutoplay();
    setActiveIndex(prev => (prev + 1) % chapters.length);
    startAutoplay();
  };

  const selectSlide = (idx: number) => {
    stopAutoplay();
    setActiveIndex(idx);
    startAutoplay();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { collegeName, department, location, proposerName, proposerEmail } = registerForm;
    if (!collegeName || !department || !location || !proposerName || !proposerEmail) {
      alert("Please fill in all required fields.");
      return;
    }

    const newChapter: Chapter = {
      id: `chap-${Date.now()}`,
      name: collegeName,
      department: department,
      location: location,
      membersCount: 1,
      established: "June 2026",
      leadAmbassador: proposerName,
      activeProjects: 0,
      status: "Launching",
      image: "/lab_workbench.png", // fallback placeholder image
      description: registerForm.plannedActivities || "Proposing an official BioLabs academic division to run bioinformatics workflows and student research cohorts.",
      achievements: [
        `Initiated Setup proposal by ${proposerName}`,
        "Pending official BioLabs academic board activation",
        "Awaiting coordinator screening review"
      ]
    };

    setChapters(prev => [...prev, newChapter]);
    setRegisterSuccess(true);
    
    // Jump to the newly added chapter slide once modal is closed
    setTimeout(() => {
      setIsRegisterOpen(false);
      setRegisterSuccess(false);
      setRegisterForm({
        collegeName: "",
        department: "",
        location: "",
        proposerName: "",
        proposerEmail: "",
        plannedActivities: "",
        proposedMentor: ""
      });
      setActiveIndex(chapters.length); // Jump to new slide
    }, 2200);
  };

  const handleAmbassadorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, collegeName, email, sop } = ambassadorForm;
    if (!fullName || !collegeName || !email || !sop) {
      alert("Please fill in all required fields.");
      return;
    }

    setAmbassadorSuccess(true);
    setTimeout(() => {
      setIsAmbassadorOpen(false);
      setAmbassadorSuccess(false);
      setAmbassadorForm({
        fullName: "",
        collegeName: "",
        degreeProgram: "",
        yearOfStudy: "3rd Year",
        email: "",
        sop: "",
        linkedin: ""
      });
    }, 2200);
  };

  const activeSlide = chapters[activeIndex];

  return (
    <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-4 min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] flex flex-col relative overflow-y-auto lg:overflow-hidden">
      
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.35, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Direct Image with radial vignetting mask */}
            <img
              src={activeSlide.image}
              alt={activeSlide.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070B13] via-[#070B13]/70 to-[#070B13]/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070B13] via-transparent to-transparent hidden lg:block" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Cyan/Indigo Accent Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute -bottom-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header Overlay */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-slate-950/60 backdrop-blur-md border border-slate-900 px-3.5 py-1.5 rounded-full">
          <Building className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">
            BioLabs Chapter Network
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setRegisterSuccess(false);
              setIsRegisterOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-[10px] font-extrabold uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Register Chapter
          </button>
          <button
            onClick={() => {
              setAmbassadorSuccess(false);
              setIsAmbassadorOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-slate-750 text-slate-300 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer"
          >
            Apply Ambassador
          </button>
        </div>
      </div>

      {/* Interactive Main Overlay Body */}
      <div className="relative z-10 flex-1 grid grid-cols-1 gap-8 items-center py-8">
        {/* Left Side: Floating Glassmorphism Data Overlay */}
        <div className="max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slate-950/85 backdrop-blur-xl border border-slate-800/70 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative"
            >
              {/* Gold status bar decoration */}
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent" />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-1 rounded-md border border-[#3B82F6]/15">
                    {activeSlide.status}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Est. {activeSlide.established}</span>
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white leading-snug">
                  {activeSlide.name}
                </h2>
                <p className="text-[10px] font-bold text-slate-400">{activeSlide.department}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {activeSlide.description}
              </p>

              {/* Grid Statistics */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-5">
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Lead Ambassador</span>
                  <span className="text-xs font-bold text-white mt-1 block">{activeSlide.leadAmbassador}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Active Workflows</span>
                  <span className="text-xs font-bold text-white mt-1 block">{activeSlide.activeProjects} Research Projects</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Location Hub</span>
                  <span className="text-xs font-medium text-slate-300 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{activeSlide.location}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Core Scholars</span>
                  <span className="text-xs font-medium text-slate-300 mt-1 flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{activeSlide.membersCount} Members</span>
                  </span>
                </div>
              </div>

              {/* Achievements Highlight */}
              <div className="border-t border-slate-900 pt-5 space-y-3">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Recent Accomplishments</span>
                <ul className="space-y-2">
                  {activeSlide.achievements.map((ach, aIdx) => (
                    <li key={aIdx} className="flex items-start space-x-2 text-[10px] text-slate-400">
                      <Sparkles className="w-3 h-3 text-[#3B82F6] shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ===== NAVIGATION CONTROLS - Absolutely positioned bottom-right ===== */}
      <div className="absolute bottom-16 right-4 sm:right-8 z-20 flex items-center space-x-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl shadow-2xl">
        <button
          onClick={handlePrev}
          className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Previous chapter"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-1.5 px-1">
          {chapters.map((_, idx) => (
            <button
              key={idx}
              onClick={() => selectSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx ? "w-6 bg-[#3B82F6]" : "w-1.5 bg-slate-700 hover:bg-slate-600"
              }`}
              aria-label={`Go to chapter ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Next chapter"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators Navigation (Bottom Bar) */}
      <div className="relative z-10 flex items-center justify-between border-t border-slate-900/60 pt-4 bg-slate-950/20 px-4 rounded-xl">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          Slide {activeIndex + 1} of {chapters.length}
        </span>
        <span className="text-[9px] text-[#3B82F6] font-bold uppercase tracking-widest animate-pulse">
          Live slideshow active
        </span>
      </div>

      {/* ============================================================== */}
      {/* MODALS */}
      {/* ============================================================== */}
      <AnimatePresence>
        
        {/* REGISTER CHAPTER MODAL */}
        {isRegisterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRegisterOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-[#070B13] border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] z-10 text-slate-200"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-heading font-extrabold text-white">Register College Chapter</h3>
                  <p className="text-xs text-slate-500 mt-1">Propose a verified BioLabs student branch at your academic institution.</p>
                </div>
                <button
                  onClick={() => setIsRegisterOpen(false)}
                  className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {registerSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Chapter Registration Submitted!</h4>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
                      Your university chapter details have been appended to the active carousel slides list immediately.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      College / University Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={registerForm.collegeName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, collegeName: e.target.value }))}
                      placeholder="e.g. Indian Institute of Technology Roorkee"
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Department Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={registerForm.department}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="e.g. Biotechnology Dept"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Location / City <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={registerForm.location}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Roorkee, Uttarakhand"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Chapter Proposer Lead <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={registerForm.proposerName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, proposerName: e.target.value }))}
                        placeholder="e.g. Prof. Anand Mishra"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Contact Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={registerForm.proposerEmail}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, proposerEmail: e.target.value }))}
                        placeholder="anand.mishra@iitr.ac.in"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Proposed Academic Mentor
                    </label>
                    <input
                      type="text"
                      value={registerForm.proposedMentor}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, proposedMentor: e.target.value }))}
                      placeholder="e.g. Dr. Rajesh Verma (optional)"
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Planned Activities Description
                    </label>
                    <textarea
                      rows={3}
                      value={registerForm.plannedActivities}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, plannedActivities: e.target.value }))}
                      placeholder="e.g. Python for biology seminars, genomic dataset reviews, etc."
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-900 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsRegisterOpen(false)}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      Propose Chapter
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}

        {/* APPLY AMBASSADOR MODAL */}
        {isAmbassadorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAmbassadorOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-[#070B13] border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] z-10 text-slate-200"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-heading font-extrabold text-white">Apply as Ambassador</h3>
                  <p className="text-xs text-slate-500 mt-1">Lead the BioLabs community, hackathons, and research clubs on your campus.</p>
                </div>
                <button
                  onClick={() => setIsAmbassadorOpen(false)}
                  className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {ambassadorSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-violet-500/10 border border-violet-500/30 rounded-full flex items-center justify-center text-violet-400">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Ambassador Profile Submitted!</h4>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
                      Thank you for applying. Our scientific community coordinators will reach out via email to schedule your screening interview.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleAmbassadorSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ambassadorForm.fullName}
                        onChange={(e) => setAmbassadorForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="e.g. Sneha Roy"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        College / University Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ambassadorForm.collegeName}
                        onChange={(e) => setAmbassadorForm(prev => ({ ...prev, collegeName: e.target.value }))}
                        placeholder="e.g. VIT Vellore"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Degree Program
                      </label>
                      <input
                        type="text"
                        value={ambassadorForm.degreeProgram}
                        onChange={(e) => setAmbassadorForm(prev => ({ ...prev, degreeProgram: e.target.value }))}
                        placeholder="e.g. B.Tech Biotechnology"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Year of Study
                      </label>
                      <select
                        value={ambassadorForm.yearOfStudy}
                        onChange={(e) => setAmbassadorForm(prev => ({ ...prev, yearOfStudy: e.target.value }))}
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={ambassadorForm.email}
                      onChange={(e) => setAmbassadorForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="sneha.roy@student.edu"
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      LinkedIn / Resume Link
                    </label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="url"
                        value={ambassadorForm.linkedin}
                        onChange={(e) => setAmbassadorForm(prev => ({ ...prev, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Why do you want to lead a Chapter? <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={ambassadorForm.sop}
                      onChange={(e) => setAmbassadorForm(prev => ({ ...prev, sop: e.target.value }))}
                      placeholder="Detail your leadership history, interest in biological sciences, and plans to host events..."
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-900 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsAmbassadorOpen(false)}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
