"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Check, AlertCircle } from "lucide-react";
import { HealixUser } from "@/lib/auth";

interface ContactClientProps {
  currentUser: HealixUser | null;
}

export default function ContactClient({ currentUser }: ContactClientProps) {
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError("Please fill out all fields.");
      return;
    }
    setSending(true);
    setError("");

    // Simulate sending contact message
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setSubject("");
      setMessage("");
    }, 1200);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
      

      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-research-blue tracking-tight">
          Contact Academic Relations
        </h1>
        <p className="text-sm text-slate-500 mt-3 max-w-md mx-auto leading-relaxed">
          Have partnership inquiries, fellowship concerns, or technical support requests? Leave our team a message.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        
        {/* Info Column (5 cols) */}
        <div className="md:col-span-5 bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-heading text-research-blue">Healix Headquarters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our academic relations team monitors inquiries between 9:00 AM and 6:00 PM IST, Monday through Friday.
            </p>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary-yellow shrink-0" />
              <span>New Delhi, India</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-accent-blue shrink-0" />
              <span>relations@healix.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary-yellow shrink-0" />
              <span>+91 11 4050 XXXX</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500">
            Healix Technologies Pvt. Ltd. <br />
            Corporate Identity Number: U72900DL2026PTCXXXXXX
          </div>
        </div>

        {/* Form Column (7 cols) */}
        <div className="md:col-span-7 bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 p-6 md:p-8 rounded-3xl shadow-sm">
          
          {success && (
            <div className="bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 text-xs p-3.5 rounded-xl flex items-center space-x-2 mb-6">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Inquiry received! We will follow up via email.</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-950/20 border border-rose-900/50 text-rose-400 text-xs p-3.5 rounded-xl flex items-center space-x-2 mb-6">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Verma"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:bg-slate-900 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. you@domain.com"
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:bg-slate-900 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase tracking-wider block">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Research Partnership Proposal"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:bg-slate-900 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase tracking-wider block">Message Details</label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail your request..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:bg-slate-900 transition-all resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/50 text-white font-bold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg shadow-accent-blue/10"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? "Submitting Inquiry..." : "Submit Inquiry"}</span>
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
