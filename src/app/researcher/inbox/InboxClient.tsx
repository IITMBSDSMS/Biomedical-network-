"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, MessageSquare, FileText, HelpCircle,
  Inbox, Check, X, Loader2, Send, ChevronDown, ChevronUp,
  Clock, CheckCircle, AlertCircle, ExternalLink, RefreshCw,
} from "lucide-react";
import { HealixUser } from "@/lib/auth";

interface InboxClientProps { currentUser: HealixUser; }

type TabKey = "all" | "calls" | "messages" | "thesis" | "doubts";

const statusColors: Record<string, string> = {
  PENDING:          "bg-amber-950/30 text-amber-400 border-amber-800/40",
  ACCEPTED:         "bg-emerald-950/30 text-emerald-400 border-emerald-800/40",
  REJECTED:         "bg-rose-950/30 text-rose-400 border-rose-800/40",
  COMPLETED:        "bg-blue-950/30 text-blue-400 border-blue-800/40",
  OPEN:             "bg-violet-950/30 text-violet-400 border-violet-800/40",
  ANSWERED:         "bg-emerald-950/30 text-emerald-400 border-emerald-800/40",
  CLOSED:           "bg-slate-800/60 text-slate-400 border-slate-700/40",
  REVIEWING:        "bg-blue-950/30 text-blue-400 border-blue-800/40",
  APPROVED:         "bg-emerald-950/30 text-emerald-400 border-emerald-800/40",
  REVISION_NEEDED:  "bg-orange-950/30 text-orange-400 border-orange-800/40",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function Avatar({ name, email }: { name?: string; email?: string }) {
  const initials = (name || email || "?").split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue/30 to-violet-600/20 border border-slate-700 flex items-center justify-center shrink-0">
      <span className="text-xs font-bold text-slate-200">{initials}</span>
    </div>
  );
}

// ── Card components ───────────────────────────────────────────────────────────

function ConnectionCard({ item, onAction }: { item: any; onAction: () => void }) {
  const [loading, setLoading] = useState(false);

  const act = async (status: string) => {
    setLoading(true);
    try {
      await fetch("/api/ecosystem/connect", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status }),
      });
      onAction();
    } finally { setLoading(false); }
  };

  const isCall = item.type === "CALL";
  const Icon = isCall ? Phone : MessageSquare;
  const color = isCall ? "text-violet-400" : "text-blue-400";
  const borderColor = isCall ? "border-violet-800/30" : "border-blue-800/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className={`bg-[#0B0F19]/70 border ${borderColor} rounded-2xl p-5 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <Avatar name={item.studentName} email={item.studentEmail} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              <span className="text-xs font-bold text-white">{item.studentName || item.studentEmail}</span>
              <span className={`text-[9px] font-bold uppercase border px-1.5 py-0.5 rounded ${statusColors[item.status] || ""}`}>{item.status}</span>
            </div>
            <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeAgo(item.createdAt)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{item.studentEmail}</p>
          {item.subject && <p className="text-xs font-semibold text-slate-200 mt-2">{item.subject}</p>}
          {item.message && <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{item.message}</p>}
          {isCall && item.scheduledAt && (
            <p className="text-[10px] text-violet-400 mt-1.5 font-semibold">
              📅 Preferred: {new Date(item.scheduledAt).toLocaleString()}
            </p>
          )}
          {item.status === "PENDING" && (
            <div className="flex gap-2 mt-3">
              <button
                disabled={loading}
                onClick={() => act("ACCEPTED")}
                className="flex items-center gap-1 text-[11px] font-bold bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-800/50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Accept
              </button>
              <button
                disabled={loading}
                onClick={() => act("REJECTED")}
                className="flex items-center gap-1 text-[11px] font-bold bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 border border-rose-800/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-3 h-3" /> Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DoubtCard({ item, onAction }: { item: any; onAction: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/ecosystem/doubts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, answer }),
      });
      onAction();
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#0B0F19]/70 border border-emerald-800/25 rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <Avatar name={item.studentName} email={item.studentEmail} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-white">{item.studentName || item.studentEmail}</span>
              <span className={`text-[9px] font-bold uppercase border px-1.5 py-0.5 rounded ${statusColors[item.status] || ""}`}>{item.status}</span>
            </div>
            <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeAgo(item.createdAt)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{item.studentEmail}</p>
          <p className="text-xs font-bold text-slate-100 mt-2">{item.title}</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{item.description}</p>

          {item.answer && (
            <div className="mt-3 bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Your Answer</p>
              <p className="text-xs text-slate-300 leading-relaxed">{item.answer}</p>
            </div>
          )}

          {item.status === "OPEN" && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {expanded ? "Close answer form" : "Answer this doubt"}
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    <textarea
                      rows={4}
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your detailed answer here..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                    <button
                      disabled={loading || !answer.trim()}
                      onClick={submit}
                      className="flex items-center gap-1.5 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900/40 text-white px-4 py-2 rounded-lg transition-all cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      Submit Answer
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ThesisCard({ item, onAction }: { item: any; onAction: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [reviewStatus, setReviewStatus] = useState("APPROVED");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await fetch("/api/ecosystem/thesis", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status: reviewStatus, feedback }),
      });
      onAction();
    } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="bg-[#0B0F19]/70 border border-amber-800/25 rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <Avatar name={item.studentName} email={item.studentEmail} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-white">{item.studentName || item.studentEmail}</span>
              <span className={`text-[9px] font-bold uppercase border px-1.5 py-0.5 rounded ${statusColors[item.status] || ""}`}>{item.status}</span>
            </div>
            <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {timeAgo(item.createdAt)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{item.studentEmail}</p>
          <p className="text-xs font-bold text-slate-100 mt-2">{item.title}</p>
          {item.chapter && <p className="text-[10px] text-amber-400 font-semibold mt-0.5">{item.chapter}</p>}
          {item.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>}
          {item.fileUrl && (
            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-blue-400 hover:underline"
            >
              <ExternalLink className="w-3 h-3" /> View Document
            </a>
          )}
          {item.feedback && (
            <div className="mt-3 bg-amber-950/20 border border-amber-900/30 rounded-xl p-3">
              <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Your Feedback</p>
              <p className="text-xs text-slate-300 leading-relaxed">{item.feedback}</p>
            </div>
          )}
          {item.status === "PENDING" && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {expanded ? "Close review form" : "Review this submission"}
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    <select
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="APPROVED">✅ Approved</option>
                      <option value="REVIEWING">🔍 Reviewing</option>
                      <option value="REVISION_NEEDED">🔄 Revision Needed</option>
                    </select>
                    <textarea
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Add your detailed feedback for the student..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 resize-none"
                    />
                    <button
                      disabled={loading}
                      onClick={submit}
                      className="flex items-center gap-1.5 text-[11px] font-bold bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900/40 text-white px-4 py-2 rounded-lg transition-all cursor-pointer"
                    >
                      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                      Submit Review
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Main InboxClient ──────────────────────────────────────────────────────────

export default function InboxClient({ currentUser }: InboxClientProps) {
  const [tab, setTab] = useState<TabKey>("all");
  const [data, setData] = useState<{ connections: any[]; doubts: any[]; thesis: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInbox = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/ecosystem/inbox");
      if (!res.ok) throw new Error("Failed to load inbox");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInbox(); }, []);

  const calls    = data?.connections.filter((c) => c.type === "CALL")    || [];
  const messages = data?.connections.filter((c) => c.type === "MESSAGE") || [];
  const doubts   = data?.doubts   || [];
  const thesis   = data?.thesis   || [];
  const all      = [
    ...calls.map((c) => ({ ...c, _kind: "CALL" })),
    ...messages.map((c) => ({ ...c, _kind: "MESSAGE" })),
    ...doubts.map((d) => ({ ...d, _kind: "DOUBT" })),
    ...thesis.map((t) => ({ ...t, _kind: "THESIS" })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const TABS: { key: TabKey; label: string; count: number; icon: any; color: string }[] = [
    { key: "all",      label: "All",      count: all.length,      icon: Inbox,          color: "text-white" },
    { key: "calls",    label: "Calls",    count: calls.length,    icon: Phone,          color: "text-violet-400" },
    { key: "messages", label: "Messages", count: messages.length, icon: MessageSquare,  color: "text-blue-400" },
    { key: "thesis",   label: "Thesis",   count: thesis.length,   icon: FileText,       color: "text-amber-400" },
    { key: "doubts",   label: "Doubts",   count: doubts.length,   icon: HelpCircle,     color: "text-emerald-400" },
  ];

  const renderItems = (items: any[]) => {
    if (!items.length)
      return (
        <div className="bg-[#0B0F19]/30 border border-dashed border-slate-800/80 rounded-2xl p-10 text-center">
          <Inbox className="w-8 h-8 text-slate-700 mx-auto mb-3" />
          <p className="text-xs text-slate-500">Nothing here yet.</p>
        </div>
      );

    return (
      <div className="space-y-3">
        {items.map((item) => {
          const kind = item._kind || item.type || (item.title && item.description && !item.chapter ? "DOUBT" : "THESIS");
          if (kind === "CALL" || kind === "MESSAGE")
            return <ConnectionCard key={item.id} item={item} onAction={fetchInbox} />;
          if (kind === "DOUBT")
            return <DoubtCard key={item.id} item={item} onAction={fetchInbox} />;
          return <ThesisCard key={item.id} item={item} onAction={fetchInbox} />;
        })}
      </div>
    );
  };

  const currentItems = () => {
    if (tab === "all")      return all;
    if (tab === "calls")    return calls.map((c) => ({ ...c, _kind: "CALL" }));
    if (tab === "messages") return messages.map((c) => ({ ...c, _kind: "MESSAGE" }));
    if (tab === "thesis")   return thesis.map((t) => ({ ...t, _kind: "THESIS" }));
    if (tab === "doubts")   return doubts.map((d) => ({ ...d, _kind: "DOUBT" }));
    return [];
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-research-blue">
            Researcher Inbox
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            All student connections, doubts &amp; thesis updates in one place
          </p>
        </div>
        <button
          onClick={fetchInbox}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/60 px-4 py-2 rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border transition-all cursor-pointer ${
                tab === t.key
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-slate-900/40 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab === t.key ? t.color : ""}`} />
              {t.label}
              {t.count > 0 && (
                <span className={`ml-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  tab === t.key ? "bg-accent-blue/20 text-accent-blue" : "bg-slate-800 text-slate-400"
                }`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/20 border border-rose-900/40 rounded-xl p-4 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-7 h-7 text-accent-blue animate-spin" />
          <p className="text-xs text-slate-500">Loading your inbox...</p>
        </div>
      ) : (
        renderItems(currentItems())
      )}
    </div>
  );
}
