"use client";

import React from "react";
import { 
  Megaphone, 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Gift, 
  ArrowRight, 
  Printer 
} from "lucide-react";

export default function AmbassadorPosterPage() {
  const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://biomedical-network.vercel.app/chapters";

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-10 px-4 text-slate-900 font-sans">
      {/* Google Fonts link for Great Vibes handwriting style */}
      <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@800;900&display=swap" rel="stylesheet" />

      {/* Print Trigger Button */}
      <div className="mb-6 w-full max-w-[800px] flex justify-between items-center no-print">
        <div className="text-white text-xs font-bold uppercase tracking-wider">
          Ambassador Program Poster (Print-Ready)
        </div>
        <button
          onClick={() => window.print()}
          className="bg-emerald-650 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-emerald-950/20"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Poster Page Body */}
      <div className="w-[800px] h-[1130px] bg-white relative p-12 shadow-2xl flex flex-col justify-between overflow-hidden border border-slate-200" id="poster-root">
        
        {/* Dynamic Curved Shapes and Decorative Lines (Top Right Corner) */}
        <div className="absolute top-0 right-0 w-[420px] h-[260px] pointer-events-none z-0">
          <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full object-cover">
            <path d="M120 0C250 140 320 180 420 120V0H120Z" fill="#0D2329" />
            <path d="M0 0C150 160 250 210 420 150V0H0Z" fill="#0A1F26" opacity="0.9" />
            <path d="M50 0C180 180 270 230 420 180" stroke="#3B8E3E" strokeWidth="6" strokeDasharray="12 6" />
          </svg>
        </div>

        {/* Faint biological vector outlines overlaying the dark shape */}
        <div className="absolute top-8 right-16 w-48 h-24 pointer-events-none opacity-20 z-10 flex items-center justify-around text-white">
          <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-current" fill="none" strokeWidth="2">
            <path d="M20,40 C40,40 40,60 60,60 C80,60 80,40 100,40 M20,60 C40,60 40,40 60,40 C80,40 80,60 100,60" />
            <circle cx="20" cy="40" r="3" fill="currentColor" />
            <circle cx="20" cy="60" r="3" fill="currentColor" />
            <circle cx="60" cy="40" r="3" fill="currentColor" />
            <circle cx="60" cy="60" r="3" fill="currentColor" />
            <line x1="20" y1="40" x2="20" y2="60" />
            <line x1="40" y1="40" x2="40" y2="60" />
            <line x1="60" y1="40" x2="60" y2="60" />
            <line x1="80" y1="40" x2="80" y2="60" />
          </svg>
          <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-current" fill="none" strokeWidth="2">
            <circle cx="50" cy="50" r="30" />
            <circle cx="50" cy="20" r="5" fill="currentColor" />
            <circle cx="80" cy="50" r="5" fill="currentColor" />
            <circle cx="50" cy="80" r="5" fill="currentColor" />
            <circle cx="20" cy="50" r="5" fill="currentColor" />
          </svg>
        </div>

        {/* Header Section */}
        <div className="relative z-10 flex justify-between items-start">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">
              <img src="/logo.png" alt="Healix BioLabs" className="w-9 h-9 rounded-full object-cover" />
            </div>
            <div>
              <div className="text-xl font-heading font-black tracking-tight text-[#0D2329] uppercase">
                BIO <span className="text-[#3B8E3E]">LABS</span>
              </div>
              <div className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
                Next Gen. Bio Solutions.
              </div>
            </div>
          </div>

          {/* Curved Badge */}
          <div className="w-32 h-32 absolute top-2 right-4 flex items-center justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center border border-slate-100 shadow-md text-center p-2 rotate-12">
              <span className="text-[7px] font-extrabold uppercase tracking-widest text-[#0D2329]">Represent.</span>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#3B8E3E] my-0.5">Lead.</span>
              <span className="text-[7px] font-extrabold uppercase tracking-widest text-[#0D2329]">Impact.</span>
            </div>
          </div>
        </div>

        {/* Main Content: Heading & Student Image */}
        <div className="grid grid-cols-12 gap-6 items-center my-6 relative z-10">
          {/* Left Column: Headings & Text */}
          <div className="col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="text-[40px] font-black text-[#3B8E3E] tracking-tight leading-[1.02] uppercase font-heading" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                BIO LABS
              </div>
              <div className="text-[36px] font-black text-[#0D2329] tracking-tight leading-[1.02] uppercase font-heading" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                CAMPUS
              </div>
              <div className="text-[36px] font-black text-[#0D2329] tracking-tight leading-[1.02] uppercase font-heading" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                AMBASSADOR
              </div>
              {/* Handwriting font for 'Program' */}
              <div 
                className="text-5xl font-extrabold text-[#3B8E3E] lowercase -mt-3 ml-2"
                style={{ fontFamily: "'Great Vibes', cursive, sans-serif" }}
              >
                program
              </div>
            </div>

            <div className="border-l-4 border-[#3B8E3E] pl-3 py-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-[#0D2329] leading-tight">
                Be the Voice.
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#3B8E3E] leading-tight my-0.5">
                Inspire Change.
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#0D2329] leading-tight">
                Build the Future.
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-semibold pr-4">
              Join a community of passionate students driving innovation, spreading awareness, and making an impact in the world of biotechnology.
            </p>
          </div>

          {/* Right Column: Students Photo */}
          <div className="col-span-5 relative flex justify-end">
            <div className="w-[280px] h-[280px] rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-slate-300/45 relative z-10 rotate-[-2deg]">
              <img 
                src="/ambassador_students.png" 
                alt="Ambassador Students" 
                className="w-full h-full object-cover" 
              />
            </div>
            {/* Background geometric design behind photo */}
            <div className="absolute -bottom-4 -left-4 w-[265px] h-[265px] border-2 border-dashed border-[#3B8E3E]/60 rounded-3xl z-0 rotate-[4deg]" />
          </div>
        </div>

        {/* Middle Section: WHAT YOU'LL DO */}
        <div className="bg-[#0D2329] rounded-3xl p-6 text-white relative z-10 shadow-lg">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#3B8E3E] mb-4 text-center">
            What You&apos;ll Do
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center space-y-2 border-r border-slate-800/80 pr-2">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-[#3B8E3E] mx-auto border border-[#3B8E3E]/20">
                <Megaphone className="w-5 h-5" />
              </div>
              <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-100">Promote BIO LABS</h4>
              <p className="text-[8px] text-slate-400 leading-normal font-semibold">Spread awareness about our mission, products &amp; events.</p>
            </div>

            <div className="text-center space-y-2 border-r border-slate-800/80 px-2">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-[#3B8E3E] mx-auto border border-[#3B8E3E]/20">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-100">Build Connections</h4>
              <p className="text-[8px] text-slate-400 leading-normal font-semibold">Engage with peers, faculty &amp; industry professionals.</p>
            </div>

            <div className="text-center space-y-2 border-r border-slate-800/80 px-2">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-[#3B8E3E] mx-auto border border-[#3B8E3E]/20">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-100">Host Events</h4>
              <p className="text-[8px] text-slate-400 leading-normal font-semibold">Plan exciting activities, workshops &amp; initiatives.</p>
            </div>

            <div className="text-center space-y-2 pl-2">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-[#3B8E3E] mx-auto border border-[#3B8E3E]/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-[9px] font-black uppercase tracking-wider text-slate-100">Grow &amp; Learn</h4>
              <p className="text-[8px] text-slate-400 leading-normal font-semibold">Enhance leadership, communication &amp; team skills.</p>
            </div>
          </div>
        </div>

        {/* Columns Section */}
        <div className="grid grid-cols-2 gap-8 my-4 relative z-10">
          {/* Who can apply */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
              <div className="w-6 h-6 bg-[#3B8E3E]/10 rounded-full flex items-center justify-center text-[#3B8E3E]">
                <Users className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0D2329]">Who Can Apply?</h3>
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2 text-[10px] text-slate-700 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-[#3B8E3E] shrink-0" />
                <span>Passionate &amp; driven university students</span>
              </li>
              <li className="flex items-center space-x-2 text-[10px] text-slate-700 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-[#3B8E3E] shrink-0" />
                <span>Strong communication and leadership skills</span>
              </li>
              <li className="flex items-center space-x-2 text-[10px] text-slate-700 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-[#3B8E3E] shrink-0" />
                <span>Interest in biotechnology, innovation &amp; science</span>
              </li>
              <li className="flex items-center space-x-2 text-[10px] text-slate-700 font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-[#3B8E3E] shrink-0" />
                <span>Eager to lead and build local campus clubs</span>
              </li>
            </ul>
          </div>

          {/* What you get */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
              <div className="w-6 h-6 bg-[#3B8E3E]/10 rounded-full flex items-center justify-center text-[#3B8E3E]">
                <Gift className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#0D2329]">What You Get</h3>
            </div>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2 text-[10px] text-slate-700 font-bold">
                <Gift className="w-3.5 h-3.5 text-[#3B8E3E] shrink-0" />
                <span>Certificate of Recognition as Ambassador</span>
              </li>
              <li className="flex items-center space-x-2 text-[10px] text-slate-700 font-bold">
                <Gift className="w-3.5 h-3.5 text-[#3B8E3E] shrink-0" />
                <span>Exclusive BIO LABS Branded Merchandise</span>
              </li>
              <li className="flex items-center space-x-2 text-[10px] text-slate-700 font-bold">
                <Gift className="w-3.5 h-3.5 text-[#3B8E3E] shrink-0" />
                <span>Mentorship &amp; Premium Networking Events</span>
              </li>
              <li className="flex items-center space-x-2 text-[10px] text-slate-700 font-bold">
                <Gift className="w-3.5 h-3.5 text-[#3B8E3E] shrink-0" />
                <span>Real-world Internship and Project Exposure</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Area with QR Code */}
        <div className="border-t border-slate-100 pt-6 relative z-10">
          <div className="flex justify-between items-center bg-[#F8FAFC] border border-slate-200 p-4 rounded-2xl">
            {/* CTA Button Block */}
            <div className="bg-[#3B8E3E] text-white flex items-center space-x-3 px-4 py-3.5 rounded-xl font-heading font-black text-[11px] uppercase tracking-wider cursor-pointer hover:bg-[#3B8E3E]/90 transition-all select-none">
              <span>Ready to Lead the Change?</span>
              <ArrowRight className="w-4 h-4" />
            </div>

            {/* Apply Message */}
            <div className="flex-1 px-4">
              <div className="text-[10px] font-black uppercase tracking-wider text-[#0D2329]">Apply Now!</div>
              <div className="text-[8px] font-semibold text-slate-500 mt-0.5">
                Scan the QR code to load the Ambassador Application form and launch your campus division.
              </div>
            </div>

            {/* QR Code Graphic */}
            <div className="flex flex-col items-center shrink-0 bg-white border border-slate-200 p-2 rounded-xl text-center">
              <img src={qrCodeUrl} alt="Scan to Apply" className="w-[64px] h-[64px]" />
              <span className="text-[6px] font-black uppercase tracking-widest text-[#0D2329] mt-1.5 block">
                Scan To Apply
              </span>
            </div>
          </div>

          {/* Social Links Subbar */}
          <div className="flex justify-between items-center mt-4 text-[8px] text-slate-500 border-t border-slate-100 pt-3">
            <div className="flex items-center space-x-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#3B8E3E]"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              <span className="font-bold text-slate-600">@biolabs.inc</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#3B8E3E]"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              <span className="font-bold text-slate-600">BIO LABS</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#3B8E3E]"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <span className="font-bold text-slate-600">www.biolabs.com</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-[#3B8E3E]"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <span className="font-bold text-slate-600">hello@biolabs.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS Style tag for Print Mode overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          #poster-root {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 10mm !important;
            width: 100% !important;
            height: 100% !important;
            page-break-after: avoid;
            page-break-before: avoid;
          }
        }
      `}} />
    </div>
  );
}
