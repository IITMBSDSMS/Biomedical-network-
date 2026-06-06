"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ShieldCheck, ShieldAlert, Award, Calendar, User, Mail, 
  ArrowLeft, Search, RefreshCw, CheckCircle, ExternalLink, Copy, Download
} from "lucide-react";
import Link from "next/link";
import { downloadCertificateAsPDF, CertificatePreview } from "@/components/ui/CertificateDownload";

export default function VerificationPortalClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hashParam = searchParams.get("hash");

  const [certHash, setCertHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  // PDF download — uses the shared premium certificate generator
  const downloadCertificateSVG = (fullName: string, hash: string, issuedAt: string) => {
    downloadCertificateAsPDF(fullName, hash, issuedAt);
  };

  // Trigger verify automatically if hash is in URL
  useEffect(() => {
    if (hashParam && hashParam.trim()) {
      setCertHash(hashParam.trim());
      verifyHash(hashParam.trim());
    }
  }, [hashParam]);

  const verifyHash = async (hash: string) => {
    if (!hash || !hash.trim()) {
      setError("Please enter a valid certificate hash.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSearched(true);

    try {
      const res = await fetch("/api/training/certificate/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ certHash: hash.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setResult(data);
      } else {
        setError(data.error || "Certificate not found or invalid");
      }
    } catch (err) {
      console.error("Verification query error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (certHash.trim()) {
      // Update URL search parameter
      router.push(`/training/verify?hash=${certHash.trim()}`);
    }
  };

  const handleCopyHash = () => {
    if (result?.certificate?.certHash) {
      navigator.clipboard.writeText(result.certificate.certHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 text-slate-300">
      
      {/* Breadcrumb back navigation */}
      <div className="flex justify-start">
        <Link href="/training" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white uppercase tracking-wider font-bold transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Academy</span>
        </Link>
      </div>

      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-[10px] font-bold text-accent-blue uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-blue" />
          <span>Registry Node</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white uppercase tracking-tight">
          Credential Verification
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Verify the authenticity of Healix BioLabs Academy Certificates of Completion. Enter the unique cryptographic hash code to query the registry database.
        </p>
      </div>

      {/* Search Input Panel */}
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="absolute left-4 text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Enter certificate hash (e.g. HX-CERT-...)"
            value={certHash}
            onChange={(e) => setCertHash(e.target.value)}
            disabled={loading}
            className="w-full py-3.5 pl-11 pr-28 rounded-xl border border-slate-800 bg-[#0B0F19]/90 hover:border-slate-800 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue text-xs text-white font-mono placeholder:text-slate-500 transition-all focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !certHash.trim()}
            className="absolute right-2 px-4 py-2 text-[10px] font-bold uppercase tracking-wider bg-accent-blue hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>Verifying</span>
              </>
            ) : (
              <span>Verify</span>
            )}
          </button>
        </form>
        <div className="flex justify-center pt-2.5">
          <button
            type="button"
            onClick={() => downloadCertificateSVG("Dr. Priya Sharma", "HX-CERT-SAMPLE-2026-9999", new Date().toISOString())}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Award className="w-4.5 h-4.5 text-amber-500" />
            <span>Download Certificate Sample</span>
          </button>
        </div>
      </div>

      {/* Verification Result Display */}
      {searched && (
        <div className="max-w-4xl mx-auto">
          {loading ? (
            /* Loading State */
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Querying Verification Registry...</p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="border border-red-500/15 bg-red-950/10 rounded-2xl p-8 text-center space-y-5 max-w-lg mx-auto shadow-lg shadow-red-950/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
              <ShieldAlert className="w-14 h-14 text-red-500 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-heading font-extrabold text-white uppercase">Verification Failed</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The certificate hash you entered could not be found or verified in our registry database.
                </p>
                <div className="py-2.5 px-3.5 bg-slate-950 rounded-lg font-mono text-xs text-red-400/90 break-all border border-slate-900 inline-block">
                  {certHash}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                <p className="font-bold text-slate-400">Troubleshooting Tips:</p>
                <ul className="list-disc list-inside text-left mt-1.5 space-y-1">
                  <li>Check for spelling errors or missing digits.</li>
                  <li>Ensure the prefix <span className="font-mono text-slate-400">HX-CERT-</span> is included.</li>
                  <li>Verify that you copy-pasted the exact cryptographic code.</li>
                </ul>
              </div>
            </div>
          ) : result ? (
            /* Success State */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Metadata & Detailed Status */}
              <div className="lg:col-span-5 border border-slate-800 bg-[#0B0F19]/60 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between shadow-xl relative overflow-hidden text-left">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-accent-blue" />
                
                <div className="space-y-6">
                  {/* Verified Header */}
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-900">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono block">Status: Valid</span>
                      <h4 className="text-sm font-heading font-extrabold text-white uppercase tracking-wider">Credential Authenticated</h4>
                    </div>
                  </div>

                  {/* Metadata fields */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Recipient Name</span>
                      <div className="flex items-center space-x-2 text-slate-200">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold">{result.certificate.fullName}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Recipient Role</span>
                      <span className="inline-block mt-0.5 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950/50 text-accent-blue border border-blue-900/50 uppercase">
                        {result.user?.role || "RESEARCHER"}
                      </span>
                    </div>

                    {result.user?.email && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Registered Email</span>
                        <div className="flex items-center space-x-2 text-slate-300">
                          <Mail className="w-4 h-4 text-slate-500" />
                          <span className="text-xs font-medium font-mono">
                            {/* Obfuscate email partially for privacy */}
                            {result.user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Date of Issue</span>
                      <div className="flex items-center space-x-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold">
                          {new Date(result.certificate.issuedAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold block">Registry Hash Code</span>
                      <div className="flex items-center justify-between gap-2 px-3 py-2 border border-slate-800 bg-slate-950 rounded-lg text-amber-500 font-mono text-[10px] font-bold select-all tracking-wider">
                        <span className="truncate">{result.certificate.certHash}</span>
                        <button 
                          type="button"
                          onClick={handleCopyHash}
                          className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5 hover:bg-slate-900 rounded"
                          title="Copy Hash"
                        >
                          {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => downloadCertificateSVG(result.certificate.fullName, result.certificate.certHash, result.certificate.issuedAt)}
                        className="w-full px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                      >
                        <Award className="w-4 h-4" />
                        <span>Download Official Certificate</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>ISSUER: HEALIX BIOLABS</span>
                  <span className="flex items-center text-accent-blue space-x-0.5">
                    <span>SECURE NODE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  </span>
                </div>
              </div>

              {/* Right Column: Dynamic Certificate Preview */}
              <div className="lg:col-span-7 border border-slate-800 bg-[#0B0F19]/60 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-center items-center shadow-xl min-h-[350px] overflow-hidden">
                <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-[#04091a]" style={{ aspectRatio: "1122/793" }}>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.32] sm:scale-[0.44] md:scale-[0.48] lg:scale-[0.44] xl:scale-[0.56] origin-center transition-all duration-300">
                    <CertificatePreview
                      fullName={result.certificate.fullName}
                      certHash={result.certificate.certHash}
                      issuedAt={result.certificate.issuedAt}
                    />
                  </div>
                </div>
              </div>

            </div>
          ) : null}
        </div>
      )}

      {/* Information Banner (Professional layout) */}
      <div className="max-w-4xl mx-auto border border-slate-800 bg-[#0B0F19]/30 rounded-2xl p-6 text-left grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h4 className="text-sm font-heading font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Curriculum Standards</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            Every issued credential reflects completion of 4 foundational units: scientific inquiry, citation standards (BibTeX format), BSL-2 biological lab containment, PCR genomic workflows, and international translational ethics under ICMR guidelines.
          </p>
        </div>
        <div className="border-l border-slate-900 pl-0 md:pl-6 pt-4 md:pt-0">
          <h4 className="text-sm font-heading font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic Integrity</span>
          </h4>
          <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
            The unique certificate hash is generated via cryptographic hashing of recipient data, serial number, and release timestamps, making certificates tamper-proof and verifiable by third-party institutions.
          </p>
        </div>
      </div>

    </div>
  );
}
