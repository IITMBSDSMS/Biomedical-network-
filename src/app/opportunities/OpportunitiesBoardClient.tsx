"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  Search,
  Filter,
  Beaker,
  BookOpen,
  FlaskConical,
  Brain,
  Dna,
  Heart,
  X,
  Check,
  Plus,
  Upload
} from "lucide-react";
import type { HealixUser } from "@/lib/auth";

interface Opportunity {
  id: string;
  title: string;
  institution: string;
  location: string;
  type: "fellowship" | "collaboration" | "internship" | "phd" | "postdoc";
  field: string;
  deadline: string;
  duration: string;
  stipend?: string;
  tags: string[];
  description: string;
  isNew: boolean;
  isFeatured: boolean;
}

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "CRISPR Therapeutics Research Fellowship",
    institution: "IISc Bangalore",
    location: "Bangalore, Karnataka",
    type: "fellowship",
    field: "Genomics & Gene Editing",
    deadline: "July 15, 2026",
    duration: "12 months",
    stipend: "₹45,000/month",
    tags: ["CRISPR", "Gene Editing", "Lipid Nanoparticles", "In Vivo"],
    description: "Join our cutting-edge CRISPR therapeutics lab investigating PCSK9 knockdown using next-generation lipid nanoparticle delivery systems. Ideal for candidates with wet-lab experience.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "opp-2",
    title: "Neural Prosthetics PhD Position",
    institution: "IIT Delhi",
    location: "New Delhi, Delhi",
    type: "phd",
    field: "Neuroscience & Biomedical Engineering",
    deadline: "August 1, 2026",
    duration: "4 years",
    stipend: "₹35,000/month",
    tags: ["EEG", "EMG", "BCI", "Robotics", "Signal Processing"],
    description: "We are seeking a PhD candidate to work on non-invasive brain-computer interfaces for upper-limb prosthetics. Strong background in signal processing and machine learning required.",
    isNew: true,
    isFeatured: true,
  },
  {
    id: "opp-3",
    title: "Bioinformatics Collaboration — Multi-Omics",
    institution: "IIT Madras",
    location: "Chennai, Tamil Nadu",
    type: "collaboration",
    field: "Bioinformatics & Computational Biology",
    deadline: "Open",
    duration: "Flexible",
    stipend: "Project-based",
    tags: ["Multi-Omics", "Proteomics", "Transcriptomics", "Python", "R"],
    description: "Seeking computational biologists and bioinformaticians to collaborate on an integrated multi-omics pipeline for early cancer biomarker discovery. Remote-friendly collaboration welcome.",
    isNew: false,
    isFeatured: false,
  },
  {
    id: "opp-4",
    title: "Cardiology Research Internship",
    institution: "AIIMS Delhi",
    location: "New Delhi, Delhi",
    type: "internship",
    field: "Cardiac Medicine & Clinical Research",
    deadline: "June 30, 2026",
    duration: "6 months",
    stipend: "₹25,000/month",
    tags: ["Cardiology", "Clinical Trials", "ECG Analysis", "Patient Data"],
    description: "Hands-on clinical research internship focused on arrhythmia classification using deep learning on ECG signals. MBBS/BME final-year students preferred.",
    isNew: false,
    isFeatured: false,
  },
  {
    id: "opp-5",
    title: "Postdoctoral Position — Synthetic Biology",
    institution: "IIT Bombay",
    location: "Mumbai, Maharashtra",
    type: "postdoc",
    field: "Synthetic Biology",
    deadline: "September 30, 2026",
    duration: "2 years",
    stipend: "₹60,000/month",
    tags: ["Synthetic Biology", "Metabolic Engineering", "DBTL cycles", "Yeast"],
    description: "Postdoctoral position in our Synthetic Biology Lab focusing on metabolic engineering of yeast strains for biosynthesis of high-value pharmaceutical compounds.",
    isNew: false,
    isFeatured: false,
  },
  {
    id: "opp-6",
    title: "Literature Review Fellowship — Precision Medicine",
    institution: "IIT Hyderabad",
    location: "Hyderabad, Telangana",
    type: "fellowship",
    field: "Precision Medicine & Pharmacogenomics",
    deadline: "July 31, 2026",
    duration: "6 months",
    stipend: "₹30,000/month",
    tags: ["Pharmacogenomics", "Biomarkers", "Clinical Literature", "Meta-analysis"],
    description: "Research fellowship for systematic literature review and meta-analysis of pharmacogenomic markers in targeted oncology drug response across Indian patient populations.",
    isNew: true,
    isFeatured: false,
  },
  {
    id: "opp-7",
    title: "Open Collaboration — AI Drug Discovery",
    institution: "Healix BioLabs Network",
    location: "Remote / Pan-India",
    type: "collaboration",
    field: "AI & Machine Learning in Drug Discovery",
    deadline: "Rolling",
    duration: "12+ months",
    stipend: "Grant-funded",
    tags: ["Drug Discovery", "Deep Learning", "Molecular Docking", "Python", "AI"],
    description: "Cross-institutional collaboration seeking AI/ML researchers and pharmacologists to build a large-scale deep learning pipeline for virtual drug screening and molecular property prediction.",
    isNew: true,
    isFeatured: true,
  },
];

const TYPE_CONFIG = {
  fellowship: { label: "Fellowship", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  collaboration: { label: "Collaboration", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  internship: { label: "Internship", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  phd: { label: "PhD Position", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  postdoc: { label: "Postdoc", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

const ALL_TYPES = ["All", "fellowship", "collaboration", "internship", "phd", "postdoc"];

const getIcon = (type: string) => {
  switch (type) {
    case "fellowship": return <Dna className="w-5 h-5" />;
    case "phd": return <Brain className="w-5 h-5" />;
    case "internship": return <Heart className="w-5 h-5" />;
    case "postdoc": return <Beaker className="w-5 h-5" />;
    default: return <Users className="w-5 h-5" />;
  }
};

interface OpportunitiesBoardClientProps {
  currentUser: HealixUser | null;
}

export default function OpportunitiesBoardClient({ currentUser }: OpportunitiesBoardClientProps) {
  const [listings, setListings] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Modal states
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isPostOpen, setIsPostOpen] = useState(false);

  // Form states
  const [applyForm, setApplyForm] = useState({ name: "", email: "", sop: "", resumeName: "" });
  const [applySuccess, setApplySuccess] = useState(false);

  const [postForm, setPostForm] = useState({
    title: "",
    institution: "",
    location: "",
    type: "fellowship" as Opportunity["type"],
    field: "",
    deadline: "",
    duration: "",
    stipend: "",
    tags: "",
    description: "",
    contactEmail: ""
  });
  const [postSuccess, setPostSuccess] = useState(false);

  const filtered = listings.filter((opp) => {
    const matchesType = activeFilter === "All" || opp.type === activeFilter;
    const matchesSearch =
      !search ||
      opp.title.toLowerCase().includes(search.toLowerCase()) ||
      opp.institution.toLowerCase().includes(search.toLowerCase()) ||
      opp.field.toLowerCase().includes(search.toLowerCase()) ||
      opp.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const featured = filtered.filter((o) => o.isFeatured);
  const regular = filtered.filter((o) => !o.isFeatured);

  const handleApplyClick = (opp: Opportunity) => {
    setSelectedOpp(opp);
    setApplyForm({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      sop: "",
      resumeName: ""
    });
    setApplySuccess(false);
    setIsApplyOpen(true);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.name || !applyForm.email || !applyForm.sop) {
      alert("Please fill out all required fields.");
      return;
    }
    // Simulate successful submission
    setApplySuccess(true);
    setTimeout(() => {
      setIsApplyOpen(false);
      setApplySuccess(false);
    }, 2200);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { title, institution, location, type, field, deadline, duration, description, tags } = postForm;
    if (!title || !institution || !location || !field || !deadline || !duration || !description) {
      alert("Please fill out all required fields.");
      return;
    }

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title,
      institution,
      location,
      type,
      field,
      deadline,
      duration,
      stipend: postForm.stipend || undefined,
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : ["Research"],
      description,
      isNew: true,
      isFeatured: false
    };

    setListings(prev => [newOpp, ...prev]);
    setPostSuccess(true);
    setTimeout(() => {
      setIsPostOpen(false);
      setPostSuccess(false);
      setPostForm({
        title: "",
        institution: "",
        location: "",
        type: "fellowship",
        field: "",
        deadline: "",
        duration: "",
        stipend: "",
        tags: "",
        description: "",
        contactEmail: ""
      });
    }, 2000);
  };

  return (
    <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-[10px] font-bold text-[#3B82F6] uppercase tracking-widest mb-4">
            <Briefcase className="w-3 h-3" />
            <span>Research Opportunity Board</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white leading-tight">
            Open Positions &{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Collaborations
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-3 max-w-2xl leading-relaxed">
            Discover fellowships, internships, PhD positions, and open collaborations from India's premier research institutions. Updated daily by the Healix BioLabs network.
          </p>
        </div>
        <button
          onClick={() => {
            setPostSuccess(false);
            setIsPostOpen(true);
          }}
          className="inline-flex items-center space-x-2 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post Opportunity</span>
        </button>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, institution, field, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] transition-all"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                activeFilter === type
                  ? "bg-[#3B82F6] text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
              }`}
            >
              {type === "All" ? "All Types" : TYPE_CONFIG[type as keyof typeof TYPE_CONFIG].label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      {featured.length > 0 && (
        <div className="mb-10">
          <h2 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center space-x-1.5">
            <span className="w-4 h-[1px] bg-amber-400 inline-block" />
            <span>Featured Opportunities</span>
            <span className="w-4 h-[1px] bg-amber-400 inline-block" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {featured.map((opp, i) => (
              <OpportunityCard
                key={opp.id}
                opp={opp}
                index={i}
                expanded={expandedId === opp.id}
                onToggle={() => setExpandedId(expandedId === opp.id ? null : opp.id)}
                onApply={() => handleApplyClick(opp)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Listings */}
      {regular.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
            {featured.length > 0 ? "More Opportunities" : "All Opportunities"} ({regular.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {regular.map((opp, i) => (
              <OpportunityCard
                key={opp.id}
                opp={opp}
                index={i}
                expanded={expandedId === opp.id}
                onToggle={() => setExpandedId(expandedId === opp.id ? null : opp.id)}
                onApply={() => handleApplyClick(opp)}
              />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🔬</div>
          <p className="text-slate-400 font-medium">No opportunities match your search.</p>
          <p className="text-xs text-slate-600 mt-1">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* Submit Your Own CTA */}
      <div className="mt-16 bg-gradient-to-r from-slate-900 via-[#0B0F19] to-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
        <GraduationCap className="w-10 h-10 text-[#3B82F6] mx-auto mb-4" />
        <h3 className="text-xl font-heading font-extrabold text-white mb-2">
          Post a Research Opportunity
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mb-6">
          Are you a PI, lab director, or research group looking to recruit? Post your open positions directly through the Healix BioLabs platform.
        </p>
        <button
          onClick={() => {
            setPostSuccess(false);
            setIsPostOpen(true);
          }}
          className="inline-flex items-center space-x-2 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-all shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <span>Post an Opportunity</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ============================================================== */}
      {/* MODALS */}
      {/* ============================================================== */}
      <AnimatePresence>
        {/* APPLY MODAL */}
        {isApplyOpen && selectedOpp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-[#070B13] border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden z-10 text-slate-200"
            >
              {/* Cyan Accent Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-heading font-extrabold text-white">Apply for Position</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{selectedOpp.title} at {selectedOpp.institution}</p>
                </div>
                <button
                  onClick={() => setIsApplyOpen(false)}
                  className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {applySuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-8 text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Application Sent Successfully!</h4>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
                      Your research profile, statement of purpose, and credentials have been forwarded to the PI at {selectedOpp.institution}.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={applyForm.name}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Dr. Priya Sharma"
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="priya.sharma@institution.edu"
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Statement of Purpose (SOP) <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={applyForm.sop}
                      onChange={(e) => setApplyForm(prev => ({ ...prev, sop: e.target.value }))}
                      placeholder="Briefly describe your research background, experience with the listed technologies, and your interest in this project..."
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Academic CV / Resume <span className="text-slate-500">(Optional)</span>
                    </label>
                    <div className="relative border border-dashed border-slate-800 hover:border-slate-700 bg-[#0B0F19]/40 rounded-xl p-4 transition-all">
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setApplyForm(prev => ({ ...prev, resumeName: file.name }));
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1.5 text-center">
                        <Upload className="w-5 h-5 text-slate-500" />
                        <span className="text-[10px] font-bold text-slate-400">
                          {applyForm.resumeName || "Upload PDF CV / Academic Profile"}
                        </span>
                        <span className="text-[9px] text-slate-650">Max size 5MB (PDF format preferred)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-900 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsApplyOpen(false)}
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

        {/* POST OPPORTUNITY MODAL */}
        {isPostOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPostOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-xl bg-[#070B13] border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh] z-10 text-slate-200 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-800"
            >
              {/* Violet Accent Glow */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-6">
                <div>
                  <h3 className="text-lg font-heading font-extrabold text-white">Post Research Opportunity</h3>
                  <p className="text-xs text-slate-500 mt-1">Add your lab workflow, vacancy, or project to the public matching dashboard.</p>
                </div>
                <button
                  onClick={() => setIsPostOpen(false)}
                  className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {postSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">Opportunity Published!</h4>
                    <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
                      Your posting has been instantly updated. Interested student scholars and researchers can now apply directly.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Project / Position Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={postForm.title}
                        onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Molecular Docking Pipeline"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Institution / Lab <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={postForm.institution}
                        onChange={(e) => setPostForm(prev => ({ ...prev, institution: e.target.value }))}
                        placeholder="e.g. IIT Bombay, School of Bioscience"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Location <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={postForm.location}
                        onChange={(e) => setPostForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Mumbai or Remote"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Opportunity Type <span className="text-red-400">*</span>
                      </label>
                      <select
                        value={postForm.type}
                        onChange={(e) => setPostForm(prev => ({ ...prev, type: e.target.value as Opportunity["type"] }))}
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      >
                        <option value="fellowship">Fellowship</option>
                        <option value="collaboration">Collaboration</option>
                        <option value="internship">Internship</option>
                        <option value="phd">PhD Position</option>
                        <option value="postdoc">Postdoc</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Scientific Field <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={postForm.field}
                        onChange={(e) => setPostForm(prev => ({ ...prev, field: e.target.value }))}
                        placeholder="e.g. Structural Biology"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Deadline <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={postForm.deadline}
                        onChange={(e) => setPostForm(prev => ({ ...prev, deadline: e.target.value }))}
                        placeholder="e.g. August 15, 2026"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Duration <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={postForm.duration}
                        onChange={(e) => setPostForm(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="e.g. 6 months or 2 years"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                        Stipend / Grant <span className="text-slate-500">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={postForm.stipend}
                        onChange={(e) => setPostForm(prev => ({ ...prev, stipend: e.target.value }))}
                        placeholder="e.g. ₹35,000/month"
                        className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Search Tags <span className="text-slate-500">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={postForm.tags}
                      onChange={(e) => setPostForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="e.g. Python, Molecular Dynamics, Machine Learning"
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      Detailed Project Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={postForm.description}
                      onChange={(e) => setPostForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Outline the scientific goals, expectations, equipment access, and prerequisites of the opportunity..."
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                      PI Contact Email <span className="text-slate-500">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      value={postForm.contactEmail}
                      onChange={(e) => setPostForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="pi.name@lab.org"
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#3B82F6] transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-900 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsPostOpen(false)}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 cursor-pointer"
                    >
                      Publish Posting
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

function OpportunityCard({
  opp,
  index,
  expanded,
  onToggle,
  onApply,
}: {
  opp: Opportunity;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onApply: () => void;
}) {
  const typeConfig = TYPE_CONFIG[opp.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-[#0B0F19]/60 backdrop-blur-sm border rounded-2xl transition-all duration-350 flex flex-col justify-between overflow-hidden group ${
        opp.isFeatured
          ? "border-amber-500/30 shadow-lg shadow-amber-500/5 hover:border-amber-500/50"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >
      {/* Card Header & Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${typeConfig.color}`}>
                {getIcon(opp.type)}
              </div>
              <div>
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                  {opp.isNew && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
            {opp.isFeatured && (
              <div className="text-[9px] text-amber-400 font-bold uppercase tracking-wider border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded shrink-0">
                Featured
              </div>
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-100 leading-snug mb-2 group-hover:text-white transition-colors">
            {opp.title}
          </h3>
          
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
              <Beaker className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="font-semibold">{opp.institution}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{opp.location}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Deadline: <span className="text-slate-400 font-semibold">{opp.deadline}</span></span>
            </div>
          </div>

          {/* Field tag */}
          <div className="text-[9px] font-bold text-[#3B82F6] uppercase tracking-wider border border-[#3B82F6]/20 bg-[#3B82F6]/5 px-2 py-1 rounded-md inline-block mb-3.5 select-none">
            {opp.field}
          </div>

          {/* Description preview */}
          <p className={`text-[11px] text-slate-400 leading-relaxed ${expanded ? "" : "line-clamp-2"}`}>
            {opp.description}
          </p>
        </div>

        {/* Expanded: tags + stipend */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {opp.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold">Duration</p>
                    <p className="text-[11px] text-slate-300 font-semibold mt-0.5">{opp.duration}</p>
                  </div>
                  {opp.stipend && (
                    <div>
                      <p className="text-[9px] text-slate-600 uppercase tracking-wider font-bold">Stipend</p>
                      <p className="text-[11px] text-emerald-400 font-bold mt-0.5">{opp.stipend}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3 border-t border-slate-800/60 pt-4 bg-slate-950/20">
        <button
          onClick={onToggle}
          className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          {expanded ? "Show less" : "View details"}
        </button>
        <button
          onClick={onApply}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#3B82F6] hover:bg-[#3B82F6]/90 px-4 py-2.5 rounded-lg transition-all shadow-sm shadow-blue-500/10 cursor-pointer"
        >
          <span>Apply Now</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
