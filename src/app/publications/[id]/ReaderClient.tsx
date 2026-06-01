"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Share2, Clipboard, Check, Calendar, ArrowLeft, ExternalLink, Bookmark, FileText } from "lucide-react";
import { motion } from "framer-motion";

interface ReaderClientProps {
  publication: any;
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

export default function ReaderClient({ publication }: ReaderClientProps) {
  const [citationFormat, setCitationFormat] = useState<"APA" | "MLA" | "BibTeX">("APA");
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const authors = safeJsonParseArray(publication.authors);
  const keywords = safeJsonParseArray(publication.keywords);

  // Formatted publication details
  const year = new Date(publication.createdAt).getFullYear();
  const title = publication.title;
  const authorNamesFormatted = authors.join(", ");
  const firstAuthorLastName = authors[0]?.split(" ").pop() || "Author";

  // Citation string generators
  const citations = {
    APA: `${authorNamesFormatted} (${year}). ${title}. Healix BioLabs. Retrieved from ${typeof window !== "undefined" ? window.location.href : ""}`,
    MLA: `${authorNamesFormatted}. "${title}." Healix BioLabs, ${year}. Web.`,
    BibTeX: `@article{${firstAuthorLastName.toLowerCase()}${year}healix,\n  author = {${authors.join(" and ")}},\n  title = {${title}},\n  journal = {Healix BioLabs},\n  year = {${year}},\n  url = {${typeof window !== "undefined" ? window.location.href : ""}}\n}`,
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citations[citationFormat]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Publication link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Return button */}
      <div className="mb-6">
        <Link
          href="/publications"
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portal</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Metadata & Abstract (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-950/20 text-accent-blue border border-blue-900/30 uppercase tracking-wider">
                  {publication.category.replace("_", " ")}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{formatStableDate(publication.createdAt)}</span>
                </span>
              </div>

              <h1 className="text-xl md:text-2xl font-heading font-extrabold text-research-blue leading-tight">
                {publication.title}
              </h1>

              {/* Authors List */}
              <div className="text-xs text-slate-400 font-semibold leading-relaxed">
                <span>By:</span>{" "}
                {authors.map((author, index) => (
                  <span key={author}>
                    {index > 0 && ", "}
                    {/* If matches creator name, link to details */}
                    {index === 0 ? (
                      <Link
                        href={`/researcher/${publication.researcher.slug}`}
                        className="text-accent-blue hover:text-research-blue hover:underline font-bold"
                      >
                        {author}
                      </Link>
                    ) : (
                      <span className="text-slate-300 font-semibold">{author}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {publication.pdfUrl ? (
                <a
                  href={publication.pdfUrl}
                  download
                  className="bg-accent-blue hover:bg-accent-blue/90 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
              ) : (
                <button
                  disabled
                  className="bg-slate-900 text-slate-600 cursor-not-allowed border border-slate-800 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>No PDF Available</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 font-semibold text-xs py-3 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer hover:shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Paper</span>
              </button>
            </div>

            {/* Abstract */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-heading">
                Abstract
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed text-justify">
                {publication.abstract}
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-2 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-heading">
                Keywords
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((k) => (
                  <span
                    key={k}
                    className="px-2.5 py-1 rounded bg-slate-900/60 text-[10px] text-slate-300 border border-slate-800"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Citations Card */}
          <div className="bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest font-heading">
              Citations Generator
            </h3>

            {/* Citation Formats Toggle */}
            <div className="flex border-b border-slate-800 pb-2 gap-3 text-xs">
              {(["APA", "MLA", "BibTeX"] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setCitationFormat(fmt)}
                  className={`pb-1 font-bold transition-all relative cursor-pointer ${
                    citationFormat === fmt ? "text-primary-yellow font-extrabold" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {fmt}
                  {citationFormat === fmt && (
                    <motion.div
                      layoutId="activeCitationLine"
                      className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-primary-yellow"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Citation Box */}
            <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3.5 mt-2">
              <pre className="text-[10px] text-slate-300 font-mono whitespace-pre-wrap select-all font-semibold leading-relaxed">
                {citations[citationFormat]}
              </pre>

              <button
                onClick={handleCopyCitation}
                className="absolute top-2.5 right-2.5 p-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-all focus:outline-none cursor-pointer"
                title="Copy Citation"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>

        {/* Right column: PDF Reader (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-stretch">
          
          <div className="bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 rounded-3xl p-4 flex-1 min-h-[500px] flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 px-1.5">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-primary-yellow" />
                <span>Interactive PDF Viewer</span>
              </span>
              
              {publication.pdfUrl && (
                <a
                  href={publication.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-accent-blue hover:text-research-blue hover:underline flex items-center space-x-1"
                >
                  <span>Open in Tab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {publication.pdfUrl ? (
              <div className="flex-1 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner">
                <iframe
                  src={`${publication.pdfUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full min-h-[600px] bg-slate-950 border-0"
                />
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                <FileText className="w-12 h-12 text-slate-500 mb-2.5" />
                <h4 className="text-sm font-bold text-slate-300">Document Preview Offline</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  This publication was uploaded with local simulated files. Download the publication to review the full transcript.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
