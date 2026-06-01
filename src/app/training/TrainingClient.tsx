"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, Award, CheckCircle, Lock, Book, FileText, 
  ChevronRight, ChevronLeft, X, ShieldCheck, FileCheck2, ArrowLeft, ArrowRight, Download
} from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import { downloadCertificateAsPDF, CertificatePreview } from "@/components/ui/CertificateDownload";

// Curriculum Data
const MODULES = [
  {
    index: 0,
    title: "Scientific Inquiry & Hypothesis",
    description: "Formulating testable hypotheses, variable controls, and structured research parameters.",
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
        content: "BibTeX is the standard bibliographic management tool used in LaTeX documents. It structures reference metadata using key-value fields (author, title, journal, year, volume). This allows papers to be dynamically styled and indexed by publication registries."
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

  // Modals / Slides view state
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

  // Removed old SVG download — now using PDF via CertificateDownload component
  const downloadCertificateSVG_UNUSED = (fullName: string, hash: string, issuedAt: string) => {
    const formattedDate = new Date(issuedAt).toLocaleDateString();
    const svgContent = `
<svg viewBox="0 0 800 600" width="800" height="600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#070B13" />
  <rect x="15" y="15" width="770" height="570" rx="6" stroke="#f59e0b" strokeWidth="2" />
  <rect x="25" y="25" width="750" height="550" rx="4" stroke="#1e293b" strokeWidth="1" />
  <rect x="28" y="28" width="744" height="544" rx="3" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="6,4" />
  
  <path d="M 20 50 L 50 20 M 20 60 L 60 20 M 20 70 L 70 20" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
  <path d="M 780 50 L 750 20 M 780 60 L 740 20 M 780 70 L 730 20" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
  <path d="M 20 550 L 50 580 M 20 540 L 60 580 M 20 530 L 70 580" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />
  <path d="M 780 550 L 750 580 M 780 540 L 740 580 M 780 530 L 730 580" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />

  <circle cx="400" cy="300" r="140" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.03" />
  <circle cx="400" cy="300" r="120" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.02" />
  
  <text x="400" y="80" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="4">HEALIX BIOLABS ACADEMY OF BIOMEDICAL SCIENCES</text>
  <line x1="300" y1="95" x2="500" y2="95" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.5" />
  
  <text x="400" y="150" fill="#ffffff" fontSize="30" fontWeight="900" fontFamily="serif" textAnchor="middle" letterSpacing="1">OFFICIAL CERTIFICATE OF COMPLETION</text>
  <text x="400" y="185" fill="#94a3b8" fontSize="14" fontFamily="serif" fontStyle="italic" textAnchor="middle">This professional credential is formally awarded to</text>
  
  <text x="400" y="245" fill="#f59e0b" fontSize="36" fontWeight="bold" fontFamily="serif" textAnchor="middle" letterSpacing="1">${fullName}</text>
  <line x1="200" y1="265" x2="600" y2="265" stroke="#f59e0b" strokeWidth="1.5" />
  
  <text x="400" y="305" fill="#e2e8f0" fontSize="12" fontFamily="sans-serif" textAnchor="middle">for outstanding completion of the specialized curriculum in</text>
  <text x="400" y="330" fill="#3b82f6" fontSize="16" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">ADVANCED BIOMEDICAL RESEARCH METHODOLOGIES</text>
  
  <text x="400" y="365" fill="#94a3b8" fontSize="10.5" fontFamily="sans-serif" textAnchor="middle">Demonstrating competency in: Scientific Inquiry Paradigms • Reference Metadata Formatting (BibTeX)</text>
  <text x="400" y="385" fill="#94a3b8" fontSize="10.5" fontFamily="sans-serif" textAnchor="middle">Biosafety Containment (BSL-2 Guidelines) • PCR Genomic Amplification Protocols • Translational Ethics (ICMR Standards)</text>

  <g transform="translate(100, 430)">
    <line x1="0" y1="40" x2="180" y2="40" stroke="#475569" strokeWidth="1" />
    <text x="90" y="25" fill="#3b82f6" fontSize="20" fontFamily="cursive, Georgia, serif" textAnchor="middle" fontStyle="italic">Priya Sharma</text>
    <text x="90" y="55" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">DR. PRIYA SHARMA, PHD</text>
    <text x="90" y="68" fill="#64748b" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle">Chief Scientific Officer, Healix</text>
  </g>
  
  <g transform="translate(400, 440)">
    <path d="M -15 20 L -25 70 L 0 55 L 25 70 L 15 20 Z" fill="#d97706" opacity="0.8" />
    <path d="M -5 20 L -10 80 L 10 70 L 30 80 L 15 20 Z" fill="#b45309" opacity="0.9" />
    <circle cx="0" cy="0" r="32" fill="#d97706" stroke="#f59e0b" strokeWidth="2" />
    <circle cx="0" cy="0" r="28" fill="#b45309" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="3,2" />
    <text x="0" y="8" fill="#f59e0b" fontSize="24" textAnchor="middle">★</text>
  </g>

  <g transform="translate(520, 430)">
    <line x1="0" y1="40" x2="180" y2="40" stroke="#475569" strokeWidth="1" />
    <text x="90" y="25" fill="#3b82f6" fontSize="20" fontFamily="cursive, Georgia, serif" textAnchor="middle" fontStyle="italic">Avnish Verma</text>
    <text x="90" y="55" fill="#e2e8f0" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">DR. AVNISH VERMA, PHD</text>
    <text x="90" y="68" fill="#64748b" fontSize="8.5" fontFamily="sans-serif" textAnchor="middle">Director of Research, BioLabs</text>
  </g>

  <line x1="50" y1="525" x2="750" y2="525" stroke="#1e293b" strokeWidth="1" />
  
  <text x="80" y="548" fill="#64748b" fontSize="9" fontFamily="sans-serif" textAnchor="start">ISSUED DATE: ${formattedDate}</text>
  <text x="400" y="548" fill="#64748b" fontSize="8.5" fontFamily="monospace" textAnchor="middle">VERIFICATION HASH: ${hash}</text>
  <text x="720" y="548" fill="#64748b" fontSize="9" fontFamily="sans-serif" textAnchor="end">SYSTEM STATUS: VERIFIED</text>
</svg>
`.trim();

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `healix_biolabs_certificate_${fullName.replace(/\s+/g, "_")}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      // First fetch session info to check authentication
      const userRes = await fetch("/api/auth/session");
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.user) {
          setUser(userData.user);
          
          // Fetch training progress
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

  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / MODULES.length) * 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B13] flex items-center justify-center text-slate-300">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Loading Academy Status...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
        {/* Scientific SVG Animated Canvas */}
        <ScientificBackground />

        {/* Navbar Navigation */}
        <Navbar currentUser={null} />

        <main className="flex-grow pt-28 pb-16 flex items-center justify-center px-4">
          <div className="max-w-md w-full border border-slate-800 bg-[#0B0F19]/90 rounded-2xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-accent-blue to-purple-600" />
            <Award className="w-16 h-16 text-amber-500/80 mx-auto animate-bounce" />
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">Access Research Academy</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                You must initialize your BioLabs credentials or log in to track module progress and earn credentials.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/login?redirect=/training"
                className="w-full block bg-accent-blue hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md"
              >
                Log In to Academy
              </Link>
            </div>
            <Link href="/" className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </main>

        {/* Footer Details */}
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      {/* Scientific SVG Animated Canvas */}
      <ScientificBackground />

      {/* Navbar Navigation */}
      <Navbar currentUser={user} />

      <main className="flex-grow pt-28 pb-16 text-slate-300 relative">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Breadcrumb back navigation */}
        <div className="flex justify-start">
          <Link href="/" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white uppercase tracking-wider font-bold transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Hub</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-900">
          <div className="text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-[10px] font-bold text-accent-blue uppercase tracking-widest mb-3">
              <Award className="w-3 h-3 text-accent-blue" />
              <span>BioLabs Education</span>
            </div>
            <h2 className="text-2xl sm:text-4.5xl font-heading font-extrabold text-slate-100 uppercase leading-none">
              Research Academy
            </h2>
            <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed font-medium">
              Complete our structured curriculum on inquiry paradigms, citation rules, laboratory safety containment, and clinical ethics to unlock your credentials.
            </p>
          </div>
          <Link
            href="/training/verify"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <span>Verify Credential</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </Link>
        </div>

        {/* Dashboard Progress Tracker Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          
          {/* Progress Card */}
          <div className="md:col-span-4 border border-slate-800 bg-[#0B0F19]/60 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between relative shadow-inner">
            <div className="space-y-4 text-left">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Academic Progress</span>
              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-heading font-black text-white">{progressPercent}%</span>
                  <span className="text-xs text-slate-400 font-mono font-bold">{completedCount} of 4 Modules Passed</span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-blue to-teal-500 transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                {progressPercent === 100 
                  ? "Congratulations! You have completed all curriculum modules and are eligible to claim your certificate."
                  : "Study each module slide deck, pass the mandatory checkup quizzes with a score of 100% to qualify for certification."
                }
              </p>
            </div>
            
            {progressPercent === 100 && !certificate && (
              <button
                onClick={handleClaimCertificate}
                disabled={issuingCert}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-amber-500/10 cursor-pointer disabled:opacity-50"
              >
                {issuingCert ? "Generating Certificate..." : "Claim Certificate of Completion"}
              </button>
            )}
          </div>

          {/* Certificate Showcase Card */}
          <div className="md:col-span-8 border border-slate-800 bg-[#0B0F19]/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg min-h-[220px]">
            {certificate ? (
              <div className="flex flex-col h-full">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Info + Actions */}
                <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-900">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Credential — Active</span>
                    </span>
                    <h3 className="text-base font-heading font-extrabold text-white uppercase leading-none">Certificate of Completion</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="px-2.5 py-1 rounded-md border border-slate-800 bg-slate-950 font-mono text-[9px] font-bold text-amber-500 select-all tracking-wider shadow-inner truncate max-w-[220px]">
                        {certificate.certHash}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <Link
                      href={`/training/verify?hash=${certificate.certHash}`}
                      className="px-3.5 py-2.5 rounded-lg border border-slate-800 hover:border-accent-blue/50 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-accent-blue" />
                      <span>Verify</span>
                    </Link>
                    <button
                      onClick={() => downloadCertificateAsPDF(certificate.fullName, certificate.certHash, certificate.issuedAt)}
                      className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto h-full min-h-[220px]">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <Award className="w-7 h-7 text-slate-600" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-heading font-extrabold text-slate-400 uppercase tracking-wider">Credential Showcase Locked</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Complete all 4 training modules and score 100% on their quizzes to unlock your official credential.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {MODULES.map((mod) => {
            const isCompleted = !!progress[mod.index];
            return (
              <div 
                key={mod.index}
                className={`border rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-md transition-all ${
                  isCompleted 
                    ? "border-emerald-500/10 bg-[#0c1a17]/50 shadow-emerald-500/2" 
                    : "border-slate-800 bg-[#0B0F19]/45 hover:border-slate-800"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">Module 0{mod.index + 1}</span>
                    {isCompleted ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-0.5">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>Passed</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[8px] font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-0.5">
                        <Lock className="w-2.5 h-2.5 text-slate-500" />
                        <span>Incomplete</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-heading font-extrabold text-slate-100 uppercase tracking-tight leading-snug">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {mod.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-900/60 pt-4">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>4 Study Slides</span>
                  </span>
                  
                  <button
                    onClick={() => handleStartModule(mod)}
                    className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      isCompleted 
                        ? "border border-emerald-500/20 hover:bg-emerald-950/20 text-emerald-400" 
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    }`}
                  >
                    {isCompleted ? "Review Slides" : "Start Module"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* DETAILED SLIDESHOW VIEW MODAL OVERLAY */}
      {activeModule && (
        <div className="fixed inset-0 z-50 bg-[#070b13]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full border border-slate-800 bg-[#0B0F19] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px] max-h-[90vh]">
            
            {/* Header top bar */}
            <div className="p-4 sm:p-5 border-b border-slate-900/60 flex items-center justify-between">
              <div className="text-left">
                <span className="text-[9px] font-bold text-accent-blue uppercase tracking-widest font-mono">Module 0{activeModule.index + 1} Course Material</span>
                <h3 className="text-sm sm:text-base font-heading font-extrabold text-white uppercase tracking-tight leading-none mt-1">
                  {activeModule.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveModule(null)}
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors"
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
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono block">
                      Slide {activeSlideIdx + 1} of {activeModule.slides.length}
                    </span>
                    <h4 className="text-base sm:text-xl font-heading font-extrabold text-white uppercase tracking-tight leading-snug">
                      {activeModule.slides[activeSlideIdx].title}
                    </h4>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-justify font-medium px-4">
                    {activeModule.slides[activeSlideIdx].content}
                  </p>
                </div>
              ) : (
                /* QUIZ MULTIPLE CHOICE PANEL */
                <div className="space-y-6 max-w-lg mx-auto w-full">
                  <div className="text-center space-y-1">
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono block animate-pulse">Knowledge Verification</span>
                    <h4 className="text-base sm:text-lg font-heading font-extrabold text-white uppercase leading-none">Module 0{activeModule.index + 1} Checkup Quiz</h4>
                  </div>

                  {quizSuccess ? (
                    <div className="p-6 border border-emerald-500/10 bg-emerald-950/20 rounded-xl space-y-4 text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Module Exam Passed!</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Your score has been saved in the registry database. You can proceed to check other modules or claim credentials.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5 text-left w-full">
                      {activeModule.quiz.questions.map((qObj: any, qIdx: number) => (
                        <div key={qIdx} className="space-y-2.5">
                          <p className="text-xs font-bold text-slate-200">
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
                                      ? "border-accent-blue bg-blue-950/25 text-white" 
                                      : "border-slate-800 bg-slate-950/40 hover:border-slate-800 text-slate-400 hover:text-slate-300"
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
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold text-center">
                          {quizError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom slides navigation bar */}
            <div className="p-4 sm:p-5 border-t border-slate-900/60 bg-slate-950/30 flex items-center justify-between">
              {!showQuiz ? (
                <>
                  <button
                    onClick={handlePrevSlide}
                    disabled={activeSlideIdx === 0}
                    className="px-3.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-900 cursor-pointer flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="px-3.5 py-2 rounded-lg bg-accent-blue hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer flex items-center space-x-1 transition-colors"
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
                    className="px-3.5 py-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
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
                      className="px-5 py-2 rounded-lg bg-accent-blue hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wider cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      {submittingQuiz ? "Submitting..." : "Submit Examination"}
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}
      </main>

      <Footer />
    </div>
  );
}
