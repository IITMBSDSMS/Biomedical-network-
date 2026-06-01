"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, FileText, Upload, Calendar, User, ArrowRight, X, AlertCircle, Check, FileUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageWrapper, { FadeIn } from "@/components/ui/PageTransitions";

interface PublicationData {
  id: string;
  title: string;
  abstract: string;
  keywords: string;
  authors: string;
  category: string;
  pdfUrl: string | null;
  createdAt: Date;
  researcher: {
    fullName: string;
    slug: string;
  };
}

interface PublicationsClientProps {
  publications: PublicationData[];
  researcher: any; // Logged-in researcher profile (if any)
}

const formatStableDate = (dateInput: Date | string) => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

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

export default function PublicationsClient({ publications, researcher }: PublicationsClientProps) {
  const router = useRouter();
  
  // Browsing States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  // Upload States
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [category, setCategory] = useState("WHITE_PAPER");
  const [keywords, setKeywords] = useState("");
  const [authors, setAuthors] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { label: "All Works", value: "ALL" },
    { label: "White Papers", value: "WHITE_PAPER" },
    { label: "Research Articles", value: "RESEARCH_ARTICLE" },
    { label: "Literature Reviews", value: "LITERATURE_REVIEW" },
  ];

  // Filtering Logic
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const keywordsArray = safeJsonParseArray(pub.keywords);
      const authorsArray = safeJsonParseArray(pub.authors);

      const matchesSearch =
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        keywordsArray.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase())) ||
        authorsArray.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pub.researcher.fullName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "ALL" || pub.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [publications, searchQuery, selectedCategory]);

  // File Upload Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF document to upload.");
      return;
    }
    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      // 1. Upload file to storage API (S3 / local public folder)
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "mock-papers"); // Saves inside public/mock-papers locally

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(err.error || "Failed to upload file");
      }

      const { url, key } = await uploadRes.json();

      // 2. Submit publication record
      const pubRes = await fetch("/api/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract,
          category,
          pdfUrl: url,
          fileKey: key,
          keywords: keywords.split(",").map((k) => k.trim()).filter((k) => k !== ""),
          authors: authors.split(",").map((a) => a.trim()).filter((a) => a !== ""),
        }),
      });

      if (!pubRes.ok) {
        const err = await pubRes.json();
        throw new Error(err.error || "Failed to submit publication metadata");
      }

      setSuccess(true);
      setTimeout(() => {
        setUploadModalOpen(false);
        // Clear fields
        setTitle("");
        setAbstract("");
        setKeywords("");
        setAuthors("");
        setFile(null);
        setSuccess(false);
        router.refresh();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during submission.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageWrapper>
    <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
      

      {/* Page Title & Call Actions */}
      <FadeIn className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="max-w-2xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-research-blue tracking-tight">
            Publications Portal
          </h1>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            Access, download, and index biomedical white papers, clinical trials, and literature studies.
          </p>
        </div>

        {/* Render upload trigger only if logged in as a Researcher */}
        {researcher ? (
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center space-x-2 bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-bold px-5 py-3 rounded-full transition-all shrink-0 cursor-pointer shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Publication</span>
          </button>
        ) : (
          <div className="text-xs bg-slate-50 border border-slate-200 p-3 rounded-2xl text-slate-500 max-w-xs text-center font-semibold">
            Sign in as a Researcher to publish publications on the network.
          </div>
        )}
      </FadeIn>

      {/* Directory Filters & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center justify-between mb-10 pb-6 border-b border-slate-200">
        
        {/* Search */}
        <div className="relative lg:col-span-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search title, keywords, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
          />
        </div>

        {/* Category Tabs */}
        <div className="lg:col-span-2 flex flex-wrap gap-2 lg:justify-end">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === c.value
                  ? "bg-accent-blue text-white border-accent-blue shadow-sm"
                  : "bg-slate-900/40 text-slate-400 border-slate-800 hover:text-slate-100 hover:border-slate-700"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPublications.map((pub) => {
          const keywords = safeJsonParseArray(pub.keywords);
          const authors = safeJsonParseArray(pub.authors);

          return (
            <div
              key={pub.id}
              className={`relative bg-[#0B0F19]/65 border ${
                pub.category === "WHITE_PAPER" ? "border-l-4 border-l-accent-blue" :
                pub.category === "RESEARCH_ARTICLE" ? "border-l-4 border-l-primary-yellow" :
                "border-l-4 border-l-emerald-500"
              } border-y-slate-800 border-r-slate-800 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-700 group`}
            >
              <div className="space-y-4">
                
                {/* Category tag & Date */}
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    pub.category === "WHITE_PAPER" ? "bg-blue-950/20 text-accent-blue border-blue-900/30" :
                    pub.category === "RESEARCH_ARTICLE" ? "bg-amber-950/20 text-primary-yellow border-amber-900/30" :
                    "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                  }`}>
                    {pub.category.replace("_", " ")}
                  </span>
                  
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatStableDate(pub.createdAt)}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold font-heading text-slate-100 line-clamp-1 hover:text-accent-blue transition-colors">
                  <Link href={`/publications/${pub.id}`}>{pub.title}</Link>
                </h3>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {pub.abstract}
                </p>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {keywords.map((k) => (
                    <span
                      key={k}
                      className="px-2 py-0.5 rounded bg-slate-900/60 text-[9px] text-slate-300 border border-slate-800 font-semibold"
                    >
                      {k}
                    </span>
                  ))}
                </div>

              </div>

              {/* Footer Panel */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Lead:{" "}
                    <Link
                      href={`/researcher/${pub.researcher.slug}`}
                      className="text-slate-300 font-bold hover:text-accent-blue hover:underline transition-colors"
                    >
                      {pub.researcher.fullName}
                    </Link>
                  </span>
                </div>

                <Link
                  href={`/publications/${pub.id}`}
                  className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 transition-all flex items-center space-x-1.5 hover:shadow-md cursor-pointer"
                >
                  <span>View Reader</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          );
        })}

        {filteredPublications.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-3xl bg-[#0B0F19]/30">
            No approved publications found matching the query.
          </div>
        )}
      </div>

      {/* Upload Wizard Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUploadModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto animate-in"
            >
              <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold font-heading text-research-blue flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-primary-yellow" />
                  <span>Upload Research Work</span>
                </h2>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="text-xs text-rose-455 bg-rose-950/20 border border-rose-900/50 rounded-xl p-3 mb-4 flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="text-xs text-emerald-455 bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-3 mb-4 flex items-center space-x-1.5">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>Publication uploaded successfully! Awaiting admin approval...</span>
                </div>
              )}

              <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs text-slate-300">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold uppercase tracking-wider block">Publication Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. CRISPR-Cas9 Gene Editing in Cardiovascular Diseases"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold uppercase tracking-wider block">Category Type</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                  >
                    <option value="WHITE_PAPER">White Paper</option>
                    <option value="RESEARCH_ARTICLE">Research Article</option>
                    <option value="LITERATURE_REVIEW">Literature Review</option>
                  </select>
                </div>

                {/* Abstract Description */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold uppercase tracking-wider block">Abstract</label>
                  <textarea
                    rows={4}
                    required
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    placeholder="Provide a detailed summary of the findings, methodology, and conclusion..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue resize-none"
                  />
                </div>

                {/* Keywords & Authors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider block">
                      Keywords <span className="text-slate-500 font-normal">(Comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="e.g. Gene Editing, CRISPR, PCSK9"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider block">
                      Co-Authors <span className="text-slate-500 font-normal">(Comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={authors}
                      onChange={(e) => setAuthors(e.target.value)}
                      placeholder="e.g. Dr. Priya Sharma, Dr. Rajesh Patel"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                </div>

                {/* PDF File Upload Uploader */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-slate-400 font-bold uppercase tracking-wider block">PDF Document</label>
                  <div className="border border-dashed border-slate-800 hover:border-accent-blue rounded-xl p-4 flex flex-col items-center justify-center bg-slate-900/50 transition-all cursor-pointer relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      required
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileUp className="w-8 h-8 text-slate-500 mb-2" />
                    <span className="text-slate-300 font-semibold">
                      {file ? file.name : "Select PDF Document (Max 10MB)"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">Accepts PDF files only</span>
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || success}
                    className="bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/50 text-white px-6 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>{uploading ? "Submitting..." : "Submit for Approval"}</span>
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
    </PageWrapper>
  );
}
