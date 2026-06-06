import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import { ShieldCheck, Lock, Eye, FileText, Globe } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Privacy Policy | Healix BioLabs",
  description: "Learn about how we protect and manage your data at Healix BioLabs.",
};

export default async function PrivacyPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden text-slate-300">
      <ScientificBackground />
      <Navbar currentUser={currentUser} />
      
      <main className="flex-grow pt-28 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 bg-slate-900/60 border border-slate-800/80 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest text-[#3B82F6] uppercase mb-2 select-none">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Protection Registry</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight uppercase">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400">
              Last Updated: June 6, 2026 · Version 1.1
            </p>
          </div>

          {/* Intro Card */}
          <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
            <p className="text-xs leading-relaxed text-slate-400">
              At Healix BioLabs, we build high-fidelity decentralized biomedical intelligence networks. We prioritize the security, confidentiality, and integrity of your academic profile and credentials. This policy details how we collect, store, and utilize your information.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-6">
            
            <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-accent-blue" />
                1. Information We Collect
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                To build your researcher passport profile, we collect active credentials and metadata:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-400 space-y-1.5 pl-2">
                <li>Personal identification details (Name, email, and researcher bio).</li>
                <li>Professional details (Current institution, academic roles, and qualifications).</li>
                <li>Imported publication lists and citations metrics from Google Scholar, ORCID, and ResearchGate sync integrations.</li>
                <li>Training completion scores and verifiable certification registries.</li>
              </ul>
            </div>

            <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent-blue" />
                2. Data Syncing & Third-Party APIs
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Our platform integrates with academic repositories to display live researcher indices. We query third-party APIs to pull citation metrics and publications. When you sync your Google Scholar, ORCID, or ResearchGate profiles, we store citation counts and bibliographic details in our secure database. We do not store any third-party credentials or login tokens.
              </p>
            </div>

            <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent-blue" />
                3. Information Security & Encryption
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                We implement robust security standards to block unauthorized access, clickjacking, and script injections. All sessions are authenticated using secure cookies (`healix_supabase_token`). Verifiable Certificates of Completion are registered with secure cryptographic SHA-256 hashes, making them tamper-proof.
              </p>
            </div>

            <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-blue" />
                4. Your Rights & Data Control
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                You retain full ownership of your profile. You can edit your professional details, sync new datasets, or request account and profile deletion by contacting support.
              </p>
            </div>

          </div>

          {/* Contact relations callout */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Have privacy concerns?</h4>
              <p className="text-[11px] text-slate-500 mt-1">Get in touch with our Academic Relations officer at relations@biolabsresearch-healix.com.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

// Inline fallback since lucide-react User might not import cleanly
function User(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
