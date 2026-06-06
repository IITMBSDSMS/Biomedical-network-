"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, Award, CheckCircle, Lock, Book, FileText, 
  ChevronRight, ChevronLeft, X, ShieldCheck, FileCheck2, ArrowLeft, ArrowRight, Download,
  MoreVertical, Calendar as CalendarIcon, Sparkles, Check, Play, Edit3
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { downloadCertificateAsPDF, CertificatePreview } from "@/components/ui/CertificateDownload";

// Curriculum Data
const MODULES = [
  {
    index: 0,
    title: "Scientific Inquiry & Hypothesis",
    description: "Formulating testable hypotheses, variable controls, and structured research parameters.",
    provider: "Stanford University",
    estCompletion: "Jun 21, 2026",
    nextTask: "Introduction and Scientific Hypothesis Formulation",
    duration: "Video (15 minutes)",
    slides: [
      {
        title: "The Core of Scientific Inquiry",
        content: "Scientific inquiry is the systematic process of asking questions about the natural world and seeking evidence-based answers. Unlike casual observation, formal research requires strict adherence to method, beginning with a rigorous analysis of existing literature and identifying gaps in global understanding."
      },
      {
        title: "Formulating a Testable Hypothesis",
        content: "A hypothesis is a precise, testable statement predicting the relationship between variables. It must be falsifiable—meaning there must be a possible outcome that could prove it wrong. A strong hypothesis avoids vague terms and clearly specifies what is being measured and compared."
      },
      {
        title: "Variables and Controls",
        content: "Every valid scientific experiment isolates variables. The Independent Variable is manipulated by the researcher (e.g., dosage levels). The Dependent Variable is measured (e.g., cell knockdown percentage). Control variables must remain constant to prevent confounding results."
      },
      {
        title: "Designing the Control Group",
        content: "The Control Group provides a baseline to compare experimental outcomes. Without a proper control group (e.g., wildtype cells exposed to a placebo), it is impossible to determine whether the observed changes were caused by the experimental treatment or random external factors."
      }
    ],
    quiz: {
      questions: [
        {
          q: "What is the primary purpose of a research hypothesis?",
          options: [
            "To prove the researcher's preconceptions are correct.",
            "To propose a testable, falsifiable relationship between variables.",
            "To write a summary of the literature review."
          ]
        },
        {
          q: "In an experiment, the variable that is manipulated by the investigator is the:",
          options: [
            "Dependent variable",
            "Control variable",
            "Independent variable"
          ]
        }
      ]
    }
  },
  {
    index: 1,
    title: "Literature Reviews & Citations (BibTeX)",
    description: "Academic literature searches, metadata formatting, and BibTeX indexing guidelines.",
    provider: "MIT - Massachusetts Institute of Technology",
    estCompletion: "Jun 28, 2026",
    nextTask: "BibTeX Formats and Literature Search Strategies",
    duration: "Graded Assignment (30 minutes)",
    slides: [
      {
        title: "The Purpose of Literature Reviews",
        content: "A literature review compiles, evaluates, and synthesizes existing research on a specific topic. It justifies your study by proving that it does not merely duplicate known facts, but builds upon, critiques, or resolves gaps in current academic consensus."
      },
      {
        title: "Citation Standards & Ethics",
        content: "Proper citation serves two critical purposes: it credits original researchers and provides a traceable roadmap for readers to verify your findings. Plagiarism, including self-plagiarism, is a severe violation of scientific integrity and leads to immediate retraction."
      },
      {
        title: "Understanding BibTeX Format",
        content: "BibTeX is the standard bibliographic management tool used in LaTeX documents. It structures reference reference metadata using key-value fields (author, title, journal, year, volume). This allows papers to be dynamically styled and indexed by publication registries."
      },
      {
        title: "BibTeX Entry Types",
        content: "Different publications require different BibTeX types. For peer-reviewed journal articles, use '@article'. For textbooks, use '@book'. For conference presentations, use '@inproceedings'. Each type has mandatory fields required to generate standard indexes."
      }
    ],
    quiz: {
      questions: [
        {
          q: "Which BibTeX entry type is most appropriate for a peer-reviewed research article published in a journal?",
          options: [
            "@article",
            "@book",
            "@inproceedings"
          ]
        },
        {
          q: "What is the purpose of the citation key in a BibTeX entry?",
          options: [
            "It holds the publisher's digital licensing signature.",
            "A unique identifier used inside the document text to link to the bibliography.",
            "It represents the page numbering order."
          ]
        }
      ]
    }
  },
  {
    index: 2,
    title: "Biomedical Methodologies & Safety",
    description: "Biosafety levels (BSL), containment practices, and genomic PCR procedures.",
    provider: "Harvard University",
    estCompletion: "Jul 5, 2026",
    nextTask: "BSL-2 Lab Containment and PCR Wet-Lab Assays",
    duration: "Video (20 minutes)",
    slides: [
      {
        title: "Laboratory Containment & BSL",
        content: "Biosafety Levels (BSL 1 to 4) define the containment conditions required to handle biological agents safely. BSL-1 covers low-risk agents (e.g., non-pathogenic E. coli). BSL-4 covers highly lethal, untreatable pathogens (e.g., Ebola virus), requiring positive-pressure suits."
      },
      {
        title: "BSL-2 Standard Safety Practices",
        content: "BSL-2 applies to agents associated with human disease (e.g., Hepatitis, Staph). Personnel must have specific training, wear PPE (lab coat, gloves, eye protection), and perform all aerosol-generating procedures inside a certified Biosafety Cabinet (BSC)."
      },
      {
        title: "Polymerase Chain Reaction (PCR)",
        content: "PCR is a foundational genomic methodology used to amplify specific DNA sequences. Through thermal cycling (denaturation, annealing, extension), a single DNA fragment is duplicated exponentially, producing millions of copies for analysis."
      },
      {
        title: "Quantitative PCR & Gel Electrophoresis",
        content: "Quantitative PCR (qPCR) monitors amplification in real-time using fluorescent dyes, measuring gene expression levels. Gel Electrophoresis separates DNA fragments by molecular size using an electrical current, letting researchers verify sequence lengths."
      }
    ],
    quiz: {
      questions: [
        {
          q: "What is the main safety precaution when handling Biosafety Level 2 (BSL-2) agents?",
          options: [
            "Wearing a positive-pressure astronaut-style suit.",
            "Sterilizing the lab with ultraviolet light every hour.",
            "Performing aerosol-generating work inside a certified Biosafety Cabinet."
          ]
        },
        {
          q: "Why is PCR (Polymerase Chain Reaction) used in genomics research?",
          options: [
            "To amplify specific DNA sequences millions of times for analysis.",
            "To sequence the entire genome in a single step.",
            "To edit genes inside living organisms directly."
          ]
        }
      ]
    }
  },
  {
    index: 3,
    title: "Translational Medicine & Ethics",
    description: "Bridging bench science with clinical trials under ICMR & international ethical rules.",
    provider: "IBM Watson Health",
    estCompletion: "Jul 12, 2026",
    nextTask: "Clinical Trial Ethics and Informed Consent Frameworks",
    duration: "Graded Assignment (15 minutes)",
    slides: [
      {
        title: "What is Translational Medicine?",
        content: "Translational Medicine is the practice of moving basic laboratory discoveries ('bench') into practical clinical therapies ('bedside'). It ensures molecular research is translated into active diagnostics, therapeutics, or medical devices."
      },
      {
        title: "Human Subject Protections",
        content: "Any research involving human participants must prioritize subject safety and autonomy. The Nuremberg Code, Declaration of Helsinki, and national bodies (like ICMR in India) establish strict boundaries to protect participant welfare."
      },
      {
        title: "Informed Consent Requirements",
        content: "Informed Consent is a continuous process, not just a signed paper. Subjects must be fully informed about the study's scope, risks, benefits, and alternative options. Consent must be voluntary, and subjects can withdraw at any time without penalty."
      },
      {
        title: "Clinical Trial Ethics & Equipoise",
        content: "Clinical trials require 'clinical equipoise'—genuine scientific uncertainty about which treatment arm is superior. It is unethical to conduct a trial if one treatment is already known to be significantly better or more harmful than the alternative."
      }
    ],
    quiz: {
      questions: [
        {
          q: "What does 'Informed Consent' signify in human clinical research?",
          options: [
            "A signed agreement indicating that the subject cannot sue the institution.",
            "A voluntary agreement of a subject based on full disclosure of study risks and benefits.",
            "An agreement approved by the regulatory agency on behalf of the subject."
          ]
        },
        {
          q: "According to clinical research ethics, what does 'Equipoise' refer to?",
          options: [
            "The equal funding distribution between trial arms.",
            "The physical balance of experimental laboratory equipment.",
            "Genuine scientific uncertainty about the relative therapeutic benefits of treatment arms."
          ]
        }
      ]
    }
  }
];

export default function TrainingClient() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<number, boolean>>({});
  const [certificate, setCertificate] = useState<any>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<"progress" | "completed" | "certificates">("progress");

  // Career Goal Customizer
  const [careerGoal, setCareerGoal] = useState("Biomedical Researcher");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState("Biomedical Researcher");

  // Active slideshow / quiz state
  const [activeModule, setActiveModule] = useState<any>(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizError, setQuizError] = useState("");
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Certificate Issuance State
  const [issuingCert, setIssuingCert] = useState(false);
  const [certSuccess, setCertSuccess] = useState(false);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Override body color scheme to clean light-theme on mount, and restore on unmount
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    const originalColor = document.body.style.color;

    document.body.style.backgroundColor = "#F8FAFC";
    document.body.style.color = "#0F172A";

    // Load custom goal if any
    const savedGoal = localStorage.getItem("healix_academy_career_goal");
    if (savedGoal) {
      setCareerGoal(savedGoal);
      setGoalInput(savedGoal);
    }

    return () => {
      document.body.style.backgroundColor = originalBg;
      document.body.style.color = originalColor;
    };
  }, []);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const userRes = await fetch("/api/auth/session");
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.user) {
          setUser(userData.user);
          
          const statusRes = await fetch("/api/training/status");
          if (statusRes.ok) {
            const data = await statusRes.json();
            const progMap: Record<number, boolean> = {};
            data.progress.forEach((p: any) => {
              progMap[p.moduleIndex] = p.isCompleted;
            });
            setProgress(progMap);
            setCertificate(data.certificate);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load training status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartModule = (mod: any) => {
    setActiveModule(mod);
    setActiveSlideIdx(0);
    setShowQuiz(false);
    setSelectedAnswers({});
    setQuizError("");
    setQuizSuccess(false);
  };

  const handleNextSlide = () => {
    if (activeSlideIdx < activeModule.slides.length - 1) {
      setActiveSlideIdx(activeSlideIdx + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handlePrevSlide = () => {
    if (activeSlideIdx > 0) {
      setActiveSlideIdx(activeSlideIdx - 1);
    }
  };

  const handleSelectAnswer = (qIdx: number, optIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [qIdx]: optIdx
    });
    setQuizError("");
  };

  const handleSubmitQuiz = async () => {
    const qCount = activeModule.quiz.questions.length;
    const answeredCount = Object.keys(selectedAnswers).length;

    if (answeredCount < qCount) {
      setQuizError("Please answer all questions before submitting.");
      return;
    }

    setSubmittingQuiz(true);
    setQuizError("");

    try {
      const answersArray = Array.from({ length: qCount }, (_, i) => selectedAnswers[i]);
      const res = await fetch("/api/training/complete-module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleIndex: activeModule.index,
          answers: answersArray
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isPassed) {
          setQuizSuccess(true);
          setProgress({
            ...progress,
            [activeModule.index]: true
          });
        } else {
          setQuizError("Incorrect answers. Please review the course slides and try again!");
        }
      } else {
        setQuizError("Failed to submit quiz. Please try again.");
      }
    } catch (err) {
      setQuizError("An error occurred. Please try again.");
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleClaimCertificate = async () => {
    setIssuingCert(true);
    try {
      const res = await fetch("/api/training/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCertificate(data.certificate);
          setCertSuccess(true);
        }
      }
    } catch (err) {
      console.error("Failed to claim certificate:", err);
    } finally {
      setIssuingCert(false);
    }
  };

  const saveGoal = () => {
    setCareerGoal(goalInput);
    localStorage.setItem("healix_academy_career_goal", goalInput);
    setIsEditingGoal(false);
  };

  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / MODULES.length) * 100);

  // Dynamic Greeting based on Local Time
  const getGreeting = () => {
    const hr = currentDate.getHours();
    if (hr < 12) return "Good morning";
    if (hr < 17) return "Good afternoon";
    return "Good evening";
  };

  // Calendar computation helper
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    // Shift index so Monday is 0 and Sunday is 6
    const firstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  };

  const calendarDays = getCalendarDays();
  const currentMonthName = currentDate.toLocaleString("default", { month: "long" });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-600">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">Loading Academy Status...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen bg-[#F8FAFC] flex flex-col justify-between overflow-x-hidden">
        <Navbar currentUser={null} />

        <main className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
          <div className="max-w-md w-full border border-slate-200 bg-white rounded-3xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-accent-blue to-teal-500" />
            <Award className="w-16 h-16 text-amber-500/80 mx-auto animate-bounce" />
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">Access Research Academy</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                You must initialize your BioLabs credentials or log in to track module progress and earn credentials.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login?redirect=/training"
                className="w-full block bg-accent-blue hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Log In to Academy
              </Link>
            </div>
            <Link href="/" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Filter modules based on active tab
  const inProgressModules = MODULES.filter(m => !progress[m.index]);
  const completedModules = MODULES.filter(m => progress[m.index]);

  const initials = (user.name || user.email || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex flex-col justify-between overflow-x-hidden text-slate-700">
      
      {/* Navbar */}
      <Navbar currentUser={user} />

      <main className="flex-grow pt-28 pb-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* ============================================================== */}
          {/* SECTION 1 — HEADER GREETING & CAREER GOALS (COURSERA STYLE) */}
          {/* ============================================================== */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
            <div className="flex items-start gap-4 text-left w-full md:w-auto">
              {/* Profile Avatar circle */}
              <div className="w-16 h-16 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
                {initials}
              </div>
              <div className="space-y-1.5 min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
                  {getGreeting()}, {user.name || user.email.split("@")[0]}
                </h1>
                
                {/* Career Goals */}
                <div className="text-xs text-slate-500 font-semibold leading-relaxed flex flex-wrap items-center gap-1">
                  <span>Your career goal is to become a</span>
                  {isEditingGoal ? (
                    <div className="inline-flex items-center gap-1.5 mt-0.5">
                      <input 
                        type="text" 
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-accent-blue"
                      />
                      <button 
                        onClick={saveGoal}
                        className="bg-accent-blue text-white px-2 py-0.5 rounded text-[10px] font-bold hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <>
                      <strong className="text-slate-800 underline decoration-slate-400 font-bold">
                        {careerGoal}
                      </strong>
                      <span>. Academic / Guidance Counselor, Healthcare, or 2 more</span>
                      <button 
                        onClick={() => setIsEditingGoal(true)}
                        className="text-accent-blue hover:text-blue-600 ml-1 inline-flex items-center gap-0.5 font-bold cursor-pointer"
                      >
                        Edit goal
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Arched pathway vector illustration exactly like the Coursera layout */}
            <div className="hidden md:block shrink-0 select-none">
              <svg width="240" height="110" viewBox="0 0 240 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background Hill */}
                <path d="M-20 120 C 60 70, 180 80, 260 120 Z" fill="#EEF2F6" />
                <path d="M30 120 C 110 55, 200 60, 280 120 Z" fill="#E2E8F0" />
                
                {/* Winding Stairway Path */}
                <path d="M 60 110 L 80 98 L 110 98 L 130 84 L 150 84 L 170 70 L 190 70" stroke="#C7D2FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 60 110 L 80 98 L 110 98 L 130 84 L 150 84 L 170 70 L 190 70" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3,3" />

                {/* Arched Doorway / Portal */}
                <g transform="translate(180, 42)">
                  {/* Door Shadow */}
                  <rect x="0" y="0" width="22" height="34" rx="11" fill="#FEE2E2" />
                  {/* Outer Frame */}
                  <rect x="2" y="0" width="18" height="32" rx="9" fill="#F59E0B" />
                  {/* Inner Glowing doorway */}
                  <rect x="4.5" y="3" width="13" height="29" rx="6.5" fill="#FEF3C7" />
                  {/* Small stairs platform inside */}
                  <path d="M 4.5 24 L 17.5 24" stroke="#D97706" strokeWidth="2" />
                  <path d="M 4.5 28 L 17.5 28" stroke="#D97706" strokeWidth="2" />
                </g>

                {/* Trees (Cone pine style) */}
                {/* Tree 1 */}
                <g transform="translate(25, 68)">
                  <rect x="5.5" y="18" width="3" height="10" rx="1" fill="#78350F" />
                  <polygon points="7,0 0,18 14,18" fill="#10B981" />
                  <polygon points="7,4 2,14 12,14" fill="#34D399" />
                </g>
                {/* Tree 2 */}
                <g transform="translate(152, 54)">
                  <rect x="4.5" y="14" width="2" height="8" rx="1" fill="#78350F" />
                  <polygon points="5.5,0 0,14 11,14" fill="#059669" />
                  <polygon points="5.5,3 1.5,11 9.5,11" fill="#10B981" />
                </g>
                {/* Tree 3 */}
                <g transform="translate(215, 64)">
                  <rect x="5.5" y="18" width="3" height="10" rx="1" fill="#78350F" />
                  <polygon points="7,0 0,18 14,18" fill="#10B981" />
                  <polygon points="7,4 2,14 12,14" fill="#34D399" />
                </g>

                {/* Small circular path flag */}
                <circle cx="60" cy="110" r="5" fill="#4338CA" />
                <circle cx="60" cy="110" r="2.5" fill="#FBBF24" />
              </svg>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 2 — HORIZONTAL TABS (IN PROGRESS, COMPLETED, CERTIFICATES) */}
          {/* ============================================================== */}
          <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("progress")}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === "progress"
                  ? "text-slate-900 border-[#0F172A] font-extrabold"
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === "completed"
                  ? "text-slate-900 border-[#0F172A] font-extrabold"
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab("certificates")}
              className={`pb-3 border-b-2 transition-all cursor-pointer ${
                activeTab === "certificates"
                  ? "text-slate-900 border-[#0F172A] font-extrabold"
                  : "text-slate-400 border-transparent hover:text-slate-600"
              }`}
            >
              Certificates
            </button>
          </div>

          {/* ============================================================== */}
          {/* SECTION 3 — DOUBLE COLUMN WORKSPACE */}
          {/* ============================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Course Cards or Certificate Showcase (8 cols) ── */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* TAB 1: IN PROGRESS */}
              {activeTab === "progress" && (
                <>
                  {inProgressModules.map((mod) => (
                    <div 
                      key={mod.index}
                      className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-stretch justify-between gap-6 hover:shadow-md hover:border-slate-300 transition-all duration-300 text-left"
                    >
                      {/* Left: Provider, Course Title, Progress Bar */}
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500 shrink-0">
                            🎓
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{mod.provider}</span>
                        </div>
                        <h3 className="text-base font-bold font-heading text-slate-900 leading-snug">
                          {mod.title}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          Course • 0% complete • Estimated completion: {mod.estCompletion}
                        </p>
                        {/* Progress Bar */}
                        <div className="w-full max-w-[260px] bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200 mt-2">
                          <div className="bg-violet-600 h-full w-[2%]" />
                        </div>
                      </div>

                      {/* Middle: Next task information */}
                      <div className="flex-1 md:border-l md:border-slate-100 md:pl-6 flex flex-col justify-center text-left">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">{mod.nextTask}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                          <Play className="w-3 h-3 text-slate-400" /> {mod.duration}
                        </p>
                      </div>

                      {/* Right: Resume button & Actions */}
                      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                        <button
                          onClick={() => handleStartModule(mod)}
                          className="bg-accent-blue hover:bg-blue-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          Resume
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {inProgressModules.length === 0 && (
                    <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                      <div>
                        <h4 className="text-base font-bold text-slate-800">All modules completed!</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          You have completed the entire curriculum. Head over to the Certificates tab to claim your reward.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: COMPLETED */}
              {activeTab === "completed" && (
                <>
                  {completedModules.map((mod) => (
                    <div 
                      key={mod.index}
                      className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-stretch justify-between gap-6 hover:shadow-md hover:border-slate-300 transition-all duration-300 text-left"
                    >
                      {/* Left: Provider, Course Title, Progress Bar */}
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-600 shrink-0">
                            ✓
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{mod.provider}</span>
                        </div>
                        <h3 className="text-base font-bold font-heading text-slate-900 leading-snug">
                          {mod.title}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                          <span className="text-emerald-500">✓ 100% complete</span> • Passed
                        </p>
                        {/* Progress Bar */}
                        <div className="w-full max-w-[260px] bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200 mt-2">
                          <div className="bg-emerald-500 h-full w-full" />
                        </div>
                      </div>

                      {/* Middle: Review info */}
                      <div className="flex-1 md:border-l md:border-slate-100 md:pl-6 flex flex-col justify-center text-left">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Review Course Slides</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                          <FileText className="w-3 h-3 text-slate-400" /> Study Material (15 minutes)
                        </p>
                      </div>

                      {/* Right: Review button & Actions */}
                      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                        <button
                          onClick={() => handleStartModule(mod)}
                          className="border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-55 hover:text-slate-900 font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          Review
                        </button>
                        <button className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {completedModules.length === 0 && (
                    <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center space-y-4">
                      <Lock className="w-12 h-12 text-slate-300 mx-auto" />
                      <div>
                        <h4 className="text-base font-bold text-slate-800">No completed courses yet</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Complete slides and score 100% on checkup exams to list modules here.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TAB 3: CERTIFICATES */}
              {activeTab === "certificates" && (
                <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-md text-left">
                  {certificate ? (
                    <div className="flex flex-col">
                      {/* Certificate Preview Scaled */}
                      <div className="relative w-full bg-[#04091a] overflow-hidden" style={{ paddingBottom: "32%" }}>
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                          <div style={{ transform: "scale(0.256)", transformOrigin: "center center", width: "1122px", position: "absolute" }}>
                            <CertificatePreview
                              fullName={certificate.fullName}
                              certHash={certificate.certHash}
                              issuedAt={certificate.issuedAt}
                            />
                          </div>
                        </div>
                        {/* Glow overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent pointer-events-none" />
                      </div>

                      {/* Info + Actions */}
                      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100">
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest font-mono flex items-center space-x-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span>Verified Credential — Active</span>
                          </span>
                          <h3 className="text-base font-heading font-extrabold text-slate-900 uppercase leading-none">Certificate of Completion</h3>
                          <div className="flex items-center space-x-2 mt-1.5">
                            <div className="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 font-mono text-[9px] font-bold text-amber-600 select-all tracking-wider shadow-inner truncate max-w-[220px]">
                              {certificate.certHash}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                          <Link
                            href={`/training/verify?hash=${certificate.certHash}`}
                            className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-lg border border-slate-200 hover:border-accent-blue/50 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all"
                          >
                            <FileCheck2 className="w-3.5 h-3.5 text-accent-blue" />
                            <span>Verify Portal</span>
                          </Link>
                          <button
                            onClick={() => downloadCertificateAsPDF(certificate.fullName, certificate.certHash, certificate.issuedAt)}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-accent-blue hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center justify-center space-x-1.5 cursor-pointer transition-all shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
                      <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center">
                        <Award className="w-7 h-7 text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-heading font-extrabold text-slate-800 uppercase tracking-wider">Credential Locked</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Complete all 4 training modules and score 100% on their exams to unlock your credential.
                        </p>
                      </div>

                      {progressPercent === 100 ? (
                        <button
                          onClick={handleClaimCertificate}
                          disabled={issuingCert}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                        >
                          {issuingCert ? "Generating Certificate..." : "Claim Certificate of Completion"}
                        </button>
                      ) : (
                        <div className="w-full space-y-2">
                          <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <span>Syllabus Completion</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                            <div className="bg-violet-600 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* ── Right Column: Calendar & Stats (4 cols) ── */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Calendar Widget */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs text-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold font-heading text-slate-900 uppercase tracking-wider">
                    {currentMonthName} {currentDate.getFullYear()}
                  </h3>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(newDate.getMonth() - 1);
                        setCurrentDate(newDate);
                      }}
                      className="p-1 hover:bg-slate-100 rounded cursor-pointer text-slate-400 hover:text-slate-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        const newDate = new Date(currentDate);
                        newDate.setMonth(newDate.getMonth() + 1);
                        setCurrentDate(newDate);
                      }}
                      className="p-1 hover:bg-slate-100 rounded cursor-pointer text-slate-400 hover:text-slate-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Calendar Days of Week */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2 font-mono">
                  <span>Mo</span>
                  <span>Tu</span>
                  <span>We</span>
                  <span>Th</span>
                  <span>Fr</span>
                  <span>Sa</span>
                  <span>Su</span>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                  {calendarDays.map((day, idx) => {
                    const isToday = day === new Date().getDate() && 
                                    currentDate.getMonth() === new Date().getMonth() && 
                                    currentDate.getFullYear() === new Date().getFullYear();
                    return (
                      <div 
                        key={idx} 
                        className="h-7 flex items-center justify-center relative"
                      >
                        {day && (
                          <span className={`w-7 h-7 flex items-center justify-center rounded-full leading-none ${
                            isToday 
                              ? "border-2 border-violet-600 font-extrabold text-violet-700" 
                              : "text-slate-700 hover:bg-slate-100 cursor-pointer"
                          }`}>
                            {day}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4 pt-3 border-t border-slate-100 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                    1+ daily goals
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    All daily goals
                  </span>
                </div>
              </div>

              {/* Stats Widget */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs text-left space-y-4">
                <div>
                  <h3 className="text-xs font-bold font-heading text-slate-900 uppercase tracking-wider">
                    Last 4 weeks
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Activity Record</p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-black font-heading text-slate-900 leading-none">{completedCount}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-tight">Daily goals completed</p>
                  </div>
                  <div className="space-y-1 border-l border-slate-100">
                    <p className="text-2xl font-black font-heading text-slate-900 leading-none">{completedCount}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-tight">Items completed</p>
                  </div>
                  <div className="space-y-1 border-l border-slate-100">
                    <p className="text-2xl font-black font-heading text-slate-900 leading-none">{completedCount * 15}</p>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-tight">Minutes learned</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* ============================================================== */}
      {/* SLIDESHOW / QUIZ VIEWER MODAL OVERLAY */}
      {/* ============================================================== */}
      {activeModule && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-2xl w-full border border-slate-200 bg-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[440px] max-h-[90vh] text-slate-700">
            
            {/* Header top bar */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[9px] font-bold text-accent-blue uppercase tracking-widest font-mono">Module 0{activeModule.index + 1} Course Material</span>
                <h3 className="text-base font-heading font-extrabold text-slate-950 uppercase tracking-tight leading-none mt-1">
                  {activeModule.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModule(null)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal slides contents */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto flex flex-col justify-center text-center">
              {!showQuiz ? (
                /* STUDY SLIDES PANEL */
                <div className="space-y-6 max-w-lg mx-auto">
                  <div className="space-y-2 text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                      Slide {activeSlideIdx + 1} of {activeModule.slides.length}
                    </span>
                    <h4 className="text-base sm:text-xl font-heading font-extrabold text-slate-900 uppercase tracking-tight leading-snug">
                      {activeModule.slides[activeSlideIdx].title}
                    </h4>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed text-justify font-medium px-4">
                    {activeModule.slides[activeSlideIdx].content}
                  </p>
                </div>
              ) : (
                /* QUIZ MULTIPLE CHOICE PANEL */
                <div className="space-y-6 max-w-lg mx-auto w-full">
                  <div className="text-center space-y-1">
                    <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest font-mono block animate-pulse">Knowledge Verification</span>
                    <h4 className="text-base sm:text-lg font-heading font-extrabold text-slate-900 uppercase leading-none">Module 0{activeModule.index + 1} Checkup Quiz</h4>
                  </div>

                  {quizSuccess ? (
                    <div className="p-6 border border-emerald-100 bg-emerald-50 rounded-2xl space-y-4 text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Module Exam Passed!</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          Your score has been saved in the registry database. You can proceed to check other modules or claim credentials.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5 text-left w-full">
                      {activeModule.quiz.questions.map((qObj: any, qIdx: number) => (
                        <div key={qIdx} className="space-y-2.5">
                          <p className="text-xs font-bold text-slate-800">
                            {qIdx + 1}. {qObj.q}
                          </p>
                          <div className="grid grid-cols-1 gap-2">
                            {qObj.options.map((opt: string, optIdx: number) => {
                              const isSelected = selectedAnswers[qIdx] === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectAnswer(qIdx, optIdx)}
                                  className={`p-3 text-left text-xs rounded-xl border transition-all cursor-pointer ${
                                    isSelected 
                                      ? "border-accent-blue bg-blue-50/40 text-slate-900 font-semibold" 
                                      : "border-slate-200 bg-slate-50 hover:border-slate-300 text-slate-500 hover:text-slate-700"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}

                      {quizError && (
                        <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 text-rose-700 text-[10px] font-bold text-center">
                          {quizError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom slides navigation bar */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              {!showQuiz ? (
                <>
                  <button
                    onClick={handlePrevSlide}
                    disabled={activeSlideIdx === 0}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-350 bg-white text-slate-600 disabled:opacity-30 cursor-pointer flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="px-3.5 py-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer flex items-center space-x-1 transition-colors"
                  >
                    <span>{activeSlideIdx === activeModule.slides.length - 1 ? "Start Quiz" : "Next Slide"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowQuiz(false);
                      setQuizError("");
                      setQuizSuccess(false);
                    }}
                    disabled={quizSuccess}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-600 disabled:opacity-30 cursor-pointer flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Review Materials</span>
                  </button>
                  {quizSuccess ? (
                    <button
                      onClick={() => setActiveModule(null)}
                      className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Close Viewer
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submittingQuiz}
                      className="px-5 py-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      {submittingQuiz ? "Submitting..." : "Submit Exam"}
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
