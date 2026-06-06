"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, MessageSquare, FileText, HelpCircle,
  X, Send, Check, AlertCircle, Loader2, Calendar,
  Link as LinkIcon,
} from "lucide-react";
import { HealixUser } from "@/lib/auth";

interface ConnectPanelProps {
  researcher: any;
  currentUser: HealixUser;
}

type ModalType = "CALL" | "MESSAGE" | "THESIS" | "DOUBT" | null;

const ACTIONS = [
  {
    type: "CALL" as const,
    icon: Phone,
    label: "Request a Call",
    sublabel: "Schedule a 1-on-1 session",
    gradient: "from-violet-500/20 to-purple-600/10",
    border: "border-violet-700/40 hover:border-violet-500/60",
    iconColor: "text-violet-400",
    glow: "shadow-violet-900/20",
  },
  {
    type: "MESSAGE" as const,
    icon: MessageSquare,
    label: "Send a Message",
    sublabel: "Start an async conversation",
    gradient: "from-blue-500/20 to-cyan-600/10",
    border: "border-blue-700/40 hover:border-blue-500/60",
    iconColor: "text-blue-400",
    glow: "shadow-blue-900/20",
  },
  {
    type: "THESIS" as const,
    icon: FileText,
    label: "Submit Thesis Update",
    sublabel: "Share progress for review",
    gradient: "from-amber-500/20 to-yellow-600/10",
    border: "border-amber-700/40 hover:border-amber-500/60",
    iconColor: "text-amber-400",
    glow: "shadow-amber-900/20",
  },
  {
    type: "DOUBT" as const,
    icon: HelpCircle,
    label: "Ask a Doubt",
    sublabel: "Get expert academic guidance",
    gradient: "from-emerald-500/20 to-teal-600/10",
    border: "border-emerald-700/40 hover:border-emerald-500/60",
    iconColor: "text-emerald-400",
    glow: "shadow-emerald-900/20",
  },
];

export default function ConnectPanel({ researcher, currentUser }: ConnectPanelProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Call fields
  const [callSubject, setCallSubject] = useState("");
  const [callMessage, setCallMessage] = useState("");
  const [callSchedule, setCallSchedule] = useState("");

  // Message fields
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");

  // Thesis fields
  const [thesisTitle, setThesisTitle] = useState("");
  const [thesisChapter, setThesisChapter] = useState("");
  const [thesisDesc, setThesisDesc] = useState("");
  const [thesisFile, setThesisFile] = useState("");

  // Doubt fields
  const [doubtTitle, setDoubtTitle] = useState("");
  const [doubtDesc, setDoubtDesc] = useState("");

  const reset = () => {
    setSaving(false); setSuccess(false); setError("");
    setCallSubject(""); setCallMessage(""); setCallSchedule("");
    setMsgSubject(""); setMsgBody("");
    setThesisTitle(""); setThesisChapter(""); setThesisDesc(""); setThesisFile("");
    setDoubtTitle(""); setDoubtDesc("");
  };

  const openModal = (type: ModalType) => { reset(); setActiveModal(type); };
  const closeModal = () => { reset(); setActiveModal(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");

    try {
      let res: Response;

      if (activeModal === "CALL" || activeModal === "MESSAGE") {
        res = await fetch("/api/ecosystem/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            researcherId: researcher.id,
            type: activeModal,
            subject: activeModal === "CALL" ? callSubject : msgSubject,
            message: activeModal === "CALL" ? callMessage : msgBody,
            scheduledAt: activeModal === "CALL" ? callSchedule || undefined : undefined,
          }),
        });
      } else if (activeModal === "DOUBT") {
        res = await fetch("/api/ecosystem/doubts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            researcherId: researcher.id,
            title: doubtTitle,
            description: doubtDesc,
          }),
        });
      } else {
        res = await fetch("/api/ecosystem/thesis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            researcherId: researcher.id,
            title: thesisTitle,
            description: thesisDesc,
            chapter: thesisChapter || undefined,
            fileUrl: thesisFile || undefined,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setSuccess(true);
      setTimeout(() => closeModal(), 2200);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const modalTitles: Record<string, string> = {
    CALL: "Request a Call",
    MESSAGE: "Send a Message",
    THESIS: "Submit Thesis Update",
    DOUBT: "Ask a Doubt",
  };

  return (
    <>
      {/* Connect Panel Card */}
      <div className="bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-bold text-white font-heading">
              Connect with {researcher.fullName.split(" ")[0]}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Choose how you'd like to interact with this researcher
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue bg-blue-950/30 border border-blue-900/40 px-2.5 py-1 rounded-full">
            Open to Connect
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.type}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openModal(action.type)}
                className={`
                  relative flex flex-col items-center text-center p-4 rounded-2xl border
                  bg-gradient-to-br ${action.gradient} ${action.border}
                  transition-all duration-200 cursor-pointer group shadow-lg ${action.glow}
                `}
              >
                <div className={`p-2.5 rounded-xl bg-slate-900/60 mb-2.5 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-4 h-4 ${action.iconColor}`} />
                </div>
                <p className="text-[11px] font-bold text-slate-200 leading-tight">{action.label}</p>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">{action.sublabel}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                  {activeModal === "CALL" && <Phone className="w-4 h-4 text-violet-400" />}
                  {activeModal === "MESSAGE" && <MessageSquare className="w-4 h-4 text-blue-400" />}
                  {activeModal === "THESIS" && <FileText className="w-4 h-4 text-amber-400" />}
                  {activeModal === "DOUBT" && <HelpCircle className="w-4 h-4 text-emerald-400" />}
                  {modalTitles[activeModal]}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* To: researcher pill */}
              <div className="flex items-center space-x-2 mb-5 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-2">
                <img
                  src={researcher.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${researcher.fullName}`}
                  alt={researcher.fullName}
                  className="w-6 h-6 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-none">To</p>
                  <p className="text-xs font-bold text-slate-200">{researcher.fullName}</p>
                </div>
                {researcher.institutionName && (
                  <span className="ml-auto text-[9px] text-slate-500 font-semibold">{researcher.institutionName}</span>
                )}
              </div>

              {/* Status banners */}
              {error && (
                <div className="flex items-center space-x-2 text-xs text-rose-400 bg-rose-950/20 border border-rose-900/40 rounded-xl p-3 mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-3 mb-4">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Sent successfully! {researcher.fullName} will be notified.</span>
                </div>
              )}

              {/* Form */}
              {!success && (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-300">

                  {/* CALL form */}
                  {activeModal === "CALL" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wider block">Purpose / Subject *</label>
                        <input
                          required
                          value={callSubject}
                          onChange={(e) => setCallSubject(e.target.value)}
                          placeholder="e.g. Discuss my research proposal"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" /> Preferred Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={callSchedule}
                          onChange={(e) => setCallSchedule(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-violet-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wider block">Additional Context</label>
                        <textarea
                          rows={3}
                          value={callMessage}
                          onChange={(e) => setCallMessage(e.target.value)}
                          placeholder="Share any background info that would help the researcher prepare..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* MESSAGE form */}
                  {activeModal === "MESSAGE" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wider block">Subject *</label>
                        <input
                          required
                          value={msgSubject}
                          onChange={(e) => setMsgSubject(e.target.value)}
                          placeholder="e.g. Collaboration opportunity"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wider block">Message *</label>
                        <textarea
                          required
                          rows={5}
                          value={msgBody}
                          onChange={(e) => setMsgBody(e.target.value)}
                          placeholder="Write your message here..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* THESIS form */}
                  {activeModal === "THESIS" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wider block">Thesis Title *</label>
                        <input
                          required
                          value={thesisTitle}
                          onChange={(e) => setThesisTitle(e.target.value)}
                          placeholder="e.g. CRISPR-Based Gene Therapy for Type 1 Diabetes"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-bold uppercase tracking-wider block">Chapter / Section</label>
                          <input
                            value={thesisChapter}
                            onChange={(e) => setThesisChapter(e.target.value)}
                            placeholder="e.g. Chapter 3"
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 block">
                            <LinkIcon className="w-3 h-3" /> File / Drive URL
                          </label>
                          <input
                            type="url"
                            value={thesisFile}
                            onChange={(e) => setThesisFile(e.target.value)}
                            placeholder="https://drive.google.com/..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wider block">Progress Summary *</label>
                        <textarea
                          required
                          rows={4}
                          value={thesisDesc}
                          onChange={(e) => setThesisDesc(e.target.value)}
                          placeholder="Describe your latest progress, key findings, and what feedback you need..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* DOUBT form */}
                  {activeModal === "DOUBT" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wider block">Question Title *</label>
                        <input
                          required
                          value={doubtTitle}
                          onChange={(e) => setDoubtTitle(e.target.value)}
                          placeholder="e.g. How does off-target CRISPR editing get quantified?"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-400 font-bold uppercase tracking-wider block">Detailed Description *</label>
                        <textarea
                          required
                          rows={5}
                          value={doubtDesc}
                          onChange={(e) => setDoubtDesc(e.target.value)}
                          placeholder="Explain your doubt in detail. Include any relevant context, what you've already tried, and exactly where you're stuck..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-2">
                    <p className="text-[10px] text-slate-600 flex items-center gap-1">
                      Sending as <span className="text-slate-400 font-semibold">{currentUser.name || currentUser.email}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="text-xs font-semibold text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-1.5 text-xs font-bold bg-accent-blue hover:bg-blue-600 disabled:bg-accent-blue/50 text-white px-5 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        {saving ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
