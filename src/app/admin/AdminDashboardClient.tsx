"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, FileText, FolderGit2, GraduationCap, ShieldCheck, Check, X, ShieldAlert, Award, Calendar, RefreshCw, Mail, Clipboard, Send, Video, ImageIcon, Upload, Link as LinkIcon, Loader2, ExternalLink, Building, Flag, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdminDashboardProps {
  initialResearchers: any[];
  initialPublications: any[];
  initialFellowshipApplications: any[];
  initialEmailLogs: any[];
  initialAmbassadorApplications: any[];
  projectCount: number;
}

const formatStableTime = (dateInput: Date | string) => {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
};

export default function AdminDashboardClient({
  initialResearchers,
  initialPublications,
  initialFellowshipApplications,
  initialEmailLogs,
  initialAmbassadorApplications,
  projectCount,
}: AdminDashboardProps) {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"researchers" | "publications" | "fellowships" | "emails" | "video" | "chapters" | "ambassadors">("researchers");
  
  // Data lists (in local state so toggle actions react immediately)
  const [researchers, setResearchers] = useState(initialResearchers);
  const [publications, setPublications] = useState(initialPublications);
  const [fellowships, setFellowships] = useState(initialFellowshipApplications);
  const [emailLogs, setEmailLogs] = useState(initialEmailLogs);
  const [ambassadors, setAmbassadors] = useState(initialAmbassadorApplications);
  
  // States
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // ============================================================
  // CMS: Video & Chapter Photos State
  // ============================================================
  const [cmsConfig, setCmsConfig] = useState<any>(null);
  const [cmsLoading, setCmsLoading] = useState(false);

  // Video section state
  const [videoYoutubeUrl, setVideoYoutubeUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoSubtitle, setVideoSubtitle] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoCoverFile, setVideoCoverFile] = useState<File | null>(null);
  const [videoCoverPreview, setVideoCoverPreview] = useState("");
  const [videoUploading, setVideoUploading] = useState(false);

  // Chapter photos state
  const [chapterUploadingId, setChapterUploadingId] = useState<string | null>(null);
  const [chapterPreviews, setChapterPreviews] = useState<Record<string, string>>({});
  const [chapterFiles, setChapterFiles] = useState<Record<string, File>>({});
  const videoFileRef = useRef<HTMLInputElement>(null);
  const chapterFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Drag-and-drop state
  const [isDragOverVideo, setIsDragOverVideo] = useState(false);
  const [isDragOverChapter, setIsDragOverChapter] = useState<string | null>(null);

  // Load CMS config on mount
  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(data => {
        setCmsConfig(data);
        setVideoYoutubeUrl(data.videoSection?.youtubeUrl || "");
        setVideoTitle(data.videoSection?.title || "");
        setVideoSubtitle(data.videoSection?.subtitle || "");
        setVideoDuration(data.videoSection?.duration || "");
        setVideoCoverPreview(data.videoSection?.coverImage || "");
      })
      .catch(console.error);
  }, []);

  // Handle video cover file selection
  const handleVideoCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoCoverFile(file);
    setVideoCoverPreview(URL.createObjectURL(file));
  };

  // Drag-and-drop for video cover
  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverVideo(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      triggerToast("Please drop an image file.", "error");
      return;
    }
    setVideoCoverFile(file);
    setVideoCoverPreview(URL.createObjectURL(file));
  };

  // Drag-and-drop for chapter photo
  const handleChapterDrop = (chapterId: string, e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverChapter(null);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      triggerToast("Please drop an image file.", "error");
      return;
    }
    setChapterFiles(prev => ({ ...prev, [chapterId]: file }));
    setChapterPreviews(prev => ({ ...prev, [chapterId]: URL.createObjectURL(file) }));
  };

  // Handle chapter photo selection
  const handleChapterPhotoSelect = (chapterId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setChapterFiles(prev => ({ ...prev, [chapterId]: file }));
    setChapterPreviews(prev => ({ ...prev, [chapterId]: URL.createObjectURL(file) }));
  };

  // Upload video cover image
  const handleUploadVideoCover = async () => {
    if (!videoCoverFile) return;
    setVideoUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", videoCoverFile);
      fd.append("type", "video-cover");
      const res = await fetch("/api/admin/upload-media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setCmsConfig((prev: any) => ({ ...prev, videoSection: { ...prev?.videoSection, coverImage: data.url } }));
      setVideoCoverFile(null);
      triggerToast("Video cover image updated successfully.");
    } catch (err: any) {
      triggerToast(err.message || "Upload failed.", "error");
    } finally {
      setVideoUploading(false);
    }
  };

  // Save YouTube URL + metadata
  const handleSaveVideoMeta = async () => {
    setCmsLoading(true);
    try {
      const fd = new FormData();
      fd.append("type", "video-url-update");
      fd.append("youtubeUrl", videoYoutubeUrl);
      fd.append("title", videoTitle);
      fd.append("subtitle", videoSubtitle);
      fd.append("duration", videoDuration);
      const res = await fetch("/api/admin/upload-media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      triggerToast("Video metadata saved successfully.");
    } catch (err: any) {
      triggerToast(err.message || "Save failed.", "error");
    } finally {
      setCmsLoading(false);
    }
  };

  // Upload chapter photo
  const handleUploadChapterPhoto = async (chapterId: string) => {
    const file = chapterFiles[chapterId];
    if (!file) return;
    setChapterUploadingId(chapterId);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "chapter-photo");
      fd.append("chapterId", chapterId);
      const res = await fetch("/api/admin/upload-media", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setCmsConfig((prev: any) => ({
        ...prev,
        chapters: { ...prev?.chapters, [chapterId]: { image: data.url } }
      }));
      setChapterFiles(prev => { const n = { ...prev }; delete n[chapterId]; return n; });
      triggerToast(`Chapter photo updated successfully.`);
    } catch (err: any) {
      triggerToast(err.message || "Upload failed.", "error");
    } finally {
      setChapterUploadingId(null);
    }
  };

  const CHAPTER_META: Record<string, { name: string; location: string }> = {
    "chap-1": { name: "AIIMS Delhi BioLabs Club", location: "New Delhi" },
    "chap-2": { name: "IIT Delhi GenTech Chapter", location: "New Delhi" },
    "chap-3": { name: "VIT Vellore Bio-Hub", location: "Vellore, Tamil Nadu" },
    "chap-4": { name: "BITS Pilani Bio-Intelligence", location: "Pilani, Rajasthan" },
    "chap-5": { name: "Delhi University Botany & Bio-Computing", location: "Delhi" },
  };

  // 1. Toggle researcher verification
  const handleVerifyResearcher = async (researcherId: string, verify: boolean) => {
    setActionLoading(researcherId);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ researcherId, verify }),
      });

      if (res.ok) {
        setResearchers(
          researchers.map((r) => (r.id === researcherId ? { ...r, isVerified: verify } : r))
        );
        triggerToast(verify ? "Researcher verified successfully." : "Researcher verification revoked.");
      } else {
        triggerToast("Failed to update researcher verification.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("An error occurred.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // 2. Approve/Unapprove publication
  const handleApprovePublication = async (publicationId: string, approve: boolean) => {
    setActionLoading(publicationId);
    try {
      const res = await fetch("/api/admin/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicationId, approve }),
      });

      if (res.ok) {
        setPublications(
          publications.map((p) => (p.id === publicationId ? { ...p, isApproved: approve } : p))
        );
        triggerToast(approve ? "Publication approved and indexing completed." : "Publication approval revoked.");
        // Reload recent email logs dynamically since approval sends congrats emails
        router.refresh();
      } else {
        triggerToast("Failed to update publication status.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("An error occurred.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // 3. Resolve fellowship application
  const handleResolveFellowship = async (applicationId: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(applicationId);
    try {
      const res = await fetch("/api/admin/fellowships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status }),
      });

      if (res.ok) {
        setFellowships(
          fellowships.map((f) => (f.id === applicationId ? { ...f, status } : f))
        );
        triggerToast(`Fellowship application status updated to ${status}.`);
      } else {
        triggerToast("Failed to update fellowship status.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("An error occurred.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // 4. Resolve ambassador application status
  const handleResolveAmbassador = async (applicationId: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(applicationId);
    try {
      const res = await fetch("/api/admin/ambassadors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status }),
      });
      if (res.ok) {
        setAmbassadors(ambassadors.map((a: any) => a.id === applicationId ? { ...a, status } : a));
        triggerToast(`Ambassador application ${status.toLowerCase()} successfully.`);
      } else {
        triggerToast("Failed to update ambassador status.", "error");
      }
    } catch (err) {
      triggerToast("An error occurred.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // 5. Download ambassadors list as PDF
  const handleDownloadAmbassadorsPDF = async () => {
    setActionLoading("pdf");
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const now = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

      // Header bar
      doc.setFillColor(10, 15, 30);
      doc.rect(0, 0, 297, 28, "F");

      // Logo text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(250, 204, 21);
      doc.text("HEALIX BIOLABS", 14, 12);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Biomedical Research Network", 14, 18);

      // Title on right
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(96, 165, 250);
      doc.text("Campus Ambassador Applications", 297 - 14, 12, { align: "right" });
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Generated: ${now}  |  Total: ${ambassadors.length}`, 297 - 14, 18, { align: "right" });

      // Divider
      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.5);
      doc.line(14, 29, 283, 29);

      // Stats row
      const pending = ambassadors.filter((a: any) => a.status === "PENDING").length;
      const approved = ambassadors.filter((a: any) => a.status === "APPROVED").length;
      const rejected = ambassadors.filter((a: any) => a.status === "REJECTED").length;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Pending: ${pending}   Approved: ${approved}   Rejected: ${rejected}`, 14, 36);

      // Table
      autoTable(doc, {
        startY: 41,
        head: [["#", "Full Name", "Email", "College / University", "Degree", "Year", "LinkedIn", "Status", "Applied On"]],
        body: ambassadors.map((a: any, idx: number) => [
          idx + 1,
          a.fullName,
          a.email,
          a.collegeName,
          a.degreeProgram || "—",
          a.yearOfStudy || "—",
          a.linkedin ? a.linkedin.replace("https://linkedin.com/in/", "@") : "—",
          a.status,
          new Date(a.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        ]),
        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 3,
          textColor: [30, 41, 59],
        },
        headStyles: {
          fillColor: [10, 15, 30],
          textColor: [250, 204, 21],
          fontStyle: "bold",
          fontSize: 8,
        },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        columnStyles: {
          0: { halign: "center", cellWidth: 8 },
          6: { cellWidth: 28 },
          7: { halign: "center", cellWidth: 20 },
          8: { halign: "center", cellWidth: 24 },
        },
        didParseCell: (data: any) => {
          if (data.section === "body" && data.column.index === 7) {
            const status = data.cell.raw as string;
            if (status === "APPROVED") data.cell.styles.textColor = [22, 163, 74];
            else if (status === "REJECTED") data.cell.styles.textColor = [220, 38, 38];
            else data.cell.styles.textColor = [100, 116, 139];
            data.cell.styles.fontStyle = "bold";
          }
        },
        margin: { left: 14, right: 14 },
      });

      // Footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(`Healix BioLabs — Confidential  |  Page ${i} of ${pageCount}`, 14, 205);
        doc.text("biomedical-network.vercel.app", 297 - 14, 205, { align: "right" });
      }

      doc.save(`HealixBioLabs_Ambassadors_${Date.now()}.pdf`);
      triggerToast("PDF downloaded successfully!");
    } catch (err: any) {
      triggerToast("PDF generation failed: " + err.message, "error");
    } finally {
      setActionLoading(null);
    }
  };

  // 6. Trigger profile incomplete reminder scan
  const handleTriggerReminders = async () => {
    setActionLoading("reminders");
    try {
      const res = await fetch("/api/admin/trigger-reminders", { method: "POST" });
      if (res.ok) {
        const { count } = await res.json();
        triggerToast(`Scan complete. Dispatched ${count} profile reminders to database email log.`);
        router.refresh(); // Reload database logs
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        triggerToast("Failed to scan and trigger profile reminders.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("An error occurred.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Dynamic Metrics calculations
  const metrics = [
    { label: "Total Researchers", val: researchers.length, icon: <Users className="w-5 h-5 text-primary-yellow" /> },
    { label: "Publications", val: publications.length, icon: <FileText className="w-5 h-5 text-research-blue" /> },
    { label: "Projects", val: projectCount, icon: <FolderGit2 className="w-5 h-5 text-primary-yellow" /> },
    { label: "Fellowship Applications", val: fellowships.length, icon: <GraduationCap className="w-5 h-5 text-research-blue" /> },
    { label: "Ambassador Applications", val: ambassadors.length, icon: <Flag className="w-5 h-5 text-emerald-400" /> },
  ];

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl border text-xs shadow-xl flex items-center space-x-2 ${
              toastType === "success"
                ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900/50"
                : "bg-rose-950/20 text-rose-400 border border-rose-900/50"
            }`}
          >
            {toastType === "success" ? <Check className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4 text-rose-500" />}
            <span className="font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-heading font-extrabold text-research-blue">
            Admin Management Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Oversee researcher verification, article indexing, and application queues.
          </p>
        </div>

        <button
          onClick={handleTriggerReminders}
          disabled={actionLoading === "reminders"}
          className="flex items-center justify-center space-x-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-5 py-3 rounded-full text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-lg shadow-slate-950/20"
        >
          <Send className="w-4 h-4 text-primary-yellow animate-pulse" />
          <span>{actionLoading === "reminders" ? "Scanning..." : "Trigger Profile Reminders"}</span>
        </button>
      </div>

      {/* Numerical Metrics widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {metrics.map((m, idx) => (
          <div
            key={idx}
            className="bg-[#0B0F19]/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm"
          >
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">{m.label}</span>
              <span className="text-2xl font-extrabold font-heading text-research-blue">{m.val}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800">
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column navigation tabs */}
        <div className="lg:col-span-3 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 px-1">Management queues</p>
          {[
            { id: "researchers", label: "Verify Researchers", icon: <Users className="w-4 h-4" /> },
            { id: "publications", label: "Review Publications", icon: <FileText className="w-4 h-4" /> },
            { id: "fellowships", label: "Fellowship Applications", icon: <GraduationCap className="w-4 h-4" /> },
            { id: "ambassadors", label: "Ambassador Applications", icon: <Flag className="w-4 h-4" /> },
            { id: "emails", label: "Email Audit Log", icon: <Mail className="w-4 h-4" /> },
            { id: "video", label: "Video Section", icon: <Video className="w-4 h-4" /> },
            { id: "chapters", label: "Chapter Photos", icon: <Building className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold flex items-center space-x-2.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-slate-900 border-accent-blue text-white font-extrabold shadow-sm"
                  : "bg-[#0B0F19]/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}

          {/* Simple Vector Graph representation (glowing analytics) */}
          <div className="bg-[#0B0F19]/80 border border-slate-800 rounded-2xl p-4.5 mt-6 space-y-3 shadow-sm">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Activity Analytics</span>
            <div className="h-16 w-full flex items-end justify-between gap-1 pt-4">
              {[35, 45, 60, 50, 75, 90, 85, 110, 130].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-900/50 hover:bg-slate-900 rounded border border-slate-800 relative group h-full flex items-end">
                  <div
                    className="bg-accent-blue/60 group-hover:bg-accent-blue w-full rounded-t"
                    style={{ height: `${(h / 130) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>Oct 2025</span>
              <span>May 2026</span>
            </div>
          </div>
        </div>

        {/* Right Column workspace contents (9 cols) */}
        <div className="lg:col-span-9 bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-sm min-h-[460px]">
          
          <AnimatePresence mode="wait">
            
            {activeTab === "researchers" && (
              /* TAB: RESEARCHERS LIST */
              <motion.div
                key="researchers"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-bold font-heading text-research-blue">Verify Profiles</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Toggle verified badges to enable researcher indexing and score visibility.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 pl-2">Name</th>
                        <th className="pb-3">Institution</th>
                        <th className="pb-3 text-center">Score</th>
                        <th className="pb-3 text-center">Status</th>
                        <th className="pb-3 text-right pr-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {researchers.map((res) => (
                        <tr key={res.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 pl-2 flex items-center space-x-2.5 font-semibold text-slate-200">
                            <img
                              src={res.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${res.fullName}`}
                              alt={res.fullName}
                              className="w-8 h-8 rounded-lg object-cover bg-slate-900 border border-slate-800"
                            />
                            <div className="flex flex-col">
                              <span>{res.fullName}</span>
                              <span className="text-[9px] text-slate-500 font-mono tracking-wider font-bold">{res.researchId}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-slate-400 font-medium">{res.institutionName || "Independent"}</td>
                          <td className="py-3.5 text-center font-bold text-slate-300 font-heading">{res.researchScore.toFixed(1)}</td>
                          <td className="py-3.5 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                              res.isVerified
                                ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                                : "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}>
                              {res.isVerified ? "Verified" : "Pending"}
                            </span>
                          </td>
                          <td className="py-3.5 text-right pr-2">
                            <button
                              disabled={actionLoading === res.id}
                              onClick={() => handleVerifyResearcher(res.id, !res.isVerified)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer hover:shadow-xs ${
                                res.isVerified
                                  ? "bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100"
                                  : "bg-accent-blue hover:bg-accent-blue/90 text-white"
                              }`}
                            >
                              {actionLoading === res.id ? "Loading..." : res.isVerified ? "Revoke Verification" : "Verify Badge"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "publications" && (
              /* TAB: PUBLICATIONS QUEUE */
              <motion.div
                key="publications"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-bold font-heading text-research-blue">Review Publications</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Approve uploaded articles and papers to list them publically.</p>
                </div>

                <div className="space-y-4">
                  {publications.map((pub) => (
                    <div
                      key={pub.id}
                      className="bg-slate-900/50 border border-slate-800 p-4.5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-start gap-4 text-xs shadow-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-950/20 text-accent-blue border border-blue-900/30 uppercase tracking-wider">
                            {pub.category.replace("_", " ")}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                            pub.isApproved
                              ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30"
                              : "bg-amber-950/20 text-primary-yellow border border-amber-900/30"
                          }`}>
                            {pub.isApproved ? "Approved" : "Pending Approval"}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-200 text-sm">{pub.title}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          Uploaded by: <span className="font-bold text-slate-300">{pub.researcher.fullName}</span>
                        </p>
                        <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 max-w-2xl">{pub.abstract}</p>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 sm:pt-2">
                        {pub.pdfUrl && (
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-900 border border-slate-800 hover:border-slate-750 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-slate-300 hover:text-slate-100 transition-all"
                          >
                            Preview PDF
                          </a>
                        )}
                        <button
                          disabled={actionLoading === pub.id}
                          onClick={() => handleApprovePublication(pub.id, !pub.isApproved)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-sm ${
                            pub.isApproved
                              ? "bg-slate-900 border border-slate-800 hover:border-slate-700 text-rose-400 hover:bg-rose-950/20"
                              : "bg-accent-blue hover:bg-accent-blue/90 text-white"
                          }`}
                        >
                          {actionLoading === pub.id ? "Loading..." : pub.isApproved ? "Revoke Approval" : "Approve Publication"}
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {publications.length === 0 && (
                    <div className="py-12 text-center text-slate-500">
                      No publications submitted to the queue yet.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "fellowships" && (
              /* TAB: FELLOWSHIPS LIST */
              <motion.div
                key="fellowships"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-bold font-heading text-research-blue">Ecosystem Fellowship Applicants</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage and review student statement of purposes and resumes.</p>
                </div>

                <div className="space-y-4">
                  {fellowships.map((app) => (
                    <div
                      key={app.id}
                      className="bg-[#0B0F19]/50 border border-slate-800 p-4.5 rounded-2xl space-y-4 text-xs shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-200 text-sm">{app.fullName}</h4>
                          <p className="text-slate-400 font-semibold">{app.course}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{app.institutionName}</p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                            app.status === "APPROVED" ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30" :
                            app.status === "REJECTED" ? "bg-rose-950/20 text-rose-400 border-rose-900/30" :
                            "bg-slate-900 text-slate-400 border border-slate-800"
                          }`}>
                            {app.status}
                          </span>

                          {app.status === "PENDING" && (
                            <div className="flex space-x-1">
                              <button
                                disabled={actionLoading === app.id}
                                onClick={() => handleResolveFellowship(app.id, "APPROVED")}
                                className="p-1 bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-800 rounded-lg text-emerald-400 cursor-pointer shadow-sm"
                                title="Approve Applicant"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled={actionLoading === app.id}
                                onClick={() => handleResolveFellowship(app.id, "REJECTED")}
                                className="p-1 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-800 rounded-lg text-rose-400 cursor-pointer shadow-sm"
                                title="Reject Applicant"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Statement of Purpose */}
                      <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Statement of Purpose</p>
                        <p className="text-slate-300 leading-relaxed text-justify">{app.statementOfPurpose}</p>
                      </div>

                      {app.cvUrl && (
                        <div className="flex items-center justify-between pt-2">
                          <a
                            href={app.cvUrl}
                            download
                            className="text-accent-blue hover:text-research-blue hover:underline font-bold text-[10px] flex items-center space-x-1"
                          >
                            <span>Download Student CV (PDF)</span>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}

                  {fellowships.length === 0 && (
                    <div className="py-12 text-center text-slate-500">
                      No student applications submitted yet.
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "ambassadors" && (
              /* TAB: AMBASSADOR APPLICATIONS */
              <motion.div
                key="ambassadors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {/* Header with PDF download button */}
                <div className="border-b border-slate-800 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold font-heading text-research-blue">Campus Ambassador Applications</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      All brand ambassador registrations — approve, reject, and export as PDF.
                    </p>
                  </div>
                  <button
                    onClick={handleDownloadAmbassadorsPDF}
                    disabled={actionLoading === "pdf" || ambassadors.length === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
                  >
                    {actionLoading === "pdf" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{actionLoading === "pdf" ? "Generating..." : `Download PDF (${ambassadors.length})`}</span>
                  </button>
                </div>

                {/* Stats strip */}
                <div className="flex flex-wrap gap-3 mb-2">
                  {[
                    { label: "Total", val: ambassadors.length, color: "text-slate-300" },
                    { label: "Pending", val: ambassadors.filter((a: any) => a.status === "PENDING").length, color: "text-amber-400" },
                    { label: "Approved", val: ambassadors.filter((a: any) => a.status === "APPROVED").length, color: "text-emerald-400" },
                    { label: "Rejected", val: ambassadors.filter((a: any) => a.status === "REJECTED").length, color: "text-rose-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center space-x-2">
                      <span className={`text-sm font-extrabold font-heading ${s.color}`}>{s.val}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Applications list */}
                <div className="space-y-3">
                  {ambassadors.map((app: any) => (
                    <div
                      key={app.id}
                      className="bg-[#0B0F19]/60 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                            <h4 className="font-bold text-slate-100 text-sm">{app.fullName}</h4>
                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                              app.status === "APPROVED" ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30" :
                              app.status === "REJECTED" ? "bg-rose-950/20 text-rose-400 border-rose-900/30" :
                              "bg-amber-950/20 text-amber-400 border-amber-900/30"
                            }`}>{app.status}</span>
                          </div>
                          <p className="text-slate-400 font-semibold truncate">{app.email}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-slate-500">
                            <span>🏫 {app.collegeName}</span>
                            {app.degreeProgram && <span>🎓 {app.degreeProgram}</span>}
                            {app.yearOfStudy && <span>📅 {app.yearOfStudy}</span>}
                          </div>
                          {app.linkedin && (
                            <a
                              href={app.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent-blue hover:underline flex items-center space-x-1 text-[10px] font-semibold"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>LinkedIn Profile</span>
                            </a>
                          )}
                          <p className="text-[9px] text-slate-600 font-mono">
                            Applied: {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>

                        {/* Action buttons */}
                        {app.status === "PENDING" && (
                          <div className="flex space-x-2 shrink-0">
                            <button
                              disabled={actionLoading === app.id}
                              onClick={() => handleResolveAmbassador(app.id, "APPROVED")}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-800 rounded-lg text-emerald-400 text-[10px] font-bold cursor-pointer transition-all"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              disabled={actionLoading === app.id}
                              onClick={() => handleResolveAmbassador(app.id, "REJECTED")}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800 rounded-lg text-rose-400 text-[10px] font-bold cursor-pointer transition-all"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Motivation / SOP */}
                      <div className="bg-slate-950/60 rounded-xl border border-slate-800 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Why they want to lead a chapter</p>
                        <p className="text-slate-300 leading-relaxed text-[11px] line-clamp-4">{app.sop}</p>
                      </div>
                    </div>
                  ))}

                  {ambassadors.length === 0 && (
                    <div className="py-16 text-center">
                      <Flag className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No ambassador applications yet.</p>
                      <p className="text-slate-600 text-xs mt-1">Applications submitted via the Chapters page will appear here.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "emails" && (
              /* TAB: EMAIL LOG AUDIT */
              <motion.div
                key="emails"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-heading text-research-blue">Resend Dispatch Logs</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Audit trail of automated emails dispatched or logged locally by Healix BioLabs.</p>
                  </div>
                  <button
                    onClick={() => router.refresh()}
                    className="p-1.5 hover:bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
                    title="Reload logs"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3 pl-2">Recipient</th>
                        <th className="pb-3">Subject</th>
                        <th className="pb-3 text-center">Status</th>
                        <th className="pb-3 text-right pr-2">Dispatched At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 font-mono text-[11px]">
                      {emailLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="py-3.5 pl-2 text-slate-300 font-semibold">{log.to}</td>
                          <td className="py-3.5 text-slate-300 font-sans font-semibold">{log.subject}</td>
                          <td className="py-3.5 text-center">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${
                              log.status === "SENT" ? "bg-emerald-950/20 text-emerald-400 border border-emerald-900/30" :
                              log.status === "LOGGED" ? "bg-blue-950/20 text-accent-blue border border-blue-900/30" :
                              "bg-rose-950/20 text-rose-400 border border-rose-900/30"
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right pr-2 text-slate-500">
                            {formatStableTime(log.sentAt)}
                          </td>
                        </tr>
                      ))}
                      
                      {emailLogs.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-slate-500 font-sans">
                            No dispatch actions recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB: VIDEO SECTION CMS */}
            {/* ======================================================== */}
            {activeTab === "video" && (
              <motion.div
                key="video"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-bold font-heading text-research-blue">Video Section CMS</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Upload cover image and update the embedded YouTube video on the main landing page.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left: Video Cover Image Upload */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Cover / Thumbnail Image</h4>
                    
                    {/* Current preview */}
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDragOverVideo(true); }}
                      onDragLeave={() => setIsDragOverVideo(false)}
                      onDrop={handleVideoDrop}
                      className={`relative w-full rounded-xl overflow-hidden border transition-all duration-200 bg-slate-950 ${
                        isDragOverVideo 
                          ? "border-accent-blue bg-accent-blue/10 scale-[1.01] border-dashed" 
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                      style={{ aspectRatio: '16/9' }}
                    >
                      {videoCoverPreview ? (
                        <img src={videoCoverPreview} alt="Video cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                          <ImageIcon className="w-10 h-10 mb-2" />
                          <span className="text-xs">No cover image</span>
                        </div>
                      )}
                      {videoCoverFile && (
                        <div className="absolute top-2 left-2 bg-amber-500/80 text-black text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Pending Upload
                        </div>
                      )}
                      {isDragOverVideo && (
                        <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-xs flex flex-col items-center justify-center text-accent-blue z-30 border-2 border-accent-blue border-dashed rounded-xl">
                          <Upload className="w-8 h-8 animate-bounce mb-2 text-accent-blue" />
                          <span className="text-xs font-bold">Drop to select video cover image</span>
                        </div>
                      )}
                    </div>

                    <input
                      ref={videoFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleVideoCoverSelect}
                    />
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => videoFileRef.current?.click()}
                        className="flex items-center space-x-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Select Image</span>
                      </button>
                      {videoCoverFile && (
                        <button
                          onClick={handleUploadVideoCover}
                          disabled={videoUploading}
                          className="flex items-center space-x-2 px-4 py-2 bg-accent-blue hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                        >
                          {videoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          <span>{videoUploading ? "Uploading..." : "Publish Cover"}</span>
                        </button>
                      )}
                    </div>
                    {videoCoverFile && (
                      <p className="text-[10px] text-slate-500">Selected: <span className="text-slate-300 font-mono">{videoCoverFile.name}</span></p>
                    )}
                  </div>

                  {/* Right: Video Metadata */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Video Metadata</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">YouTube Embed URL</label>
                        <input
                          value={videoYoutubeUrl}
                          onChange={e => setVideoYoutubeUrl(e.target.value)}
                          placeholder="https://www.youtube.com/embed/VIDEO_ID"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-accent-blue transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Video Title</label>
                        <input
                          value={videoTitle}
                          onChange={e => setVideoTitle(e.target.value)}
                          placeholder="Video title shown on cover"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accent-blue transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Subtitle / Category</label>
                          <input
                            value={videoSubtitle}
                            onChange={e => setVideoSubtitle(e.target.value)}
                            placeholder="e.g. Institutional Keynote"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accent-blue transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Duration</label>
                          <input
                            value={videoDuration}
                            onChange={e => setVideoDuration(e.target.value)}
                            placeholder="e.g. 10:24 Mins"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-accent-blue transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveVideoMeta}
                      disabled={cmsLoading}
                      className="flex items-center space-x-2 px-5 py-2.5 bg-accent-blue hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-60 w-full justify-center"
                    >
                      {cmsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      <span>{cmsLoading ? "Saving..." : "Save Video Settings"}</span>
                    </button>

                    {cmsConfig?.videoSection?.youtubeUrl && (
                      <a
                        href={cmsConfig.videoSection.youtubeUrl.replace('/embed/', '/watch?v=')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1.5 text-[10px] text-accent-blue hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Preview live YouTube video</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB: CHAPTER PHOTOS CMS */}
            {/* ======================================================== */}
            {activeTab === "chapters" && (
              <motion.div
                key="chapters"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="text-base font-bold font-heading text-research-blue">Chapter Photos CMS</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Upload background photos for each chapter shown on the Chapters carousel page.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Object.entries(CHAPTER_META).map(([chapterId, meta]) => {
                    const currentImage = chapterPreviews[chapterId] || cmsConfig?.chapters?.[chapterId]?.image;
                    const pendingFile = chapterFiles[chapterId];
                    const isUploading = chapterUploadingId === chapterId;

                    return (
                      <div key={chapterId} className="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden">
                        {/* Photo Preview */}
                        <div 
                          onDragOver={(e) => { e.preventDefault(); setIsDragOverChapter(chapterId); }}
                          onDragLeave={() => setIsDragOverChapter(null)}
                          onDrop={(e) => handleChapterDrop(chapterId, e)}
                          className={`relative w-full bg-slate-950 transition-all duration-200 ${
                            isDragOverChapter === chapterId 
                              ? "bg-accent-blue/10 scale-[1.01]" 
                              : ""
                          }`}
                          style={{ aspectRatio: '16/9' }}
                        >
                          {currentImage ? (
                            <img src={currentImage} alt={meta.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
                              <ImageIcon className="w-8 h-8 mb-1" />
                              <span className="text-[10px]">No photo</span>
                            </div>
                          )}
                          {pendingFile && (
                            <div className="absolute top-2 left-2 bg-amber-500/90 text-black text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                              Pending
                            </div>
                          )}
                          {isDragOverChapter === chapterId && (
                            <div className="absolute inset-0 bg-[#0B0F19]/90 backdrop-blur-xs flex flex-col items-center justify-center text-accent-blue z-30 border-2 border-accent-blue border-dashed">
                              <Upload className="w-6 h-6 animate-bounce mb-1 text-accent-blue" />
                              <span className="text-[10px] font-bold">Drop to select chapter photo</span>
                            </div>
                          )}
                        </div>

                        {/* Chapter info + controls */}
                        <div className="p-3 space-y-2.5">
                          <div>
                            <p className="text-xs font-bold text-slate-200 leading-tight">{meta.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{meta.location}</p>
                          </div>

                          <input
                            ref={el => { chapterFileRefs.current[chapterId] = el; }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleChapterPhotoSelect(chapterId, e)}
                          />

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => chapterFileRefs.current[chapterId]?.click()}
                              className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-semibold text-slate-300 hover:text-white hover:border-slate-600 transition-all cursor-pointer"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Select Photo</span>
                            </button>
                            {pendingFile && (
                              <button
                                onClick={() => handleUploadChapterPhoto(chapterId)}
                                disabled={isUploading}
                                className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-1.5 bg-accent-blue hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer disabled:opacity-60"
                              >
                                {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                <span>{isUploading ? "Uploading..." : "Publish"}</span>
                              </button>
                            )}
                          </div>

                          {pendingFile && (
                            <p className="text-[9px] text-slate-600 truncate font-mono">{pendingFile.name}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
