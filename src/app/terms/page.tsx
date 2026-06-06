import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import { FileText, ShieldCheck, Scale, Award, Info } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Terms of Service | Healix BioLabs",
  description: "Read the Terms of Service governing the use of the Healix BioLabs research network.",
};

export default async function TermsPage() {
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
              <Scale className="w-3.5 h-3.5" />
              <span>Legal Guidelines</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight uppercase">
              Terms of Service
            </h1>
            <p className="text-xs text-slate-400">
              Last Updated: June 6, 2026 · Version 1.1
            </p>
          </div>

          {/* Intro Card */}
          <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
            <p className="text-xs leading-relaxed text-slate-400">
              Welcome to Healix BioLabs. These terms of service govern your access and use of the platform, database integrations, researcher profiles, academic verification registries, and training tools. By registering an account or accessing the platform, you agree to comply with these terms.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6">
            
            <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent-blue" />
                1. Authenticity of Researcher Profiles
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                You represent that all profile metadata (including your full name, current institution, and qualifications) you submit is accurate. Impersonating any other researcher, scientist, or academic, or fabricating your academic affiliations, is a violation of these terms and results in immediate account termination.
              </p>
            </div>

            <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent-blue" />
                2. Publications & Intellectual Property Rights
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                You retain all copyright and intellectual property rights in your uploaded papers, datasets, and research materials. By listing works or syncing profiles, you grant us a worldwide, non-exclusive license to display, index, and organize this data for networking and search results.
              </p>
            </div>

            <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-blue" />
                3. Verifiable Certification Registry
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                Certificates of Completion issued by our Academy are protected by cryptographic registry hashes. You agree not to forge, edit, or manipulate certificates, serial numbers, or SHA-256 hashes. Forgery or misrepresentation of academic certifications is strictly prohibited.
              </p>
            </div>

            <div className="bg-[#0B0F19]/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-accent-blue" />
                4. Prohibited Uses of the Platform
              </h3>
              <p className="text-xs leading-relaxed text-slate-400">
                You agree not to perform automated data scraping of researcher profiles, launch cross-site script injections, or cheat on modular checkup exams by utilizing automated quiz-solving bots.
              </p>
            </div>

          </div>

          {/* Contact relations callout */}
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Need legal clarification?</h4>
              <p className="text-[11px] text-slate-500 mt-1">Contact our administration team at office@healix-technologies.com.</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
