"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  AlertCircle,
  Sparkles,
  FileText,
  Send,
  ChevronRight,
  ChevronDown,
  X,
  Dna,
  Atom,
  Brain,
  Cpu,
  Briefcase,
  Download,
  Award,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle2,
  Star,
  Activity,
  UserCheck,
  HelpCircle,
  Clock,
  ArrowUpRight,
  Stethoscope,
  ShieldAlert,
  Search
} from "lucide-react";
import Image from "next/image";
import { HealixUser } from "@/lib/auth";
import { LinkedinIcon } from "@/components/ui/BrandIcons";
import PageWrapper from "@/components/ui/PageTransitions";
import DnaHelix3d from "@/components/canvas/DnaHelix3d";

interface FellowshipsClientProps {
  currentUser: HealixUser | null;
}

export default function FellowshipsClient({ currentUser }: FellowshipsClientProps) {
  // Modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);

  // FAQ Accordion states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Success Stories Carousel state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Form states
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [institutionName, setInstitutionName] = useState("");
  const [course, setCourse] = useState("");
  const [interests, setInterests] = useState("");
  const [sop, setSop] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUrl, setCvUrl] = useState("");

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8500);
    return () => clearInterval(timer);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleNextStep = () => {
    setError("");
    if (step === 1) {
      if (!fullName.trim() || !email.trim() || !institutionName.trim() || !course.trim()) {
        setError("All academic and contact fields are required.");
        return;
      }
    } else if (step === 2) {
      if (!interests.trim() || !sop.trim()) {
        setError("Interests and Statement of Purpose are required.");
        return;
      }
      if (sop.length < 50) {
        setError("Your Statement of Purpose should be at least 50 characters long.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile && !cvUrl) {
      setError("Please select a PDF CV to upload.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      let finalCvUrl = cvUrl;

      // 1. Upload CV file if present
      if (cvFile) {
        const uploadData = new FormData();
        uploadData.append("file", cvFile);
        uploadData.append("folder", "mock-cvs");

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || "Failed to upload CV file");
        }

        const { url } = await uploadRes.json();
        finalCvUrl = url;
        setCvUrl(url);
      }

      // 2. Submit fellowship application details
      const appRes = await fetch("/api/fellowships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          institutionName,
          course,
          researchInterests: interests.split(",").map((i) => i.trim()).filter((i) => i !== ""),
          statementOfPurpose: sop,
          cvUrl: finalCvUrl,
        }),
      });

      if (!appRes.ok) {
        const err = await appRes.json();
        throw new Error(err.error || "Failed to submit application");
      }

      setCompleted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadBrochure = () => {
    const link = document.createElement("a");
    link.href = "/BioLabs_Research_Fellowship_Brochure.pdf";
    link.download = "BioLabs_Research_Fellowship_Brochure.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const scrollToProgram = () => {
    const el = document.getElementById("why-we-exist");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Testimonials Static Data
  const testimonials = [
    {
      name: "Sneha Iyer",
      college: "BITS Pilani",
      topic: "CRISPR-Cas9 Editing in Oncology",
      quote: "The Bio Labs Fellowship was career-defining. Under my IIT Delhi mentor, I co-authored a paper on breast cancer diagnostics that got published in Nature Scientific Reports!",
      avatar: "SI"
    },
    {
      name: "Rohan Das",
      college: "KMC Manipal",
      topic: "AI-based Retinopathy Detection",
      quote: "Having a dedicated PhD guide made all the difference. I went from having a basic AI prototype to writing a publication-grade manuscript and presenting it at a major IEEE conference.",
      avatar: "RD"
    },
    {
      name: "Dr. Anjali Rao",
      college: "AIIMS New Delhi",
      topic: "mRNA Delivery Systems",
      quote: "The infrastructure access and LORs I received directly led to my admission into a funded PhD program at Munich. Recommend this to any aspiring bio-innovator.",
      avatar: "AR"
    }
  ];

  // FAQ Static Data
  const faqs = [
    {
      question: "Is prior research experience required?",
      answer: "No, the program is designed to train you from the fundamentals up. We start with literature search, study designs, and work our way to implementation, experimentation, and paper writing."
    },
    {
      question: "Can I participate remotely or is it hybrid/on-site?",
      answer: "We offer flexible models. Computational tracks (like AI in Healthcare, Bioinformatics) can be completed 100% remotely. Wet-lab tracks require presence in selected lab nodes."
    },
    {
      question: "How does the publication process work?",
      answer: "You will work closely with your mentor to co-author a high-quality paper. We assist with manuscript drafting, figure generation, journal selection, and responding to peer reviewer comments."
    },
    {
      question: "What is the weekly time commitment?",
      answer: "We recommend dedicating 10–15 hours per week, which fits alongside university classes or a full-time job."
    },
    {
      question: "Is there a selection process?",
      answer: "Yes, applications are screened by the academic board based on your academic background, statement of purpose, and CV details. Only a selected number of fellows are admitted per track each quarter."
    }
  ];

  // Mentors Static Data
  const mentors = [
    {
      name: "Dr. Priya Sharma, PhD",
      institution: "AIIMS New Delhi",
      area: "mRNA Delivery Vectors",
      initials: "PS",
      color: "bg-slate-900/60 text-[#3B82F6]"
    },
    {
      name: "Dr. Avnish Verma, PhD",
      institution: "IIT Bombay",
      area: "Computational Genomics",
      initials: "AV",
      color: "bg-slate-900/60 text-[#3B82F6]"
    },
    {
      name: "Dr. Rajesh Mehta, PhD",
      institution: "IISc Bangalore",
      area: "Neural Interfaces",
      initials: "RM",
      color: "bg-slate-900/60 text-[#3B82F6]"
    },
    {
      name: "Dr. Sunita Rao, PhD",
      institution: "IIT Delhi",
      area: "AI-driven Drug Discovery",
      initials: "SR",
      color: "bg-slate-900/60 text-[#3B82F6]"
    }
  ];

  return (
    <PageWrapper>
      {/* Outer wrapper */}
      <div className="text-slate-100 w-full relative overflow-hidden">
        
        {/* Glowing high-tech accent background spots */}
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-[35%] right-10 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-10 w-[450px] h-[450px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Max width container for proper screen proportions */}
        <div className="max-w-[1360px] mx-auto px-6 sm:px-8 space-y-36 relative z-10">

          {/* ============================================================== */}
          {/* SECTION 1 — HERO */}
          {/* ============================================================== */}
          <section className="relative w-full min-h-[600px] grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 text-left space-y-8">
              <div className="inline-flex items-center space-x-2 bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#3B82F6] animate-pulse" />
                <span>Applications open for Cohort 2026</span>
              </div>

              <div className="space-y-4">
                <span className="text-[11px] font-extrabold text-[#3B82F6] tracking-widest uppercase block">
                  BIO LABS RESEARCH FELLOWSHIP 2026
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-extrabold leading-tight tracking-tight text-white">
                  Build Research <br />
                  <span className="bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
                    That Matters.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed font-normal">
                  Join a fellowship designed for ambitious students, researchers, and innovators working on impactful problems in biotechnology, medicine, healthcare, neuroscience, and artificial intelligence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-8 py-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-blue-500/10"
                >
                  <span>Apply for Fellowship</span>
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={scrollToProgram}
                  className="bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800 text-slate-300 font-bold px-8 py-4 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
                >
                  <span>View Program</span>
                </button>
              </div>
            </div>

            {/* Right illustration / floating cards */}
            <div className="lg:col-span-6 flex justify-center items-center relative min-h-[400px]">
              {/* Soft glowing background under the helix */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-purple-500/10 blur-[60px] pointer-events-none animate-pulse duration-3000" />
              
              {/* Dynamic bobbing floating container */}
              <motion.div
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 1.5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full aspect-square max-w-[600px] select-none"
              >
                <DnaHelix3d />
                
                {/* Embedded floating interactive stat card 1 */}
                <div className="absolute -bottom-2 -left-4 bg-slate-950/80 border border-slate-800/80 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 backdrop-blur-md hover:border-blue-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Dna className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Computational</div>
                    <div className="text-xs font-heading font-black text-white mt-1">Biotech Stream</div>
                  </div>
                </div>

                {/* Embedded floating interactive stat card 2 */}
                <div className="absolute -top-4 -right-4 bg-slate-950/80 border border-slate-800/80 px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 backdrop-blur-md hover:border-purple-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Brain className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">AI Diagnostics</div>
                    <div className="text-xs font-heading font-black text-white mt-1">Active Trials</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 2 — WHY WE EXIST */}
          {/* ============================================================== */}
          <section id="why-we-exist" className="max-w-3xl mx-auto space-y-8 text-center relative z-10">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
                Most students learn research. <br />
                <span className="bg-gradient-to-r from-slate-400 to-slate-600 bg-clip-text text-transparent">Few actually do it.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto font-normal">
                Bio Labs bridges the gap between academic learning and real-world scientific research through mentorship, projects, and publication support.
              </p>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 3 — WHAT YOU GET */}
          {/* ============================================================== */}
          <section className="space-y-12 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  t: "Research Mentorship",
                  d: "Work directly with experienced researchers and industry experts.",
                  icon: Users
                },
                {
                  t: "Research Projects",
                  d: "Contribute to meaningful scientific projects.",
                  icon: Cpu
                },
                {
                  t: "Publication Support",
                  d: "Receive guidance on writing and publishing research papers.",
                  icon: FileText
                },
                {
                  t: "Professional Network",
                  d: "Connect with mentors, researchers, and ambitious peers.",
                  icon: BookOpen
                }
              ].map((card, i) => (
                <div key={i} className="bg-slate-900/40 backdrop-blur-xs border border-slate-900 p-8 rounded-2xl shadow-md flex flex-col justify-between min-h-[200px] text-left hover:border-slate-800 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 text-[#3B82F6]">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white">{card.t}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{card.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 4 — FELLOWSHIP DOMAINS */}
          {/* ============================================================== */}
          <section className="space-y-12 relative z-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                Fellowship Domains
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { t: "Biotechnology", icon: Dna },
                { t: "Neuroscience", icon: Brain },
                { t: "AI in Healthcare", icon: Cpu },
                { t: "Clinical Research", icon: Activity },
                { t: "Public Health", icon: Users },
                { t: "Drug Discovery", icon: Stethoscope }
              ].map((domain, index) => (
                <div
                  key={index}
                  className="group bg-slate-900/40 border border-slate-900 hover:border-[#3B82F6]/30 rounded-xl p-6 transition-all flex items-center space-x-4 cursor-pointer hover:shadow-lg hover:shadow-blue-500/2"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-[#3B82F6] group-hover:scale-105 transition-transform">
                    <domain.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-slate-200">{domain.t}</h4>
                    <span className="text-[9px] text-[#3B82F6] font-bold uppercase tracking-wider">Research Stream</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 5 — HOW IT WORKS */}
          {/* ============================================================== */}
          <section className="space-y-12 relative z-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                How It Works
              </h2>
            </div>

            <div className="relative border-l-2 border-slate-800 md:border-l-0 md:border-t-2 md:grid md:grid-cols-5 md:gap-6 pt-4 md:pt-8 pl-6 md:pl-0 space-y-8 md:space-y-0 text-left">
              {[
                { step: "Step 01", t: "Apply Online", desc: "Submit application form and academic background." },
                { step: "Step 02", t: "Selection Process", desc: "Review of statements and academic credentials." },
                { step: "Step 03", t: "Mentor Matching", desc: "Pairing based on track and research goals." },
                { step: "Step 04", t: "Research Project", desc: "Contribute directly to active clinical workflows." },
                { step: "Step 05", t: "Publication & Certification", desc: "Graduation portfolio and journal submissions." }
              ].map((stepItem, i) => (
                <div key={i} className="relative group">
                  {/* Timeline node */}
                  <div className="absolute -left-[31px] md:left-0 md:-top-[41px] w-4 h-4 rounded-full bg-slate-950 border-2 border-[#3B82F6] flex items-center justify-center group-hover:scale-125 group-hover:bg-[#3B82F6] transition-all">
                    <div className="w-1 h-1 bg-[#3B82F6] rounded-full group-hover:bg-slate-950" />
                  </div>
                  
                  <span className="text-[10px] text-[#3B82F6] font-bold uppercase tracking-wider block mb-1">
                    {stepItem.step}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-200 mb-1">{stepItem.t}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-[170px]">
                    {stepItem.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 6 — MENTORS */}
          {/* ============================================================== */}
          <section className="space-y-12 relative z-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white tracking-tight">
                Learn from Researchers.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.map((mentor, index) => (
                <div key={index} className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between min-h-[220px] text-left hover:border-slate-800 hover:shadow-lg transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-11 h-11 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-extrabold shrink-0 text-[#3B82F6]`}>
                        {mentor.initials}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{mentor.name}</h4>
                        <span className="text-[10px] text-slate-400 font-bold">{mentor.institution}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 pt-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Research Area</span>
                      <p className="text-xs font-bold text-slate-300">{mentor.area}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-900 mt-4 flex items-center justify-between">
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1.5 text-[10px] font-bold text-[#3B82F6] hover:text-blue-400 transition-colors"
                    >
                      <LinkedinIcon className="w-3.5 h-3.5" />
                      <span>View LinkedIn</span>
                    </a>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 7 — OUTCOMES */}
          {/* ============================================================== */}
          <section className="bg-slate-900/20 border border-slate-900 rounded-2xl p-8 md:p-12 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <p className="text-3xl md:text-5xl font-heading font-extrabold text-[#3B82F6]">500+</p>
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Students</h4>
              </div>
              
              <div className="space-y-1 border-l border-slate-800">
                <p className="text-3xl md:text-5xl font-heading font-extrabold text-white">100+</p>
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Research Projects</h4>
              </div>

              <div className="space-y-1 border-l border-slate-800">
                <p className="text-3xl md:text-5xl font-heading font-extrabold text-white">50+</p>
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Mentors</h4>
              </div>

              <div className="space-y-1 border-l border-slate-800">
                <p className="text-3xl md:text-5xl font-heading font-extrabold text-[#3B82F6]">20+</p>
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Publications</h4>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 8 — TESTIMONIALS */}
          {/* ============================================================== */}
          <section className="space-y-12 relative z-10">
            <div className="max-w-2xl mx-auto bg-slate-900/40 border border-slate-900 p-8 rounded-2xl relative shadow-md text-left">
              <div className="absolute top-6 right-8 text-slate-800 text-6xl font-serif select-none pointer-events-none">
                “
              </div>

              <div className="min-h-[160px] flex flex-col justify-between space-y-6">
                {/* Star rating */}
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed font-medium">
                  {testimonials[activeTestimonial].quote}
                </p>
                
                <div className="flex items-center justify-between border-t border-slate-900 pt-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-bold shrink-0 text-white">
                      {testimonials[activeTestimonial].avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{testimonials[activeTestimonial].name}</h4>
                      <p className="text-[10px] text-slate-400">{testimonials[activeTestimonial].college}</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 px-3 py-1 rounded text-[9px] font-bold text-[#3B82F6] uppercase tracking-wider">
                    {testimonials[activeTestimonial].topic}
                  </div>
                </div>
              </div>

              {/* Carousel navigation dots */}
              <div className="flex justify-center space-x-1.5 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      activeTestimonial === index ? "bg-[#3B82F6] w-5" : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* SECTION 9 — APPLICATIONS */}
          {/* ============================================================== */}
          <section className="max-w-3xl mx-auto border border-slate-900 rounded-2xl p-8 sm:p-12 text-center bg-slate-900/40 shadow-xl space-y-6 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Applications are now open.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Join a community of future scientists, innovators, and researchers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold px-8 py-3.5 rounded-xl cursor-pointer transition-colors shadow-lg shadow-blue-500/10"
              >
                Apply Now
              </button>
              
              <button
                onClick={() => setIsBrochureModalOpen(true)}
                className="bg-slate-950/40 hover:bg-slate-950 border border-slate-800 text-slate-200 font-bold px-8 py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-500" />
                <span>Download Fellowship Brochure</span>
              </button>
            </div>

            <div className="pt-6 border-t border-slate-900 mt-6 text-[10px] text-slate-500 font-bold tracking-widest uppercase">
              For Students. By Researchers. For Scientific Impact.
            </div>
          </section>

          {/* ============================================================== */}
          {/* SYLLABUS / PRICING & FAQ COMPLEMENT */}
          {/* ============================================================== */}
          <section className="max-w-2xl mx-auto space-y-16 relative z-10">
            {/* FAQ Integration */}
            <div className="space-y-6">
              <h3 className="text-xl font-heading font-extrabold text-center text-white">
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="bg-slate-900/20 border border-slate-900 rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform duration-300 shrink-0 ml-4 ${
                            isOpen ? "rotate-180 text-[#3B82F6]" : ""
                          }`}
                        />
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-6 pb-5 pt-1 text-[11px] text-slate-400 leading-relaxed border-t border-slate-900/60">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* ============================================================== */}
      {/* APPLY MODAL OVERLAY */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplyModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0B0F19] border border-slate-800 rounded-3xl max-w-lg w-full p-6 md:p-8 relative space-y-6 shadow-2xl z-10 overflow-hidden text-slate-200"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1 bg-slate-950/60 border border-slate-800 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2 pb-2">
                <div className="w-10 h-10 bg-blue-950/40 border border-blue-900/50 text-[#3B82F6] rounded-xl flex items-center justify-center mx-auto">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-heading font-extrabold text-white">
                  Research Fellowship Application
                </h3>
                <p className="text-[10px] text-slate-400">
                  Complete the 3-step application wizard to register.
                </p>
              </div>

              {completed ? (
                <div className="text-center space-y-6 py-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center mx-auto text-emerald-400">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-base font-heading font-extrabold text-white">Application Submitted!</h2>
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                      Thank you, <span className="font-bold text-white">{fullName}</span>. Your fellowship credentials have been successfully logged.
                    </p>
                  </div>
                  
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-[10px] text-slate-400 text-left leading-relaxed space-y-2">
                    <p className="font-bold text-slate-200">What Happens Next?</p>
                    <ol className="list-decimal pl-4 space-y-1 text-slate-500 font-medium">
                      <li>A confirmation email has been dispatched to <code className="text-slate-300 bg-slate-900 px-1 rounded">{email}</code>.</li>
                      <li>Academic reviewers will verify your uploaded CV and Statement of Purpose.</li>
                      <li>Decisions are dispatched on a rolling basis (typically 14 business days).</li>
                    </ol>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setCompleted(false);
                        setStep(1);
                        setInstitutionName("");
                        setCourse("");
                        setInterests("");
                        setSop("");
                        setCvFile(null);
                        setCvUrl("");
                        setIsApplyModalOpen(false);
                      }}
                      className="bg-[#3B82F6] hover:bg-blue-600 px-6 py-2.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer border-none"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Progress Line */}
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-[#3B82F6] h-full transition-all duration-300"
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>

                  {error && (
                    <div className="text-[11px] text-rose-450 bg-rose-950/20 border border-rose-900/50 rounded-xl p-3 flex items-center space-x-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="text-xs space-y-4">
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="modal-step-1"
                          variants={{
                            initial: { opacity: 0, x: 10 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -10 }
                          }}
                          className="space-y-4"
                        >
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1: Contact & Course</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                            <div className="space-y-1.5">
                              <label className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Full Name</label>
                              <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Aarav Mehta"
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Email Address</label>
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="student@college.edu"
                                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30"
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Institution / University</label>
                            <input
                              type="text"
                              value={institutionName}
                              onChange={(e) => setInstitutionName(e.target.value)}
                              placeholder="Indian Institute of Technology, Delhi"
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30"
                            />
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Current Course & Major</label>
                            <input
                              type="text"
                              value={course}
                              onChange={(e) => setCourse(e.target.value)}
                              placeholder="e.g. M.Tech in Computational Biology"
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30"
                            />
                          </div>

                          <div className="flex justify-end pt-4 border-t border-slate-900 mt-4">
                            <button
                              type="button"
                              onClick={handleNextStep}
                              className="bg-[#3B82F6] hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-bold flex items-center space-x-1 cursor-pointer border-none"
                            >
                              <span>Continue</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="modal-step-2"
                          variants={{
                            initial: { opacity: 0, x: 10 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -10 }
                          }}
                          className="space-y-4"
                        >
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 2: Research Proposal</h4>

                          <div className="space-y-1.5 text-left">
                            <label className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                              Research Interests <span className="text-slate-500 font-normal">(Comma-separated)</span>
                            </label>
                            <input
                              type="text"
                              value={interests}
                              onChange={(e) => setInterests(e.target.value)}
                              placeholder="e.g. Computational Genomics, Neuroscience"
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30"
                            />
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                              Statement of Purpose <span className="text-slate-500 font-normal">(Explain your research targets)</span>
                            </label>
                            <textarea
                              rows={4}
                              value={sop}
                              onChange={(e) => setSop(e.target.value)}
                              placeholder="Describe your research goals and why you wish to align with Healix BioLabs..."
                              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]/30 resize-none"
                            />
                          </div>

                          <div className="flex justify-between pt-4 border-t border-slate-900 mt-4">
                            <button
                              type="button"
                              onClick={handlePrevStep}
                              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-4 py-2 rounded-xl cursor-pointer"
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              onClick={handleNextStep}
                              className="bg-[#3B82F6] hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-bold flex items-center space-x-1 cursor-pointer border-none"
                            >
                              <span>Continue</span>
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="modal-step-3"
                          variants={{
                            initial: { opacity: 0, x: 10 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -10 }
                          }}
                          className="space-y-4"
                        >
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 3: Upload Resume & Submit</h4>

                          <div className="space-y-1.5 text-left">
                            <label className="text-slate-400 font-bold uppercase tracking-widest text-[9px]">Academic CV / Resume</label>
                            <div className="border border-dashed border-slate-800 hover:border-[#3B82F6] rounded-xl p-4 flex flex-col items-center justify-center bg-[#070B13]/50 relative cursor-pointer min-h-[120px]">
                              <input
                                type="file"
                                accept="application/pdf"
                                required
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                              <Upload className="w-6 h-6 text-slate-500 mb-1.5" />
                              <span className="text-slate-300 font-bold text-[11px]">
                                {cvFile ? cvFile.name : "Select PDF Resume (Max 8MB)"}
                              </span>
                              <span className="text-[9px] text-slate-500 mt-0.5">Documents must be in PDF format</span>
                            </div>
                          </div>

                          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-left">
                            <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Summary Review</p>
                            <div className="grid grid-cols-2 gap-y-1 text-[10px] text-slate-400 leading-normal">
                              <div><span className="text-slate-500">Name:</span> {fullName}</div>
                              <div><span className="text-slate-500">Degree:</span> {course}</div>
                              <div className="col-span-2"><span className="text-slate-500">Institution:</span> {institutionName}</div>
                            </div>
                          </div>

                          <div className="flex justify-between pt-4 border-t border-slate-900 mt-4">
                            <button
                              type="button"
                              onClick={handlePrevStep}
                              disabled={submitting}
                              className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 px-4 py-2 rounded-xl cursor-pointer"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              disabled={submitting}
                              className="bg-[#3B82F6] hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-bold flex items-center space-x-1.5 cursor-pointer shadow-md border-none"
                            >
                              <Send className="w-3.5 h-3.5 text-white" />
                              <span>{submitting ? "Submitting..." : "Submit Profile"}</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* BROCHURE / SYLLABUS MODAL OVERLAY */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isBrochureModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBrochureModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#0B0F19] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 relative space-y-6 shadow-2xl z-10 text-slate-200"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsBrochureModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1 bg-slate-950/60 border border-slate-800 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2 border-b border-slate-900 pb-4 text-left">
                <h3 className="text-xl font-heading font-extrabold text-white">
                  Fellowship Syllabus & Curriculum
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  A structured 5-month cohort training module covering scientific foundation to peer publication.
                </p>
              </div>

              {/* Syllabus schedule display */}
              <div className="max-h-[350px] overflow-y-auto pr-2 space-y-4 text-left">
                {[
                  {
                    m: "Month 1",
                    t: "Research Foundations & Methodology",
                    details: [
                      "Literature search strategies using PubMed, Scopus, and index engines.",
                      "Formulating hypothesis, writing systematic reviews, and meta-analyses.",
                      "Biostatistics basics, p-value calculations, and experimental validation design."
                    ]
                  },
                  {
                    m: "Month 2",
                    t: "Mentorship & Topic Selection",
                    details: [
                      "Matching with assigned PhD researchers and academic advisors.",
                      "Topic validation and scope alignment for high-impact publication.",
                      "Methodology prep and computational tool configuration."
                    ]
                  },
                  {
                    m: "Month 3",
                    t: "Project Development & Experimentation",
                    details: [
                      "Computational biology runs, database processing, or clinical datasets modeling.",
                      "Algorithm configurations, data cleaning, and results verification.",
                      "Interim presentation to the cohort review board."
                    ]
                  },
                  {
                    m: "Month 4",
                    t: "Research Paper Writing",
                    details: [
                      "Section-by-section writing from Abstract, Intro to Methods and Discussion.",
                      "Formatting charts, citation references setup (Mendeley/Zotero).",
                      "Targeting indexed journals guidelines (Nature, IEEE, Elseviers)."
                    ]
                  },
                  {
                    m: "Month 5",
                    t: "Publication & Presentation",
                    details: [
                      "Submitting finalized manuscripts to peer-reviewed indexed journals.",
                      "Responding to target editorial comments and revising paper revisions.",
                      "Portfolio graduation and public cohort presentation of research."
                    ]
                  }
                ].map((monthData, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-4 border border-slate-900 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-[#3B82F6] font-extrabold">
                        {monthData.m}
                      </span>
                      <span className="text-[11px] font-extrabold text-white">
                        {monthData.t}
                      </span>
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-400 leading-relaxed font-medium">
                      {monthData.details.map((det, dIdx) => (
                        <li key={dIdx}>{det}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-900">
                <button
                  onClick={handleDownloadBrochure}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-6 py-3 rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-all border border-slate-800"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download PDF Brochure</span>
                </button>
                
                <button
                  onClick={() => {
                    setIsBrochureModalOpen(false);
                    setIsApplyModalOpen(true);
                  }}
                  className="w-full sm:w-auto bg-[#3B82F6] hover:bg-blue-600 text-white font-extrabold px-8 py-3 rounded-xl cursor-pointer transition-all border-none"
                >
                  Apply to Program
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
