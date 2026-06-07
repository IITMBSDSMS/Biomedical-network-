"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowLeft, Beaker, Calendar, CheckCircle, Compass, FileText, FolderGit2, GraduationCap, Network, Search, UserCheck, BookOpen, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { HealixUser } from "@/lib/auth";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import NetworkIntelligenceMap from "@/components/home/NetworkIntelligenceMap";
import HeroWaves from "@/components/home/HeroWaves";
import { LinkedinIcon } from "@/components/ui/BrandIcons";

const leadershipSections = [
  {
    title: "Board of Advisors",
    subtitle: "Guiding the scientific and strategic direction of BioLabs.",
    members: [
      {
        id: "sameer-kalra",
        name: "Dr. Sameer Kalra",
        role: "Clinical Advisor & Consultant",
        institution: "Sir Ganga Ram Hospital",
        expertise: ["Clinical Research", "Internal Medicine", "Healthcare Policy"],
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Dr. Sameer Kalra is a senior consultant and clinical advisor at Sir Ganga Ram Hospital, New Delhi, with over two decades of clinical experience. He specializes in health policy, internal medicine, and patient care diagnostics."
      },
      {
        id: "renu-deshmukh",
        name: "Dr. Renu Deshmukh",
        role: "Associate Professor of Biophysics",
        institution: "AIIMS New Delhi",
        expertise: ["Structural Biology", "Bio-Imaging", "Genomics"],
        photo: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Dr. Renu Deshmukh is a biophysics researcher and faculty member at AIIMS New Delhi. Her work focuses on electron microscopy, molecular dynamics, and cell structural integrity."
      },
      {
        id: "k-ramesh",
        name: "Prof. K. Ramesh",
        role: "Professor of Biomedical Engineering",
        institution: "IIT Delhi",
        expertise: ["Tissue Engineering", "Biomaterials", "Microfluidics"],
        photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Prof. K. Ramesh is a senior professor in the Department of Biomedical Engineering at IIT Delhi. He leads research in bio-material design, artificial organs, and lab-on-a-chip technologies."
      },
      {
        id: "aditya-sen",
        name: "Dr. Aditya Sen",
        role: "Chief Scientific Advisor",
        institution: "Healix Technologies",
        expertise: ["Bio-computing", "Molecular Modeling", "Drug Discovery"],
        photo: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Dr. Aditya Sen is an industry scientist and lead advisor at Healix Technologies, bringing deep expertise in computer-aided drug design, high-performance computing, and molecular dynamics simulations."
      }
    ]
  },
  {
    title: "Executive Leadership",
    subtitle: "Executive leaders driving the execution and operations of BioLabs.",
    members: [
      {
        id: "avnish-verma",
        name: "Avnish Verma",
        role: "Founder & CEO",
        institution: "Healix BioLabs / IIT Delhi",
        expertise: ["Bio-Computation", "AI in Healthcare", "System Architecture"],
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Avnish Verma is the Founder & CEO of Healix BioLabs. A researcher at IIT Delhi, he is building decentralized biomedical intelligence networks to bridge the gap between academic theory and clinical trial execution."
      },
      {
        id: "mahima-sharma",
        name: "Mahima Sharma",
        role: "Chief Operating Officer",
        institution: "Healix BioLabs",
        expertise: ["Operations Management", "Research Alliances", "Corporate Growth"],
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Mahima Sharma is the Chief Operating Officer of Healix BioLabs. She oversees operations, strategic institutional partnerships, and platform growth, ensuring clinical networks run efficiently."
      },
      {
        id: "debarghya-bag",
        name: "Debarghya Bag",
        role: "Chief Medical Officer",
        institution: "Healix BioLabs",
        expertise: ["Clinical Trials", "Immunology", "Medical Devices"],
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Debarghya Bag serves as the Chief Medical Officer at Healix BioLabs. He coordinates clinical trial protocols, device certifications, and immunology research pipelines."
      }
    ]
  },
  {
    title: "Research & Innovation Council",
    subtitle: "Driving interdisciplinary research across healthcare, biotechnology, AI, public health, and biomedical engineering.",
    members: [
      {
        id: "swaranjali-sonje",
        name: "Swaranjali Sonje",
        role: "Head of Research & Innovation",
        institution: "Healix BioLabs",
        expertise: ["Biomedical Engineering", "Computational Neuroscience", "Deep Learning"],
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Swaranjali Sonje leads the Research & Innovation Council, specializing in signal processing for brain-computer interfaces, deep learning in diagnostics, and clinical engineering."
      },
      {
        id: "ojas-sah",
        name: "Ojas Sah",
        role: "Computational Biology Lead",
        institution: "Research & Innovation Council",
        expertise: ["Genomics Data Mining", "Structural Proteomics", "Bio-AI Systems"],
        photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Ojas Sah is a computational biologist leading genomic data mining, structural protein folding calculations, and AI-driven biological modeling pipelines."
      },
      {
        id: "bme-team",
        name: "Biomedical Engineering Team",
        role: "Core Engineering Division",
        institution: "Healix BioLabs",
        expertise: ["Sensor Fusion", "Microfluidic Chips", "Wearable Health Tech"],
        photo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "The Biomedical Engineering Team at Healix BioLabs builds hardware and firmware solutions, including multi-channel EEG headsets, microfluidic lab chips, and telemetry sensor nodes."
      },
      {
        id: "vineet-kapoor",
        name: "Dr. Vineet Kapoor",
        role: "Clinical Innovation Lead",
        institution: "Research & Innovation Council",
        expertise: ["Nanomedicine", "Targeted Drug Delivery", "Toxicology"],
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Dr. Vineet Kapoor directs toxicology analysis and nanomaterial synthesis, designing lipid vectors and targeted drug carrier systems."
      }
    ]
  },
  {
    title: "Founding Research Associates",
    subtitle: "Researchers and innovators contributing to the BioLabs mission from day one.",
    members: [
      {
        id: "dhruv-advani",
        name: "Dhruv Advani",
        role: "Founding Research Associate",
        institution: "AIIMS Delhi",
        expertise: ["Clinical Research", "Medical Education", "Healthcare Innovation"],
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Dhruv Advani is a founding research associate based at AIIMS Delhi. He leads clinical education, trials research, and health tech innovations to improve patient outcomes."
      },
      {
        id: "rohan-mehta",
        name: "Rohan Mehta",
        role: "Research Associate",
        institution: "IIT Bombay",
        expertise: ["Orthotics", "Bio-materials", "Finite Element Analysis"],
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Rohan Mehta is a mechanical and biomedical associate at IIT Bombay. He specializes in designing smart orthotics, finite element stress modeling, and biocompatibility assays."
      },
      {
        id: "ananya-sen",
        name: "Ananya Sen",
        role: "Cognitive Science Associate",
        institution: "Delhi University",
        expertise: ["Behavioral Psychology", "Neuropsychology", "Cognitive Modeling"],
        photo: "https://images.unsplash.com/photo-1534751516642-a131ffd103fd?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Ananya Sen is a cognitive science researcher focusing on neuropsychological evaluations, brain-computer haptic integrations, and behavioral psychology."
      },
      {
        id: "join-network",
        name: "Future Associates",
        role: "Join the Network",
        institution: "Healix BioLabs",
        expertise: ["Biostatistics", "Clinical Data", "Scientific Writing"],
        photo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Healix BioLabs is constantly expanding its founding network of research associates. Apply to collaborate on global publications and gain access to computing nodes."
      }
    ]
  },
  {
    title: "Mentors & Academic Experts",
    subtitle: "Empowering students through mentorship, research, and collaboration.",
    members: [
      {
        id: "shalini-mukherji",
        name: "Dr. Shalini Mukherji",
        role: "Principal Scientist",
        institution: "CSIR-IGIB",
        expertise: ["Transcriptomics", "Epigenetics", "Single-Cell Sequencing"],
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Dr. Shalini Mukherji is a senior principal investigator at CSIR-IGIB, mentoring students in high-throughput sequencing analysis, RNA biology, and epigenetic profiling."
      },
      {
        id: "kartik-nair",
        name: "Kartik Nair",
        role: "PhD Candidate & Mentor",
        institution: "IISc Bangalore",
        expertise: ["Quantum Computing", "Biophysics", "Math Modeling"],
        photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Kartik Nair is a doctoral researcher at IISc Bangalore. He conducts research in quantum chemistry simulations, molecular docking models, and biophysical kinetics."
      },
      {
        id: "sandeep-verma",
        name: "Prof. Sandeep Verma",
        role: "Professor of Chemistry",
        institution: "IIT Kanpur",
        expertise: ["Peptide Engineering", "Nucleic Acids", "Bio-Organic Chemistry"],
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Prof. Sandeep Verma is a chemical biology professor at IIT Kanpur, leading research in peptide architecture, bio-inspired materials, and nucleic acid interactions."
      },
      {
        id: "rajeshwari-nair",
        name: "Rajeshwari Nair",
        role: "VP of Bio-pharma R&D",
        institution: "Biocon India",
        expertise: ["Bio-similar Dev", "GMP Protocols", "FDA Filings"],
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Rajeshwari Nair is a biopharmaceutical executive with Biocon India. She mentors student teams on manufacturing regulations, FDA filings, and clinical safety compliance."
      }
    ]
  },
  {
    title: "Mental Health & Human Development Division",
    subtitle: "Pioneering research and advocacy in psychology, cognitive sciences, and human development.",
    members: [
      {
        id: "sudiksha-sharma",
        name: "Sudiksha Sharma",
        role: "Lead Psychologist",
        institution: "Healix BioLabs Division",
        expertise: ["Clinical Psychology", "Cognitive Behavioral", "Adolescent Dev"],
        photo: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Sudiksha Sharma leads clinical psychology research at the Division of Human Development, developing digital therapy frameworks and mental health diagnostic models."
      },
      {
        id: "chaavi-sharma",
        name: "Chaavi Sharma",
        role: "Human Development Specialist",
        institution: "Healix BioLabs Division",
        expertise: ["Neurodevelopment", "Early Intervention", "Behavioral Science"],
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250&h=250",
        linkedin: "https://linkedin.com",
        bio: "Chaavi Sharma is a child psychologist and neurodevelopment specialist. She leads early intervention research and behavioral therapies for students and young adults."
      }
    ]
  }
];

interface LandingClientProps {
  currentUser: HealixUser | null;
  featuredResearchers: any[];
  featuredPublications: any[];
  leadershipMembers?: any[];
}

export default function LandingClient({
  currentUser,
  featuredResearchers,
  featuredPublications,
  leadershipMembers = [],
}: LandingClientProps) {
  
  const dynamicSections = React.useMemo(() => {
    if (!leadershipMembers || leadershipMembers.length === 0) {
      return leadershipSections;
    }

    const sectionsOrder = [
      { title: "Board of Advisors", subtitle: "Guiding the scientific and strategic direction of BioLabs." },
      { title: "Executive Leadership", subtitle: "Executive leaders driving the execution and operations of BioLabs." },
      { title: "Research & Innovation Council", subtitle: "Driving interdisciplinary research across healthcare, biotechnology, AI, public health, and biomedical engineering." },
      { title: "Founding Research Associates", subtitle: "Researchers and innovators contributing to the BioLabs mission from day one." },
      { title: "Mentors & Academic Experts", subtitle: "Empowering students through mentorship, research, and collaboration." },
      { title: "Mental Health & Human Development Division", subtitle: "Pioneering research and advocacy in psychology, cognitive sciences, and human development." },
    ];

    return sectionsOrder.map(sec => {
      const members = leadershipMembers
        .filter(m => m.section.toLowerCase().trim() === sec.title.toLowerCase().trim())
        .map(m => {
          let expertiseTags: string[] = [];
          try {
            if (typeof m.expertise === "string") {
              expertiseTags = JSON.parse(m.expertise);
            } else if (Array.isArray(m.expertise)) {
              expertiseTags = m.expertise;
            }
          } catch (e) {
            console.error("Failed parsing expertise for", m.name, e);
          }
          return {
            ...m,
            expertise: expertiseTags,
          };
        });
      
      return {
        title: sec.title,
        subtitle: sec.subtitle,
        members,
      };
    }).filter(sec => sec.members.length > 0);
  }, [leadershipMembers]);

  const [selectedProfileMember, setSelectedProfileMember] = React.useState<any | null>(null);
  const [activeBookIndex, setActiveBookIndex] = React.useState<number | null>(null);
  const isBookOpen = activeBookIndex !== null;
  const setIsBookOpen = (open: boolean) => {
    if (!open) setActiveBookIndex(null);
  };
  const [activeBookSpread, setActiveBookSpread] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = React.useState(false);

  // CMS-driven video section config
  const [videoConfig, setVideoConfig] = React.useState({
    youtubeUrl: "https://www.youtube.com/embed/815mO_K6Wk8",
    coverImage: "/video_cover.png",
    title: "The Future of Biomedical Research: Healing at the Nano-scale",
    subtitle: "Institutional Keynote",
    duration: "10:24 Mins",
  });

  React.useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(data => {
        if (data?.videoSection) {
          setVideoConfig(prev => ({ ...prev, ...data.videoSection }));
        }
      })
      .catch(() => {});
  }, []);

  const { scrollY } = useScroll();

  // Scroll translations for left column (text and stats)
  const leftY = useTransform(scrollY, [0, 600], [0, -70]);
  const leftOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Scroll translations for right column (3D revolving logo coin)
  const rightY = useTransform(scrollY, [0, 600], [0, -40]);
  const rightRotate = useTransform(scrollY, [0, 600], [0, 15]);
  const rightOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const rightScale = useTransform(scrollY, [0, 600], [1, 0.88]);

  // Parallax for background glowing planets
  const planet1Y = useTransform(scrollY, [0, 600], [0, 120]);
  const planet2Y = useTransform(scrollY, [0, 600], [0, 150]);
  
  // Parallax for background stars / waves
  const starsY = useTransform(scrollY, [0, 600], [0, 60]);

  const turnToPage = (newPage: number) => {
    setDirection(newPage > activeBookSpread ? 1 : -1);
    setActiveBookSpread(newPage);
  };

  const nextPage = () => {
    if (activeBookSpread < 4) {
      setDirection(1);
      setActiveBookSpread(activeBookSpread + 1);
    }
  };

  const prevPage = () => {
    if (activeBookSpread > 1) {
      setDirection(-1);
      setActiveBookSpread(activeBookSpread - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 45 : -45,
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1] as const,
      }
    },
    exit: (direction: number) => ({
      rotateY: direction > 0 ? -45 : 45,
      opacity: 0,
      x: direction > 0 ? -100 : 100,
      transition: {
        duration: 0.45,
        ease: [0.25, 1, 0.5, 1] as const,
      }
    })
  };

  const institutions = [
    { name: "IIT Delhi", src: "/institutes/iit_delhi.svg" },
    { name: "IIT Bombay", src: "/institutes/iit_bombay.svg" },
    { name: "AIIMS Delhi", src: "/institutes/aiims_delhi.png" },
    { name: "IIT Madras", src: "/institutes/iit_madras.svg" },
    { name: "IIT Hyderabad", src: "/institutes/iit_hyderabad.png" },
    { name: "IISc Bangalore", src: "/institutes/iisc_bangalore.svg" },
    { name: "AIIMS Nagpur", src: "/institutes/aiims_nagpur.png" }
  ];

  const marqueeLogos = [
    ...institutions,
    ...institutions,
    ...institutions,
    ...institutions
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  const features = [
    {
      icon: <UserCheck className="w-5 h-5 text-accent-blue" />,
      title: "Verified Profiles",
      description: "Auto-generated research IDs, institutional mapping, and dynamic research score calculations.",
      link: "/researchers",
    },
    {
      icon: <FileText className="w-5 h-5 text-primary-yellow" />,
      title: "Publications Portal",
      description: "Browse literature reviews, white papers, and articles with inline PDF reader views and citation indexing.",
      link: "/publications",
    },
    {
      icon: <FolderGit2 className="w-5 h-5 text-accent-blue" />,
      title: "Project Collaboration",
      description: "Track biological milestones using interactive Kanban boards, Gantt timelines, and dashboard metrics.",
      link: "/projects",
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-primary-yellow" />,
      title: "Fellowship Applications",
      description: "Students apply directly for research fellowships with statement of purpose wizard uploads.",
      link: "/fellowships",
    },
  ];

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      
      {/* HERO SECTION - REDESIGNED DARK THEME WITH BOTTOM SVG GRADIENT WAVES */}
      <section className="relative pt-44 pb-28 md:pt-52 md:pb-36 flex items-center justify-center bg-[#070B13] overflow-hidden border-b border-slate-900/50">
        
        {/* Glowing background planet spheres and particle stars (matching the space planets in the reference image) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Planet 1 - Large dark glowing sphere */}
          <motion.div
            style={{ y: planet1Y }}
            className="absolute top-[15%] left-[10%] w-36 h-36 rounded-full bg-gradient-to-tr from-slate-950 via-[#0C1222] to-[#1E1B4B]/30 opacity-70 blur-[1px] shadow-[inset_0_4px_12px_rgba(255,255,255,0.05),0_12px_48px_rgba(0,0,0,0.8)]"
          />
          {/* Planet 2 - Smaller dark glowing sphere */}
          <motion.div
            style={{ y: planet2Y }}
            className="absolute bottom-[20%] right-[32%] w-24 h-24 rounded-full bg-gradient-to-br from-slate-950 via-[#0B132B] to-[#0F172A]/20 opacity-80 blur-[2px] shadow-[inset_0_2px_8px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.8)]"
          />
          
          {/* Star particles */}
          <motion.div style={{ y: starsY }} className="absolute inset-0 z-0">
            <div className="absolute top-1/4 right-[15%] w-1.5 h-1.5 rounded-full bg-white opacity-40 animate-pulse" />
            <div className="absolute top-1/3 left-[45%] w-1 h-1 rounded-full bg-white opacity-20" />
            <div className="absolute bottom-1/3 left-[15%] w-1 h-1 rounded-full bg-white opacity-30 animate-ping" />
            <div className="absolute top-[60%] right-[40%] w-1.5 h-1.5 rounded-full bg-blue-400 opacity-30 animate-pulse" />
          </motion.div>
        </div>

        {/* Dynamic layered gradient waves at the bottom (matching the wave structure of the reference image) */}
        <div className="absolute bottom-0 left-0 right-0 h-44 md:h-64 z-0 overflow-hidden pointer-events-none">
          <HeroWaves />
        </div>

        <div className="max-w-[1850px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
            
            {/* Left Content Area (7 cols) */}
            <motion.div style={{ y: leftY, opacity: leftOpacity }} className="lg:col-span-7 w-full">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-left space-y-7 flex flex-col items-start w-full"
              >
              {/* Tagline Badge */}
              <motion.div 
                variants={itemVariants} 
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest"
              >
                <Network className="w-3.5 h-3.5 text-accent-blue" />
                <span>Building the Future of Biomedical Intelligence</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-5xl sm:text-6xl md:text-7xl font-heading font-extrabold tracking-tight leading-[1.05] text-white text-left"
              >
                India&apos;s Biomedical <br />
                <span className="relative inline-block mt-2.5 pb-2.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent font-heading font-extrabold">
                  Research Network
                  {/* Glowing underline accent representing the line in the reference */}
                  <span className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.4)]" />
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base text-slate-400 max-w-xl text-left leading-relaxed pt-2"
              >
                Connecting Researchers, Innovators, Students and Institutions Through One Unified Platform.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-4 w-full sm:w-auto"
              >
                <Link
                  href={currentUser ? "/projects" : "/login"}
                  className="w-full sm:w-auto bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-widest px-10 py-4 rounded-full border border-slate-800 transition-all flex items-center justify-center space-x-2.5 shadow-xl shadow-black/40 group hover:scale-102 hover:border-slate-700"
                >
                  <span>{currentUser ? "Go to My Projects" : "Boost Now"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/opportunities"
                  className="w-full sm:w-auto text-xs font-bold uppercase tracking-widest px-6 py-4 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:border-accent-blue transition-all flex items-center justify-center space-x-2"
                >
                  <Compass className="w-3.5 h-3.5 text-accent-blue" />
                  <span>Browse Opportunities</span>
                </Link>
              </motion.div>

              {/* Statistics Counters */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-900 mt-14 w-full"
              >
                <div className="flex flex-col items-start">
                  <span className="text-2xl md:text-3xl font-extrabold font-heading text-white flex items-center">
                    <AnimatedCounter value={1250} suffix="+" />
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Researchers</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-2xl md:text-3xl font-extrabold font-heading text-white flex items-center">
                    <AnimatedCounter value={4850} suffix="+" />
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Publications</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-2xl md:text-3xl font-extrabold font-heading text-white flex items-center">
                    <AnimatedCounter value={340} suffix="+" />
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Projects</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-2xl md:text-3xl font-extrabold font-heading text-white flex items-center">
                    <AnimatedCounter value={45} suffix="+" />
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Institutions</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Revolving Logo (5 cols) */}
            <motion.div
              style={{ y: rightY, opacity: rightOpacity, scale: rightScale, rotate: rightRotate, perspective: 1500 }}
              className="lg:col-span-5 flex justify-center lg:justify-end w-full"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 60, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                className="w-full flex justify-center lg:justify-end"
              >
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 16,
                    ease: "linear"
                  }}
                  className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:shadow-accent-blue/15 transition-shadow duration-300 group cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Front Face of the Coin (Dark Glassmorphism) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 p-6 flex items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "translateZ(1.5px)"
                    }}
                  >
                    {/* Embedded soft pulsing background radial glow to feel premium */}
                    <div className="absolute inset-4 rounded-full bg-radial from-slate-900 to-transparent -z-10 group-hover:from-blue-900/10 transition-all duration-500" />
                    <img
                      src="/logo.png"
                      alt="Healix BioLabs Official Logo Front"
                      className="w-full h-full rounded-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] select-none"
                    />
                  </div>

                  {/* Back Face of the Coin (Dark Glassmorphism, Rotated 180 degrees so it renders right side up when turned around) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 p-6 flex items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg) translateZ(1.5px)"
                    }}
                  >
                    <div className="absolute inset-4 rounded-full bg-radial from-slate-900 to-transparent -z-10 group-hover:from-blue-900/10 transition-all duration-500" />
                    <img
                      src="/logo.png"
                      alt="Healix BioLabs Official Logo Back"
                      className="w-full h-full rounded-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] select-none"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES GRID */}
      <section className="py-20 bg-[#0B0F19]/50 border-b border-slate-900">
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-[10px] uppercase tracking-widest font-bold text-accent-blue mb-2.5">Core Modules</h2>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              Ecosystem Platform Overview
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-lg mx-auto leading-relaxed">
              We help professors, scientists, and students collaborate for innovative research projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#0B0F19] border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-200 group flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/60 flex items-center justify-center border border-slate-800 group-hover:bg-slate-800 transition-colors">
                    {f.icon}
                  </div>
                  <h4 className="text-sm font-bold font-heading text-white">{f.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
                </div>
                <Link
                  href={f.link}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-accent-blue hover:text-white transition-colors mt-6 pt-4 border-t border-slate-800"
                >
                  <span>Enter portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED RESEARCHERS & PUBLICATIONS */}
      <section className="py-20 max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Featured Researchers */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold font-heading text-white flex items-center space-x-2">
                <Beaker className="w-5 h-5 text-accent-blue" />
                <span>Featured Researchers</span>
              </h3>
              <p className="text-xs text-slate-400">Discover verified profiles and scores across the network.</p>
            </div>

            <div className="space-y-4">
              {featuredResearchers.map((res) => (
                <div
                  key={res.id}
                  className="bg-[#0B0F19] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex items-start space-x-4 shadow-sm"
                >
                  <img
                    src={res.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${res.fullName}`}
                    alt={res.fullName}
                    className="w-11 h-11 rounded-lg object-cover bg-slate-900 border border-slate-800"
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                        <span>{res.fullName}</span>
                        {res.isVerified && (
                          <CheckCircle className="w-3.5 h-3.5 text-accent-blue fill-blue-950/20" />
                        )}
                      </h4>
                      <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-950/20 border border-amber-900/50 rounded">
                        Score {res.researchScore.toFixed(1)}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">{res.institutionName}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{res.bio}</p>
                    
                    <div className="pt-2">
                      <Link
                        href={`/researcher/${res.slug}`}
                        className="text-xs text-accent-blue hover:text-white font-bold inline-flex items-center space-x-0.5"
                      >
                        <span>View profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Publications */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold font-heading text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-primary-yellow" />
                <span>Featured Publications</span>
              </h3>
              <p className="text-xs text-slate-400">Read indexed white papers and literature reviews.</p>
            </div>

            <div className="space-y-4">
              {featuredPublications.map((pub) => (
                <div
                  key={pub.id}
                  className="bg-[#0B0F19] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-2">
                    <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase bg-blue-950/20 text-accent-blue border border-blue-900/30 tracking-wider">
                      {pub.category.replace("_", " ")}
                    </span>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{pub.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{pub.abstract}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400">
                      Author: <span className="font-bold text-slate-300">{pub.researcher.fullName}</span>
                    </span>
                    <Link
                      href={`/publications/${pub.id}`}
                      className="text-xs text-accent-blue hover:text-white font-bold inline-flex items-center space-x-0.5"
                    >
                      <span>Read paper</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* NETWORK INTELLIGENCE MAP */}
      <NetworkIntelligenceMap />

      {/* EVENT POSTERS & SCIENTIFIC WORKS GALLERY PREVIEW */}
      <section className="py-20 bg-[#0B0F19]/30 border-b border-slate-900">
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <h2 className="text-[10px] uppercase tracking-widest font-bold text-accent-blue mb-2.5">Visual Showcase</h2>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-research-blue">
                Event Posters & Scientific Works
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-lg leading-relaxed">
                Explore high-resolution summaries of our symposia, research poster announcements, and core molecular achievements.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Poster 1 */}
            <Link 
              href="/gallery"
              className="group bg-[#0B0F19] border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 border-b border-slate-900">
                <img
                  src="/event_summit_2026.png"
                  alt="Healix Biotech Summit 2026"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-brand-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-white/10">
                  Events
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold font-heading text-slate-100 leading-snug group-hover:text-accent-blue transition-colors">
                    Healix Biotech Summit 2026
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    Annual summit showcasing cutting-edge breakthroughs in CRISPR, precision medicine, and neurobiotechnology.
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-semibold pt-4 border-t border-slate-900">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>October 14-16, 2026</span>
                </div>
              </div>
            </Link>

            {/* Poster 2 */}
            <Link 
              href="/gallery"
              className="group bg-[#0B0F19] border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 border-b border-slate-900">
                <img
                  src="/research_genomics.png"
                  alt="Advanced Genomic Sequencing"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-brand-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-white/10">
                  Research Posters
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold font-heading text-slate-100 leading-snug group-hover:text-accent-blue transition-colors">
                    Advanced Genomic Sequencing & CRISPR
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    Academic poster highlighting CRISPR-Cas9 editing efficiency, HITI-mediated integration, and off-target assessment pipelines.
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-semibold pt-4 border-t border-slate-900">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>May 12, 2026</span>
                </div>
              </div>
            </Link>

            {/* Poster 3 */}
            <Link 
              href="/gallery"
              className="group bg-[#0B0F19] border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 border-b border-slate-900">
                <img
                  src="/event_symposium.png"
                  alt="AI in Medicine Symposium"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-brand-white text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border border-white/10">
                  Events
                </span>
              </div>
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold font-heading text-slate-100 leading-snug group-hover:text-accent-blue transition-colors">
                    AI in Medicine Symposium
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    International symposium exploring neural network integrations in diagnostics, predictive analytics, and treatments.
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-semibold pt-4 border-t border-slate-900">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>October 25-26, 2024</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* OUR LEADERSHIP & RESEARCH NETWORK SECTION */}
      <section className="py-24 bg-[#0B0F19]/10 border-b border-slate-900 relative z-10">
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Network className="w-3.5 h-3.5 text-accent-blue animate-pulse" />
              <span>BioLabs Leadership Network</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight uppercase">
              Our Leadership & Research Network
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              Meet the distinguished board, executives, research councils, and associates driving the frontiers of biotechnology, AI, and healthcare innovation.
            </p>
          </div>

          {/* Subsections Loop */}
          {dynamicSections.map((section) => (
            <div key={section.title} className="pt-20 pb-4 first:pt-0">
              
              {/* Subsection Header */}
              <div className="text-left mb-12 max-w-3xl border-l-2 border-accent-blue pl-4">
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white uppercase tracking-tight">
                  {section.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium italic">
                  {section.subtitle}
                </p>
              </div>

              {/* Members Grid with Staggered Scroll-Into-View Animation */}
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.06
                    }
                  }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className={`grid grid-cols-1 ${
                  section.members.length === 1
                    ? "sm:grid-cols-1 max-w-sm mx-auto"
                    : section.members.length === 2
                    ? "sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto"
                    : section.members.length === 3
                    ? "sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
                    : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                } gap-6`}
              >
                {section.members.map((member) => (
                  <motion.div
                    key={member.id}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 14 } }
                    }}
                    className="group relative rounded-3xl bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800/80 hover:border-slate-700/80 p-5 shadow-xl flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent-blue/5"
                  >
                    {/* Radial Background Glow on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/[0.04] to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Glowing outer margin outline on Hover */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-accent-blue/20 via-blue-500/10 to-indigo-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-xs transition-opacity duration-500 pointer-events-none" />

                    {/* Top Content */}
                    <div className="space-y-4 relative z-10">
                      {/* Photo Frame */}
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 shadow-md">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                        />
                        {/* Gradient Shadow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-85" />
                        
                        {/* LinkedIn icon overlay */}
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-lg bg-slate-950/80 backdrop-blur-xs border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#0077B5] hover:bg-[#0077B5] transition-all shadow-md"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <LinkedinIcon className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Header Info */}
                      <div className="space-y-1 text-left">
                        <h4 className="text-sm font-extrabold text-slate-100 group-hover:text-accent-blue transition-colors duration-300">
                          {member.name}
                        </h4>
                        <p className="text-[10px] text-accent-blue font-bold uppercase tracking-wider leading-tight">
                          {member.role}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold leading-tight">
                          {member.institution}
                        </p>
                      </div>

                      {/* Expertise Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {member.expertise.map((tag: string) => (
                          <span
                            key={tag}
                            className="text-[8px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-800/80 tracking-wide font-mono uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-5 border-t border-slate-900/60 mt-5 relative z-10">
                      <button
                        onClick={() => setSelectedProfileMember(member)}
                        className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 shadow-inner cursor-pointer"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </motion.div>
                ))}
              </motion.div>

            </div>
          ))}

        </div>
      </section>

      {/* RESEARCH WHITE PAPERS & PUBLICATIONS SHOWCASE */}
      <section className="py-24 bg-[#0B0F19]/25 border-b border-slate-900 relative z-10">
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-[10px] font-bold text-accent-blue uppercase tracking-widest mb-3">
                <FileText className="w-3 h-3 text-accent-blue" />
                <span>Publications & Literature</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-heading font-extrabold text-research-blue">
                Scientific White Papers & Research
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
                Browse our institutional white papers, clinical trial results, and literature frameworks structured for biomedical intelligence.
              </p>
            </div>
            <Link
              href="/publications"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all shadow-sm shrink-0"
            >
              <span>View Publications Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive 3D Book Showcase */}
          <div className="flex flex-col items-center justify-center mt-8 w-full">
            
            {/* Quick-Jump Navigation Tabs (Only visible when book is open) */}
            {isBookOpen && activeBookIndex !== null && (
              <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-900/60 p-2 rounded-2xl border border-slate-800 backdrop-blur-xs max-w-2xl">
                <button
                  onClick={() => setIsBookOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-1 hover:bg-slate-800 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Close Book</span>
                </button>
                <div className="w-[1px] bg-slate-800 my-1 self-stretch" />
                {(activeBookIndex === 0 ? [
                  { label: "CRISPR Editing", page: 1 },
                  { label: "Sequence Metrics", page: 2 },
                  { label: "Delivery Vectors", page: 3 },
                  { label: "Clinical Progress", page: 4 },
                ] : activeBookIndex === 1 ? [
                  { label: "Neural Decoders", page: 1 },
                  { label: "CSP Pattern Data", page: 2 },
                  { label: "Haptic Feedback", page: 3 },
                  { label: "Cortical BCI", page: 4 },
                ] : [
                  { label: "mRNA Platforms", page: 1 },
                  { label: "LNP Formulation", page: 2 },
                  { label: "Titer Responses", page: 3 },
                  { label: "Cancer Vaccines", page: 4 },
                ]).map((tab) => (
                  <button
                    key={tab.page}
                    onClick={() => turnToPage(tab.page)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      activeBookSpread === tab.page
                        ? activeBookIndex === 0
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/10"
                          : activeBookIndex === 1
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                          : "bg-amber-600 text-white shadow-md shadow-amber-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Book 3D Stage */}
            <div className="w-full flex items-center justify-center min-h-[500px]" style={{ perspective: 2200 }}>
              
              {!isBookOpen ? (
                /* CLOSED BOOK 3D VIEW (3 Books Shelf) */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 justify-items-center max-w-6xl mx-auto w-full px-4 md:px-0">
                  {[
                    {
                      index: 0,
                      vol: "VOL. I",
                      title1: "Genomics",
                      title2: "& CRISPR",
                      desc: "Deep sequencing, target optimization, and therapeutic editing of genomic networks.",
                      themeColor: "text-emerald-400",
                      glowBg: "from-[#0c1c18] via-[#102d26] to-[#071310]",
                      spineBorder: "border-emerald-500/20",
                      goldFrame: "border-emerald-500/30",
                      badgeColor: "text-emerald-400 border-emerald-500/40",
                      badgeHover: "bg-emerald-950/20",
                      hoverGlow: "rgba(16,185,129,0.25)"
                    },
                    {
                      index: 1,
                      vol: "VOL. II",
                      title1: "Neural",
                      title2: "Prosthetics",
                      desc: "Decoders, haptics, and interface modeling for robotic and biological pathways.",
                      themeColor: "text-blue-400",
                      glowBg: "from-[#0a152d] via-[#111f3f] to-[#060c1c]",
                      spineBorder: "border-blue-500/20",
                      goldFrame: "border-blue-500/30",
                      badgeColor: "text-blue-400 border-blue-500/40",
                      badgeHover: "bg-blue-950/20",
                      hoverGlow: "rgba(59,130,246,0.25)"
                    },
                    {
                      index: 2,
                      vol: "VOL. III",
                      title1: "mRNA",
                      title2: "& Vaccine",
                      desc: "Lipid nanoparticle delivery, immunological profiling, and multi-valent therapeutics.",
                      themeColor: "text-amber-400",
                      glowBg: "from-[#24130b] via-[#331c10] to-[#140b06]",
                      spineBorder: "border-amber-500/20",
                      goldFrame: "border-amber-500/30",
                      badgeColor: "text-amber-400 border-amber-500/40",
                      badgeHover: "bg-amber-950/20",
                      hoverGlow: "rgba(245,158,11,0.25)"
                    }
                  ].map((book) => (
                    <motion.div
                      key={book.index}
                      onClick={() => {
                        setActiveBookIndex(book.index);
                        setActiveBookSpread(1);
                      }}
                      whileHover={{ 
                        rotateY: -15, 
                        rotateX: 8, 
                        rotateZ: -1,
                        scale: 1.05,
                        boxShadow: `0 30px 60px ${book.hoverGlow}`
                      }}
                      initial={{ rotateY: -22, rotateX: 12, rotateZ: -2 }}
                      animate={{ rotateY: -22, rotateX: 12, rotateZ: -2 }}
                      transition={{ type: "spring", stiffness: 90, damping: 15 }}
                      className={`relative w-[280px] sm:w-[300px] md:w-[240px] lg:w-[285px] aspect-[1/1.4] bg-gradient-to-br ${book.glowBg} ${book.themeColor} rounded-r-2xl shadow-[10px_20px_50px_rgba(0,0,0,0.6)] border border-slate-900/80 select-none cursor-pointer flex flex-col justify-between overflow-hidden group transform-gpu origin-left`}
                    >
                      {/* Page stack simulation (edges visible under cover) */}
                      <div className="absolute right-0 inset-y-0 w-2 bg-gradient-to-r from-slate-200 to-slate-100 border-l border-slate-300 rounded-r-xs opacity-90 shadow-[inset_1px_0_3px_rgba(0,0,0,0.2)]" />
                      <div className="absolute right-[2px] inset-y-0 w-[3px] bg-white opacity-85" />
                      
                      {/* Spine bind effect */}
                      <div className={`absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black/80 via-black/40 to-transparent border-r ${book.spineBorder} shadow-[inset_2px_0_5px_rgba(0,0,0,0.5)]`} />
                      <div className="absolute left-[18px] inset-y-0 w-[1px] bg-white/5" />

                      {/* Shading/Lighting highlight */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none" />

                      {/* Header */}
                      <div className="pt-8 px-6 text-center space-y-1">
                        <span className="text-[8px] font-black uppercase tracking-[0.25em] text-slate-400 block font-heading">HEALIX BIOLABS</span>
                        <div className="w-8 h-[1px] bg-white/10 mx-auto" />
                      </div>

                      {/* Frame inside cover */}
                      <div className="absolute inset-3 rounded-xl border border-white/5 pointer-events-none" />

                      {/* Gold foil stamp frame */}
                      <div className={`mx-6 p-4 sm:p-5 border-2 border-double ${book.goldFrame} rounded-xl my-auto text-center space-y-3 bg-slate-950/20 backdrop-blur-xs relative z-10 shadow-inner`}>
                        <h4 className="text-xl sm:text-2xl font-heading font-extrabold tracking-tight leading-none uppercase select-none">
                          {book.title1}<br />
                          {book.title2}
                        </h4>
                        <p className="text-[9px] text-slate-400 font-serif leading-relaxed italic max-w-[180px] mx-auto select-none">
                          {book.desc}
                        </p>
                      </div>

                      {/* Footer details */}
                      <div className="pb-6 px-6 flex items-end justify-between border-t border-slate-900/60 pt-4 relative z-10">
                        <div className="text-[7px] text-slate-500 space-y-0.5 leading-tight font-bold select-none text-left">
                          <p>PUBLISHED BY</p>
                          <p className="text-slate-300">HEALIX BIO-NETWORKS</p>
                          <p>DISTRIBUTION: OPEN ACCESS</p>
                        </div>
                        <span className="text-sm font-heading font-black tracking-tighter select-none">{book.vol}</span>
                      </div>

                      {/* Realistic "Click to Open" hovering badge */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 backdrop-blur-xs">
                        <div className={`px-4 py-2 rounded-lg border ${book.badgeColor} bg-[#0b0f19]/95 font-bold text-[10px] uppercase tracking-wider shadow-xl flex items-center space-x-1.5`}>
                          <BookOpen className="w-3.5 h-3.5 animate-pulse" />
                          <span>Open Volume</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* OPEN BOOK SPREAD */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, rotateX: 5 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative w-full max-w-[880px] aspect-[1.5/1] md:aspect-[1.55/1] bg-[#FCFBF9] text-slate-800 rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6),inset_0_0_40px_rgba(0,0,0,0.05)] border border-slate-200 flex flex-row overflow-hidden"
                >
                  {/* Book spine divider in the absolute center */}
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] bg-slate-300/80 z-20 pointer-events-none" />
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-black/15 via-transparent to-black/15 z-20 pointer-events-none" />

                  {/* Left and Right navigation button zones (simulating clicking page margins) */}
                  <button
                    onClick={prevPage}
                    disabled={activeBookSpread === 1}
                    className={`absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-black/5 to-transparent hover:from-black/10 z-20 flex items-center justify-center group transition-all cursor-pointer ${
                      activeBookSpread === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-slate-200 flex items-center justify-center shadow-md transform -translate-x-2 group-hover:translate-x-0 transition-transform">
                      <ChevronLeft className="w-4 h-4 text-slate-700" />
                    </div>
                  </button>

                  <button
                    onClick={nextPage}
                    disabled={activeBookSpread === 4}
                    className={`absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-black/5 to-transparent hover:from-black/10 z-20 flex items-center justify-center group transition-all cursor-pointer ${
                      activeBookSpread === 4 ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-slate-200 flex items-center justify-center shadow-md transform translate-x-2 group-hover:translate-x-0 transition-transform">
                      <ChevronRight className="w-4 h-4 text-slate-700" />
                    </div>
                  </button>

                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={`${activeBookIndex}-${activeBookSpread}`}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="w-full h-full flex flex-row"
                    >
                      {activeBookSpread === 1 && (
                        /* SPREAD 1 */
                        <>
                          {/* Left Page (Page 02) */}
                          <div className="w-1/2 p-7 md:p-9 pr-10 md:pr-12 bg-[#FAF8F5] border-r border-slate-200/50 flex flex-col justify-between relative select-text">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 pb-1.5 font-mono">
                                <span>{activeBookIndex === 0 ? "Welcome & Scope" : activeBookIndex === 1 ? "Neural Systems" : "mRNA Systems"}</span>
                                <span>Healix Bio-Networks</span>
                              </div>
                              <h4 className="text-lg md:text-xl font-heading font-black tracking-tight text-slate-900 uppercase font-serif mt-2 leading-tight">
                                {activeBookIndex === 0 ? "CRISPR Gene Editing Silencing" : activeBookIndex === 1 ? "Non-Invasive Neural Prosthetics" : "mRNA Vaccine Delivery Systems"}
                              </h4>
                              <div className="w-8 h-0.5 bg-accent-blue" />
                              <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-medium text-justify font-serif pt-1">
                                <span className="text-3xl font-bold float-left mr-1.5 mt-1 font-serif text-slate-800 leading-none">
                                  {activeBookIndex === 0 ? "D" : activeBookIndex === 1 ? "A" : "O"}
                                </span>
                                {activeBookIndex === 0 
                                  ? "emonstrating site-specific knockdown of PCSK9 using lipid nanoparticle-delivered CRISPR components, showing a 78% reduction in extracellular levels."
                                  : activeBookIndex === 1
                                  ? " survey analyzing EEG and EMG decoding models to optimize robotic limb manipulation with closed-loop tactile feedback."
                                  : "ptimizing nucleoside-modified messenger RNA therapeutics for cellular antigen presentation and immune response induction."
                                }
                              </p>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-serif text-justify pt-1">
                                {activeBookIndex === 0 
                                  ? "This volume outlines therapeutic targeted delivery vectors designed to inhibit PCSK9 protein expression. Our trials demonstrate substantial liver enrichment with negligible hepatocyte cytopathy."
                                  : activeBookIndex === 1
                                  ? "By utilizing high-density surface EMG sensors in conjunction with multi-channel EEG headsets, we reconstruct continuous arm-reaching kinematics with real-time feedback."
                                  : "This volume outlines the engineering of non-immunogenic mRNA sequences and their delivery via proprietary lipid nanoparticle formulations, yielding high translation expression."
                                }
                              </p>
                            </div>
                            <div className="flex items-end justify-between border-t border-slate-200 pt-3">
                              <div className="text-[9px] text-slate-500 font-serif leading-tight">
                                <p>Lead Investigator:</p>
                                <p className="font-bold text-slate-700">
                                  {activeBookIndex === 0 ? "Dr. Priya Sharma" : activeBookIndex === 1 ? "Dr. Avnish Verma" : "Dr. Rajesh Iyer"}
                                </p>
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono">Page 02</span>
                            </div>
                          </div>

                          {/* Right Page (Page 03) */}
                          <div className="w-1/2 p-7 md:p-9 pl-10 md:pl-12 bg-[#FCFBF9] flex flex-col justify-between relative select-text">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 pb-1.5 font-mono">
                                <span>{activeBookIndex === 0 ? "Section 1.1" : activeBookIndex === 1 ? "Section 2.1" : "Section 3.1"}</span>
                                <span>{activeBookIndex === 0 ? "Genomics Portal" : activeBookIndex === 1 ? "Neural Systems" : "mRNA Transfection"}</span>
                              </div>
                              <span className="text-[9px] font-bold text-accent-blue tracking-widest uppercase block font-mono">
                                {activeBookIndex === 0 ? "1.1 Sequence Targeting & Transfection" : activeBookIndex === 1 ? "2.1 Signal Processing & Decoders" : "3.1 Formulation Kinetics"}
                              </span>
                              
                              {/* Conditionally rendered graphics */}
                              {activeBookIndex === 0 ? (
                                <div className="h-28 w-full border border-slate-200 bg-slate-50/50 rounded-lg flex items-center justify-center relative overflow-hidden my-3 shadow-inner">
                                  <svg className="w-4/5 h-20" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M 10 40 C 30 10, 50 10, 70 40 C 90 70, 110 70, 130 40 C 150 10, 170 10, 190 40" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M 10 40 C 30 70, 50 70, 70 40 C 90 10, 110 10, 130 40 C 150 70, 170 70, 190 40" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
                                    <line x1="30" y1="23" x2="30" y2="57" stroke="#34d399" strokeWidth="1" strokeDasharray="2,2" />
                                    <line x1="50" y1="23" x2="50" y2="57" stroke="#34d399" strokeWidth="1" strokeDasharray="2,2" />
                                    <line x1="70" y1="40" x2="70" y2="40" stroke="#34d399" strokeWidth="1" strokeDasharray="2,2" />
                                    <line x1="90" y1="23" x2="90" y2="57" stroke="#34d399" strokeWidth="1" strokeDasharray="2,2" />
                                    <line x1="110" y1="23" x2="110" y2="57" stroke="#34d399" strokeWidth="1" strokeDasharray="2,2" />
                                    <line x1="130" y1="40" x2="130" y2="40" stroke="#34d399" strokeWidth="1" strokeDasharray="2,2" />
                                    <line x1="150" y1="23" x2="150" y2="57" stroke="#34d399" strokeWidth="1" strokeDasharray="2,2" />
                                    <line x1="170" y1="23" x2="170" y2="57" stroke="#34d399" strokeWidth="1" strokeDasharray="2,2" />
                                  </svg>
                                  <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-mono font-bold">Fig 1.1: gRNA Double Helix Alignment</span>
                                </div>
                              ) : activeBookIndex === 1 ? (
                                <div className="h-28 w-full border border-slate-200 bg-slate-50/50 rounded-lg flex items-center justify-center relative overflow-hidden my-3 shadow-inner">
                                  <svg className="w-4/5 h-20" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M 10 40 Q 20 20, 30 50 T 50 30 T 70 60 T 90 20 T 110 50 T 130 35 T 150 45 T 170 30 T 190 40" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M 10 45 Q 25 35, 40 55 T 70 35 T 100 45 T 130 55 T 160 35 T 190 45" stroke="#1d4ed8" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
                                    <line x1="10" y1="25" x2="190" y2="25" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3,3" />
                                    <line x1="90" y1="20" x2="90" y2="60" stroke="#3b82f6" strokeWidth="1" strokeDasharray="1,1" />
                                    <circle cx="90" cy="20" r="3" fill="#3b82f6" />
                                  </svg>
                                  <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-mono font-bold">Fig 2.1: EEG Waveform Amplitude Spike</span>
                                </div>
                              ) : (
                                <div className="h-28 w-full border border-slate-200 bg-slate-50/50 rounded-lg flex items-center justify-center relative overflow-hidden my-3 shadow-inner">
                                  <svg className="w-4/5 h-20" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M 60 55 C 60 30, 140 30, 140 55 Z" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
                                    <path d="M 70 55 C 70 45, 130 45, 130 55 Z" fill="#d97706" fillOpacity="0.1" />
                                    <path d="M 20 55 L 180 55" stroke="#d97706" strokeWidth="2.5" />
                                    <line x1="40" y1="55" x2="40" y2="48" stroke="#b45309" strokeWidth="1.5" />
                                    <line x1="60" y1="55" x2="60" y2="48" stroke="#b45309" strokeWidth="1.5" />
                                    <line x1="80" y1="55" x2="80" y2="48" stroke="#b45309" strokeWidth="1.5" />
                                    <line x1="100" y1="55" x2="100" y2="48" stroke="#b45309" strokeWidth="1.5" />
                                    <line x1="120" y1="55" x2="120" y2="48" stroke="#b45309" strokeWidth="1.5" />
                                    <line x1="140" y1="55" x2="140" y2="48" stroke="#b45309" strokeWidth="1.5" />
                                    <line x1="160" y1="55" x2="160" y2="48" stroke="#b45309" strokeWidth="1.5" />
                                    <path d="M 100 48 L 100 35 L 110 25" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="100" cy="35" r="3" fill="#f59e0b" />
                                    <circle cx="110" cy="25" r="3.5" fill="#d97706" />
                                  </svg>
                                  <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-mono font-bold">Fig 3.1: Ribosomal mRNA Loading loop</span>
                                </div>
                              )}
                              
                              <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed font-serif text-justify">
                                {activeBookIndex === 0 
                                  ? "We achieved high-accuracy alignment at exon 4 of the PCSK9 gene. Off-target analysis indicates negligible cleavage events in key homologous chromosomal sites."
                                  : activeBookIndex === 1
                                  ? "We achieved high classification accuracy in motor imagery tasks by combining Riemannian geometry classifiers with deep convolutional neural networks."
                                  : "We evaluated cell-specific uptake and ribosomal loading of mRNA. In vitro bioluminescence imaging shows robust dose-dependent protein expression profiles."
                                }
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <Link
                                href="/publications"
                                className="text-xs text-accent-blue hover:text-blue-700 font-bold inline-flex items-center space-x-0.5 hover:underline font-mono"
                              >
                                <span>Read Abstract</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                              <span className="text-[9px] text-slate-400 font-mono">Page 03</span>
                            </div>
                          </div>
                        </>
                      )}

                      {activeBookSpread === 2 && (
                        /* SPREAD 2 */
                        <>
                          {/* Left Page (Page 04) */}
                          <div className="w-1/2 p-7 md:p-9 pr-10 md:pr-12 bg-[#FAF8F5] border-r border-slate-200/50 flex flex-col justify-between relative select-text">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 pb-1.5 font-mono">
                                <span>Scientific Metrics</span>
                                <span>Healix Bio-Networks</span>
                              </div>
                              <h4 className="text-lg md:text-xl font-heading font-black tracking-tight text-slate-900 uppercase font-serif mt-2 leading-tight">
                                {activeBookIndex === 0 ? "Sequence Accuracy & Off-Targets" : activeBookIndex === 1 ? "CSP Filter & Spatial Patterns" : "LNP Formulation Engineering"}
                              </h4>
                              <div className="w-8 h-0.5 bg-accent-blue" />
                              <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-medium text-justify font-serif pt-1">
                                {activeBookIndex === 0 
                                  ? "Analysis of editing efficacy, off-target occurrence rates, and classifier prediction thresholds across 1,200 biological assays."
                                  : activeBookIndex === 1
                                  ? "Evaluating decoder latency, spatial filter selectivity, and classification accuracy across different electrode density placements."
                                  : "Optimizing lipid ratios (ionizable lipid, cholesterol, DSPC, PEG-lipid) to ensure nanoparticle stability and cell fusion."
                                }
                              </p>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-serif text-justify pt-1">
                                {activeBookIndex === 0 
                                  ? "Measurements indicate a clear logarithmic efficiency increase in proportion to guide concentration levels, with classification scores showing stable target-recognition parameters."
                                  : activeBookIndex === 1
                                  ? "Spatial filtering via Common Spatial Patterns (CSP) isolates band-power differences in alpha and beta rhythms, yielding clear target classification separation."
                                  : "Measurements show that a helper-lipid ratio of 38.5% cholesterol and 10% DSPC maximizes structural integrity while facilitating endosomal escape in target cells."
                                }
                              </p>
                            </div>
                            <div className="flex items-end justify-between border-t border-slate-200 pt-3">
                              <div className="text-[8px] text-slate-400 font-serif leading-tight">
                                <p>Report Section II:</p>
                                <p className="font-bold text-slate-500">
                                  {activeBookIndex === 0 ? "Quantitative Bio-Metrics" : activeBookIndex === 1 ? "Biomedical Signal Analytics" : "Biophysical Characterization"}
                                </p>
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono">Page 04</span>
                            </div>
                          </div>

                          {/* Right Page (Page 05) */}
                          <div className="w-1/2 p-7 md:p-9 pl-10 md:pl-12 bg-[#FCFBF9] flex flex-col justify-between relative select-text">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 pb-1.5 font-mono">
                                <span>Data Matrix</span>
                                <span>Trial Group {activeBookIndex === 0 ? "A" : activeBookIndex === 1 ? "B" : "C"}</span>
                              </div>
                              
                              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono text-center">
                                {activeBookIndex === 0 
                                  ? "Table 1.1: Genomic Outturn Evaluation" 
                                  : activeBookIndex === 1 
                                  ? "Table 2.1: Decoder Latency & Noise" 
                                  : "Table 3.1: LNP Physicochemical Properties"
                                }
                              </span>
                              
                              {/* Classic LaTeX Style Scientific Data Table */}
                              <div className="pt-2">
                                <table className="w-full text-left text-slate-800 text-[10px] md:text-[11px] font-serif border-t-2 border-b-2 border-slate-900">
                                  <thead>
                                    <tr className="border-b border-slate-500 font-bold">
                                      <th className="py-2 text-slate-900 pl-1 font-serif">
                                        {activeBookIndex === 0 ? "Assessment Metric" : activeBookIndex === 1 ? "Decoder Protocol" : "LNP Parameter"}
                                      </th>
                                      <th className="py-2 text-right text-slate-900 font-serif">
                                        {activeBookIndex === 0 ? "Observed" : activeBookIndex === 1 ? "Latency" : "Target Range"}
                                      </th>
                                      <th className="py-2 text-right text-slate-900 pr-1 font-serif">
                                        {activeBookIndex === 0 ? "Control" : activeBookIndex === 1 ? "Accuracy" : "Encapsulation"}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {activeBookIndex === 0 ? (
                                      <>
                                        <tr className="border-b border-slate-100 font-medium">
                                          <td className="py-1.5 pl-1 font-serif">CRISPR Efficiency</td>
                                          <td className="py-1.5 text-right font-bold text-emerald-700 font-serif">+78.2%</td>
                                          <td className="py-1.5 text-right text-slate-500 font-serif">1.0%</td>
                                        </tr>
                                        <tr className="border-b border-slate-100 font-medium">
                                          <td className="py-1.5 pl-1 font-serif">Off-Target Mut.</td>
                                          <td className="py-1.5 text-right font-bold text-rose-700 font-serif">-12.4%</td>
                                          <td className="py-1.5 text-right text-slate-500 font-serif">0.2%</td>
                                        </tr>
                                        <tr className="border-b border-slate-300 font-medium">
                                          <td className="py-1.5 pl-1 font-serif">Classification Acc.</td>
                                          <td className="py-1.5 text-right font-bold text-blue-700 font-serif">+94.2%</td>
                                          <td className="py-1.5 text-right text-slate-500 font-serif">82.1%</td>
                                        </tr>
                                      </>
                                    ) : activeBookIndex === 1 ? (
                                      <>
                                        <tr className="border-b border-slate-100 font-medium">
                                          <td className="py-1.5 pl-1 font-serif">CSP Riemannian</td>
                                          <td className="py-1.5 text-right font-bold text-blue-700 font-serif">12.4 ms</td>
                                          <td className="py-1.5 text-right text-slate-500 font-serif">94.2%</td>
                                        </tr>
                                        <tr className="border-b border-slate-100 font-medium">
                                          <td className="py-1.5 pl-1 font-serif">Deep ConvNet</td>
                                          <td className="py-1.5 text-right font-bold text-blue-700 font-serif">28.1 ms</td>
                                          <td className="py-1.5 text-right text-slate-500 font-serif">96.8%</td>
                                        </tr>
                                        <tr className="border-b border-slate-300 font-medium">
                                          <td className="py-1.5 pl-1 font-serif">LDA Classifier</td>
                                          <td className="py-1.5 text-right font-bold text-slate-700 font-serif">4.2 ms</td>
                                          <td className="py-1.5 text-right text-slate-500 font-serif">85.6%</td>
                                        </tr>
                                      </>
                                    ) : (
                                      <>
                                        <tr className="border-b border-slate-100 font-medium">
                                          <td className="py-1.5 pl-1 font-serif">Mean Particle Size</td>
                                          <td className="py-1.5 text-right font-bold text-amber-700 font-serif">68 - 84 nm</td>
                                          <td className="py-1.5 text-right text-slate-500 font-serif">96.5% EE</td>
                                        </tr>
                                        <tr className="border-b border-slate-100 font-medium">
                                          <td className="py-1.5 pl-1 font-serif">Polydispersity (PDI)</td>
                                          <td className="py-1.5 text-right font-bold text-amber-700 font-serif">&lt; 0.12</td>
                                          <td className="py-1.5 text-right text-slate-500 font-serif">98.1% EE</td>
                                        </tr>
                                        <tr className="border-b border-slate-300 font-medium">
                                          <td className="py-1.5 pl-1 font-serif">Zeta Potential</td>
                                          <td className="py-1.5 text-right font-bold text-slate-700 font-serif">+4.2 mV</td>
                                          <td className="py-1.5 text-right text-slate-500 font-serif">94.8% EE</td>
                                        </tr>
                                      </>
                                    )}
                                  </tbody>
                                </table>
                                <span className="block text-[8px] text-slate-500 font-serif italic mt-2.5 leading-tight text-center">
                                  {activeBookIndex === 0 
                                    ? "*Note: Observations verified over 96 hours post transfection. Control refers to wildtype hepatocytes (p-value < 0.01)."
                                    : activeBookIndex === 1
                                    ? "*Note: Delay includes signal amplification, spatial filtering, and classification inference time. Signal-to-noise ratio: 12dB."
                                    : "*Note: Encapsulation efficiency is determined by Ribogreen assay. PDI represents the polydispersity index."
                                  }
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-end mt-4">
                              <span className="text-[9px] text-slate-400 font-mono">Page 05</span>
                            </div>
                          </div>
                        </>
                      )}

                      {activeBookSpread === 3 && (
                        /* SPREAD 3 */
                        <>
                          {/* Left Page (Page 06) */}
                          <div className="w-1/2 p-7 md:p-9 pr-10 md:pr-12 bg-[#FAF8F5] border-r border-slate-200/50 flex flex-col justify-between relative select-text">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 pb-1.5 font-mono">
                                <span>{activeBookIndex === 0 ? "Delivery Systems" : activeBookIndex === 1 ? "Tactile Pathways" : "Immunology Profiles"}</span>
                                <span>Healix Bio-Networks</span>
                              </div>
                              <h4 className="text-lg md:text-xl font-heading font-black tracking-tight text-slate-900 uppercase font-serif mt-2 leading-tight">
                                {activeBookIndex === 0 ? "Therapeutic Delivery Vectors" : activeBookIndex === 1 ? "Closed-Loop Haptic Feedback" : "Clinical Phase Evaluation"}
                              </h4>
                              <div className="w-8 h-0.5 bg-accent-blue" />
                              <p className="text-[11px] md:text-xs text-slate-650 leading-relaxed font-medium text-justify font-serif pt-1">
                                {activeBookIndex === 0 
                                  ? "Optimizing lipid nanoparticle (LNP) formulation and adeno-associated virus (AAV) vectors to bypass immunological barriers."
                                  : activeBookIndex === 1
                                  ? "Translating robotic finger pressure sensors into electrical nerve stimulation to restore natural grasping sensations."
                                  : "Phase I/II clinical trials analyzing neutralizing antibody titers and memory T-cell responses in vaccine candidates."
                                }
                              </p>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-serif text-justify pt-1">
                                {activeBookIndex === 0 
                                  ? "By micro-tuning lipid ratios and PEGylation density, we extended half-life in hepatic circulation while maintaining target organ specificity and cellular uptake kinetics."
                                  : activeBookIndex === 1
                                  ? "We mapped sensory feedback using frequency-modulated micro-stimulation bursts. Patients successfully identified surface textures and object stiffness in blind trials."
                                  : "Participants receiving a 30-microgram dose demonstrated a 14-fold increase in neutralizing antibody titers against target antigens, with no serious adverse effects reported."
                                }
                              </p>
                            </div>
                            <div className="flex items-end justify-between border-t border-slate-200 pt-3">
                              <div className="text-[9px] text-slate-500 font-serif leading-tight">
                                <p>Co-Investigator:</p>
                                <p className="font-bold text-slate-700">
                                  {activeBookIndex === 0 ? "Dr. Amit Patwardhan" : activeBookIndex === 1 ? "Dr. Ramesh Krishnan" : "Dr. Sunita Deshmukh"}
                                </p>
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono">Page 06</span>
                            </div>
                          </div>

                          {/* Right Page (Page 07) */}
                          <div className="w-1/2 p-7 md:p-9 pl-10 md:pl-12 bg-[#FCFBF9] flex flex-col justify-between relative select-text">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 pb-1.5 font-mono">
                                <span>{activeBookIndex === 0 ? "Vector Synthesis" : activeBookIndex === 1 ? "Decoder Index" : "Antibody Titers"}</span>
                                <span>{activeBookIndex === 0 ? "Section 1.2" : activeBookIndex === 1 ? "Signal Pathways" : "Section 3.2"}</span>
                              </div>
                              
                              <span className="text-[9px] font-bold text-accent-blue tracking-widest uppercase block font-mono">
                                {activeBookIndex === 0 
                                  ? "1.2 Vector Synthesis & Encapsulation" 
                                  : activeBookIndex === 1 
                                  ? "2.2 Algorithm Implementations" 
                                  : "3.2 Neutralizing Antibody Responses"
                                }
                              </span>
                              
                              {/* Conditionally rendered graphics */}
                              {activeBookIndex === 0 ? (
                                <div className="h-28 w-full border border-slate-200 bg-slate-50/50 rounded-lg flex items-center justify-center relative overflow-hidden my-3 shadow-inner">
                                  <svg className="w-4/5 h-20" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="100" cy="40" r="28" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />
                                    <circle cx="100" cy="40" r="24" stroke="#34d399" strokeWidth="1" />
                                    <circle cx="90" cy="30" r="3" fill="#047857" />
                                    <circle cx="110" cy="50" r="3.5" fill="#10b981" />
                                    <circle cx="115" cy="32" r="2" fill="#059669" />
                                    <circle cx="85" cy="48" r="4" fill="#065f46" />
                                    <path d="M 85 40 Q 95 32, 100 40 T 115 40" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1,1" />
                                    <line x1="100" y1="12" x2="100" y2="4" stroke="#059669" strokeWidth="1" />
                                    <line x1="100" y1="68" x2="100" y2="76" stroke="#059669" strokeWidth="1" />
                                    <line x1="72" y1="40" x2="64" y2="40" stroke="#059669" strokeWidth="1" />
                                    <line x1="128" y1="40" x2="136" y2="40" stroke="#059669" strokeWidth="1" />
                                  </svg>
                                  <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-mono font-bold">Fig 1.2: LNP Nanoparticle Transport</span>
                                </div>
                              ) : activeBookIndex === 1 ? (
                                <div className="space-y-3 pt-1">
                                  <div className="flex items-start space-x-2 text-[10px] md:text-[11px] text-slate-700">
                                    <span className="text-sm font-black font-heading text-blue-900 leading-none font-serif">1.</span>
                                    <div>
                                      <span className="font-bold text-slate-900 block font-serif">EEG Signal Filtering</span>
                                      <span className="text-[9px] text-slate-500 font-serif leading-snug block">Spatial filtering via Common Spatial Patterns (CSP) for motor imagery.</span>
                                    </div>
                                  </div>
                                  <div className="flex items-start space-x-2 text-[10px] md:text-[11px] text-slate-700">
                                    <span className="text-sm font-black font-heading text-blue-900 leading-none font-serif">2.</span>
                                    <div>
                                      <span className="font-bold text-slate-900 block font-serif">EMG Envelope Analysis</span>
                                      <span className="text-[9px] text-slate-500 font-serif leading-snug block">Continuous activation tracking using linear envelope estimators.</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-28 w-full border border-slate-200 bg-slate-50/50 rounded-lg flex items-center justify-center relative overflow-hidden my-3 shadow-inner">
                                  <svg className="w-4/5 h-20" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="20" y1="70" x2="180" y2="70" stroke="#cbd5e1" strokeWidth="1" />
                                    <line x1="20" y1="10" x2="20" y2="70" stroke="#cbd5e1" strokeWidth="1" />
                                    <path d="M 20 70 Q 50 40, 80 55 T 140 65" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                                    <path d="M 20 70 Q 50 68, 80 50 Q 100 15, 120 18 T 180 32" stroke="#d97706" strokeWidth="2.0" strokeLinecap="round" />
                                    <rect x="110" y="10" width="20" height="10" fill="#fef3c7" fillOpacity="0.8" rx="2" stroke="#d97706" strokeWidth="0.5" />
                                    <text x="120" y="17" fill="#78350f" fontSize="5" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">Peak</text>
                                  </svg>
                                  <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-mono font-bold">Fig 3.2: Antibody Titer Response Curves</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <Link
                                href="/publications"
                                className="text-xs text-accent-blue hover:text-blue-700 font-bold inline-flex items-center space-x-0.5 hover:underline font-mono"
                              >
                                <span>Read Abstract</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                              <span className="text-[9px] text-slate-400 font-mono">Page 07</span>
                            </div>
                          </div>
                        </>
                      )}

                      {activeBookSpread === 4 && (
                        /* SPREAD 4 */
                        <>
                          {/* Left Page (Page 08) */}
                          <div className="w-1/2 p-7 md:p-9 pr-10 md:pr-12 bg-[#FAF8F5] border-r border-slate-200/50 flex flex-col justify-between relative select-text">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 pb-1.5 font-mono">
                                <span>{activeBookIndex === 0 ? "Clinical Framework" : activeBookIndex === 1 ? "Future Tech" : "Pathogen Platforms"}</span>
                                <span>Healix Bio-Networks</span>
                              </div>
                              <h4 className="text-lg md:text-xl font-heading font-black tracking-tight text-slate-900 uppercase font-serif mt-2 leading-tight">
                                {activeBookIndex === 0 ? "Clinical Translation Progress" : activeBookIndex === 1 ? "Direct Brain-Computer Interfaces" : "Future Disease Targets"}
                              </h4>
                              <div className="w-8 h-0.5 bg-accent-blue" />
                              <p className="text-[11px] md:text-xs text-slate-600 leading-relaxed font-medium text-justify font-serif pt-1">
                                {activeBookIndex === 0 ? "Translating target gene knockdowns into therapeutic protocols, aligning preclinical models with safety and regulatory standards." : activeBookIndex === 1 ? "Exploring biocompatible high-density microelectrode arrays for ultra-precise motor cortex signal recording." : "Leveraging modular mRNA blueprints to rapidly formulate vaccines for emerging viral pathogens and personalized cancer immunotherapies."}
                              </p>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-serif text-justify pt-1">
                                {activeBookIndex === 0 ? "The publication outlines initial safety profiles and target efficacy across pre-clinical non-human primate cohorts, detailing dosing regimens and post-delivery liver monitoring protocols." : activeBookIndex === 1 ? "We evaluate flexible thin-film polyimide electrodes designed for chronic implantation. Preclinical tests show minimal immune response and stable signal recording over 180 days." : "The platform's plug-and-play architecture allows rapid synthesis of custom antigens, shortening development cycles from months to days for clinical validation."}
                              </p>
                            </div>
                            <div className="flex items-end justify-between border-t border-slate-200 pt-3">
                              <div className="text-[9px] text-slate-500 font-serif leading-tight">
                                <p>Regulatory Compliance:</p>
                                <p className="font-bold text-slate-700">
                                  {activeBookIndex === 0 ? "DCGI & ICMR Guidelines" : activeBookIndex === 1 ? "CDSCO & Ethics Board" : "WHO Standards & WHO Pre-qual"}
                                </p>
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono">Page 08</span>
                            </div>
                          </div>

                          {/* Right Page (Page 09) */}
                          <div className="w-1/2 p-7 md:p-9 pl-10 md:pl-12 bg-[#FCFBF9] flex flex-col justify-between relative select-text">
                            <div className="space-y-4">
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 pb-1.5 font-mono">
                                <span>{activeBookIndex === 0 ? "Workflow" : (activeBookIndex === 1 ? "Workflow" : "Workflow")}</span>
                                <span>{activeBookIndex === 0 ? "Submission" : (activeBookIndex === 1 ? "Signal Pipeline" : "Antigen Pipeline")}</span>
                              </div>
                              
                              <span className="text-[9px] font-bold text-accent-blue tracking-widest uppercase block font-mono">
                                  {activeBookIndex === 0 ? "1.3 Regulatory Submission Pipeline" : activeBookIndex === 1 ? "2.3 Cortical Signal Pipeline" : "3.3 Antigen Synthesis Pipeline"}
                              </span>
                              
                              {/* Workflow vector block diagram */}
                              <div className="h-28 w-full border border-slate-200 bg-slate-50/50 rounded-lg flex flex-col items-center justify-center p-3 relative overflow-hidden my-3 shadow-inner">
                                <div className="flex items-center space-x-1.5 text-[8px] font-mono text-slate-700 w-full justify-between">
                                  <div className="border border-slate-300 bg-white px-1.5 py-1 rounded shadow-xs text-center font-bold font-serif">
                                    {activeBookIndex === 0 ? "Research Node" : activeBookIndex === 1 ? "Cortical Array" : "Design Node"}
                                  </div>
                                  <span className="text-slate-400">→</span>
                                  <div className="border border-slate-300 bg-white px-1.5 py-1 rounded shadow-xs text-center font-bold font-serif">
                                    {activeBookIndex === 0 ? "Submission" : activeBookIndex === 1 ? "Amplification" : "Antigen Synth"}
                                  </div>
                                </div>
                                <div className="text-slate-400 text-[8px] font-mono my-1">↓</div>
                                <div className="flex items-center space-x-1.5 text-[8px] font-mono text-slate-700 w-full justify-between">
                                  <div className="border border-slate-300 bg-white px-1.5 py-1 rounded shadow-xs text-center font-bold font-serif">
                                    {activeBookIndex === 0 ? "Validator Core" : activeBookIndex === 1 ? "Feature Extract" : "LNP Packaging"}
                                  </div>
                                  <span className="text-slate-400">→</span>
                                  <div className="border border-slate-300 bg-blue-600 text-white px-1.5 py-1 rounded shadow-xs text-center font-bold font-black font-serif">
                                    {activeBookIndex === 0 ? "Archive Sync" : activeBookIndex === 1 ? "Actuator Drive" : "Trial Batch"}
                                  </div>
                                </div>
                              </div>
                              <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed font-serif text-justify">
                                {activeBookIndex === 0 
                                  ? "Automatic BibTeX referencing, metadata hashes, and researcher credentials sync instantly on milestone validation."
                                  : activeBookIndex === 1
                                  ? "Feature extractions trigger instant neuro-prosthetic limb actuation commands with sub-10ms latency thresholds."
                                  : "Optimized LNP lipid formulations pack custom synthesized mRNA strands, making them immediately available for validation."
                                }
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <Link
                                href={activeBookIndex === 0 ? "/publications" : activeBookIndex === 1 ? "/projects" : "/opportunities"}
                                className="text-xs text-accent-blue hover:text-blue-700 font-bold inline-flex items-center space-x-0.5 hover:underline font-mono"
                              >
                                <span>Enter Portal</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                              <span className="text-[9px] text-slate-400 font-mono">Page 09</span>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* AUTHORITY VIDEO SHOWCASE */}
      <section className="py-24 bg-[#080d19]/45 border-b border-slate-900 relative z-10 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 translate-x-1/2 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Side: Large Video Player (lg:col-span-7) */}
            <div className="lg:col-span-7 w-full">
              <div 
                className="relative w-full rounded-2xl border border-slate-800 bg-slate-950/60 shadow-[0_20px_50px_rgba(30,58,138,0.25)] overflow-hidden group"
                style={{ aspectRatio: "16/9" }}
              >
                
                {/* Lazy-loaded IFrame or Video cover */}
                {!isPlayingVideo ? (
                  <div 
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 w-full h-full cursor-pointer flex flex-col justify-between p-6 sm:p-8 select-none overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: `url('${videoConfig.coverImage}')` }}
                  >
                    {/* Cover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/20 z-10" />
                    
                    {/* Decorative cell structure animation inside cover */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-blue-500/20 animate-pulse pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-purple-500/15 animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />

                    {/* Metadata duration badge */}
                    <div className="relative z-20 self-start px-3 py-1 rounded-md bg-[#0b0f19]/90 border border-slate-800 text-[9px] font-bold text-slate-300 uppercase tracking-wider shadow-sm flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span>Featured Presentation • {videoConfig.duration}</span>
                    </div>

                    {/* Center Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <motion.div 
                        whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(59,130,246,0.5)" }}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent-blue hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 border border-white/10 transition-colors"
                      >
                        <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white translate-x-0.5" />
                      </motion.div>
                    </div>

                    {/* Bottom Metadata Info */}
                    <div className="relative z-20 self-end w-full flex items-end justify-between">
                      <div className="space-y-1 text-left">
                        <span className="text-[9px] font-bold text-accent-blue uppercase tracking-widest block font-mono">{videoConfig.subtitle}</span>
                        <h4 className="text-sm sm:text-lg font-heading font-extrabold text-white leading-tight">
                          {videoConfig.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 font-mono hidden sm:block">HD 1080P</span>
                    </div>
                  </div>
                ) : (
                  <iframe
                    className="absolute inset-0 w-full h-full rounded-2xl"
                    src={`${videoConfig.youtubeUrl}?autoplay=1&rel=0`}
                    title={videoConfig.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>
            </div>

            {/* Right Side: Authority Information (lg:col-span-5) */}
            <div className="lg:col-span-5 text-left space-y-6">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-[10px] font-bold text-accent-blue uppercase tracking-widest mb-3">
                  <Beaker className="w-3 h-3 text-accent-blue" />
                  <span>Authority Insights</span>
                </div>
                <h3 className="text-2xl sm:text-4.5xl font-heading font-extrabold text-research-blue leading-tight uppercase">
                  The Catalyst of Discovery
                </h3>
                <h4 className="text-base sm:text-xl font-heading font-extrabold text-slate-300 mt-1">
                  Why Scientific Research Matters
                </h4>
              </div>
              
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Scientific research is not merely a collection of datasets; it is the active mapping of our biological future. At Healix BioLabs, we believe that understanding the fundamental mechanisms of gene sequencing and neural pathways is the single most powerful tool we possess to solve humanity's greatest health challenges.
              </p>

              {/* Authority Quote block */}
              <div className="pl-4 border-l-2 border-accent-blue py-1.5 bg-slate-950/20 backdrop-blur-xs rounded-r-lg pr-4">
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "Every validation run on our platform brings us closer to a world where hereditary disorders are not life sentences, but solvable engineering challenges."
                </p>
                <div className="mt-3 flex items-center space-x-3">
                  {/* Styled Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-blue to-purple-600 flex items-center justify-center text-white text-[10px] font-bold border border-white/10 shadow-md">
                    PS
                  </div>
                  <div className="leading-tight text-left">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">Dr. Priya Sharma, PhD</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase font-mono">Chief Scientific Officer, Healix</p>
                  </div>
                </div>
              </div>

              {/* Research Takeaways checklist */}
              <div className="space-y-3 pt-2">
                {[
                  {
                    title: "Translational Velocity",
                    desc: "Accelerating discovery timelines, converting laboratory sequencing results into active clinical trials."
                  },
                  {
                    title: "Decentralized Access",
                    desc: "Providing secure, open metadata endpoints connecting India's premier researchers."
                  },
                  {
                    title: "Interdisciplinary Synergy",
                    desc: "Uniting genomics, neural engineering, and computational biology under one unified platform."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-left">
                    <div className="mt-0.5 rounded-full bg-emerald-500/10 p-0.5 border border-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block leading-tight">{item.title}</span>
                      <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/publications"
                  className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-200 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  <span>Explore Research Literature</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ELITE INSTITUTIONS ENDLESS LOOP SLIDER */}
      <section className="py-20 bg-[#070B13] border-b border-slate-900 overflow-hidden relative z-10">
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <GraduationCap className="w-3.5 h-3.5 text-accent-blue" />
              <span>Elite Academic Network</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-research-blue">
              Mentors & Researchers from Top Institutes
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              Our network includes academic mentors, principal investigators, and clinical scientists from India&apos;s leading institutions.
            </p>
          </div>

          {/* Infinite Marquee Slider */}
          <div className="relative w-full overflow-hidden py-4 flex animate-none">
            {/* Soft gradient edge masks for visual luxury */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#070B13] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#070B13] to-transparent z-10 pointer-events-none" />
            
            {/* Sliding Track (Duplicated for seamless infinite looping scroll) */}
            <div className="flex animate-marquee space-x-12 whitespace-nowrap">
              {marqueeLogos.map((logo, index) => (
                <div 
                  key={`logo-${index}`}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-5 shadow-inner shadow-black/30 hover:border-slate-700 hover:scale-105 transition-all duration-300 shrink-0 inline-flex"
                >
                  <img 
                    src={logo.src} 
                    alt={`${logo.name} logo`} 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain select-none filter brightness-95"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CALL TO ACTION (Deep Space Navy block) */}
      <section className="py-20 bg-gradient-to-r from-slate-950 via-[#0B0F19] to-slate-950 text-brand-white text-center relative z-10 overflow-hidden shadow-inner border-t border-slate-900/60">
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold">
            Join India&apos;s Next Frontier of <br />Biomedical Innovation
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Collaborate on high-impact projects, publish research, and connect with premier research organizations.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="bg-accent-blue hover:bg-accent-blue/90 text-brand-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-lg transition-all inline-flex items-center space-x-1.5 shadow-md shadow-accent-blue/15 hover:scale-102"
            >
              <span>Initialize BioLabs Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* DETAILED PROFILE MODAL */}
      <AnimatePresence>
        {selectedProfileMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProfileMember(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-[#0B0F19] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative text-slate-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProfileMember(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-6 md:p-8 space-y-6">
                
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-800 shadow-lg shrink-0 bg-slate-900">
                    <img
                      src={selectedProfileMember.photo}
                      alt={selectedProfileMember.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="text-xl md:text-2xl font-heading font-extrabold text-white">
                        {selectedProfileMember.name}
                      </h3>
                      <a
                        href={selectedProfileMember.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-[#0077B5]/10 border border-[#0077B5]/20 text-[#0077B5] text-[10px] font-bold uppercase tracking-wider hover:bg-[#0077B5] hover:text-white transition-all w-fit mx-auto sm:mx-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LinkedinIcon className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                      </a>
                    </div>
                    <p className="text-xs md:text-sm font-bold text-accent-blue uppercase tracking-wider">
                      {selectedProfileMember.role}
                    </p>
                    <p className="text-xs text-slate-400 font-semibold">
                      {selectedProfileMember.institution}
                    </p>
                  </div>
                </div>

                {/* About & Bio */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-left">Biography & Background</h4>
                  <p className="text-xs leading-relaxed text-slate-400 text-left">
                    {selectedProfileMember.bio}
                  </p>
                </div>

                {/* Expertise Badges */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider text-left">Areas of Expertise</h4>
                  <div className="flex flex-wrap gap-2 justify-start">
                    {selectedProfileMember.expertise.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 tracking-wide font-mono uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Institutional Credentials */}
                <div className="pt-6 border-t border-slate-900/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Network Credentials: Verified Member</span>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#3B82F6] font-bold">Healix Bio-Networks 2026</span>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
