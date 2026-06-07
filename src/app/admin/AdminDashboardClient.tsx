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
  initialLeadershipMembers: any[];
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
  initialLeadershipMembers,
}: AdminDashboardProps) {
  const router = useRouter();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"researchers" | "publications" | "fellowships" | "emails" | "video" | "chapters" | "ambassadors" | "users" | "leadership">("researchers");
  
  // Data lists (in local state so toggle actions react immediately)
  const [researchers, setResearchers] = useState(initialResearchers);
  const [publications, setPublications] = useState(initialPublications);
  const [fellowships, setFellowships] = useState(initialFellowshipApplications);
  const [emailLogs, setEmailLogs] = useState(initialEmailLogs);
  const [ambassadors, setAmbassadors] = useState(initialAmbassadorApplications);
  const [leadershipMembers, setLeadershipMembers] = useState(initialLeadershipMembers || []);

  // User Management State
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Leadership Management State
  const [isLeadershipModalOpen, setIsLeadershipModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [memberSection, setMemberSection] = useState("Board of Advisors");
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberInstitution, setMemberInstitution] = useState("");
  const [memberExpertise, setMemberExpertise] = useState("");
  const [memberPhoto, setMemberPhoto] = useState("");
  const [memberLinkedin, setMemberLinkedin] = useState("");
  const [memberBio, setMemberBio] = useState("");
  const [memberSortOrder, setMemberSortOrder] = useState(0);

  const [isDragOverPhoto, setIsDragOverPhoto] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const photoFileRef = useRef<HTMLInputElement>(null);

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setMemberSection("Board of Advisors");
    setMemberName("");
    setMemberRole("");
    setMemberInstitution("");
    setMemberExpertise("");
    setMemberPhoto("");
    setMemberLinkedin("");
    setMemberBio("");
    setMemberSortOrder(leadershipMembers.length + 1);
    setPhotoPreview("");
    setIsLeadershipModalOpen(true);
  };

  const handleOpenEditModal = (member: any) => {
    setEditingMember(member);
    setMemberSection(member.section);
    setMemberName(member.name);
    setMemberRole(member.role);
    setMemberInstitution(member.institution);
    
    let tagsStr = "";
    try {
      if (typeof member.expertise === "string") {
        tagsStr = JSON.parse(member.expertise).join(", ");
      } else if (Array.isArray(member.expertise)) {
        tagsStr = member.expertise.join(", ");
      }
    } catch {
      tagsStr = "";
    }
    
    setMemberExpertise(tagsStr);
    setMemberPhoto(member.photo);
    setMemberLinkedin(member.linkedin);
    setMemberBio(member.bio);
    setMemberSortOrder(member.sortOrder || 0);
    setPhotoPreview(member.photo);
    setIsLeadershipModalOpen(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    setActionLoading(`delete-${id}`);
    try {
      const res = await fetch(`/api/admin/leadership?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setLeadershipMembers(leadershipMembers.filter((m: any) => m.id !== id));
        triggerToast("Leadership member deleted successfully.");
      } else {
        triggerToast(data.error || "Delete failed.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("An error occurred.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const compressAndUploadImage = (file: File) => {
    if (!file) return;
    setPhotoUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            async (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name || "photo.jpg", {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });

                try {
                  const fd = new FormData();
                  fd.append("file", compressedFile);
                  fd.append("type", "leadership-photo");
                  const res = await fetch("/api/admin/upload-media", {
                    method: "POST",
                    body: fd,
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data.error || "Upload failed");
                  setMemberPhoto(data.url);
                  setPhotoPreview(data.url);
                  triggerToast("Photo uploaded and compressed successfully.");
                } catch (err: any) {
                  triggerToast(err.message || "Photo upload failed.", "error");
                } finally {
                  setPhotoUploading(false);
                }
              } else {
                setPhotoUploading(false);
                triggerToast("Compression failed.", "error");
              }
            },
            "image/jpeg",
            0.85
          );
        } else {
          setPhotoUploading(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverPhoto(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      triggerToast("Please drop an image file.", "error");
      return;
    }
    compressAndUploadImage(file);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressAndUploadImage(file);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberRole || !memberInstitution || !memberPhoto || !memberLinkedin || !memberBio) {
      triggerToast("Please fill in all required fields (including photo).", "error");
      return;
    }

    const tags = memberExpertise
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      id: editingMember?.id,
      section: memberSection,
      name: memberName,
      role: memberRole,
      institution: memberInstitution,
      expertise: JSON.stringify(tags),
      photo: memberPhoto,
      linkedin: memberLinkedin,
      bio: memberBio,
      sortOrder: Number(memberSortOrder),
    };

    setActionLoading("save-member");
    try {
      const method = editingMember ? "PUT" : "POST";
      const res = await fetch("/api/admin/leadership", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        if (editingMember) {
          setLeadershipMembers(
            leadershipMembers.map((m: any) => m.id === editingMember.id ? data.member : m)
          );
          triggerToast("Member updated successfully.");
        } else {
          setLeadershipMembers([...leadershipMembers, data.member]);
          triggerToast("Member added successfully.");
        }
        setIsLeadershipModalOpen(false);
      } else {
        triggerToast(data.error || "Save failed.", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("An error occurred.", "error");
    } finally {
      setActionLoading(null);
    }
  };
  
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

  // Fetch users list when User Roles tab is selected
  useEffect(() => {
    if (activeTab === "users") {
      setUsersLoading(true);
      fetch("/api/admin/users")
        .then((res) => res.json())
        .then((data) => {
          if (data.users) {
            setUsers(data.users);
          } else if (data.error) {
            triggerToast(data.error, "error");
          }
        })
        .catch((err) => {
          console.error("Failed to load users:", err);
          triggerToast("Failed to load user list", "error");
        })
        .finally(() => {
          setUsersLoading(false);
        });
    }
  }, [activeTab]);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      setActionLoading(`role-${userId}`);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        triggerToast("User role updated successfully", "success");
      } else {
        triggerToast(data.error || "Failed to update role", "error");
      }
    } catch (err) {
      console.error("Update role failed:", err);
      triggerToast("An error occurred while updating the role", "error");
    } finally {
      setActionLoading(null);
    }
  };

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
        doc.text("biolabsresearch-healix.com", 297 - 14, 205, { align: "right" });
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
            { id: "leadership", label: "Leadership Network", icon: <ShieldCheck className="w-4 h-4" /> },
            { id: "emails", label: "Email Audit Log", icon: <Mail className="w-4 h-4" /> },
            { id: "video", label: "Video Section", icon: <Video className="w-4 h-4" /> },
            { id: "chapters", label: "Chapter Photos", icon: <Building className="w-4 h-4" /> },
            { id: "users", label: "User Roles", icon: <Users className="w-4 h-4" /> },
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

            {activeTab === "leadership" && (
              <motion.div
                key="leadership"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-heading text-research-blue">Leadership & Research Network</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage advisory board, executive officers, and research associates.</p>
                  </div>
                  <button
                    onClick={handleOpenAddModal}
                    className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-accent-blue hover:bg-blue-500 text-[11px] font-bold text-white rounded-xl transition-all cursor-pointer shadow-md shadow-accent-blue/15"
                  >
                    <span>Add Network Member</span>
                  </button>
                </div>

                {/* Grouped by Section */}
                <div className="space-y-8">
                  {["Board of Advisors", "Executive Leadership", "Research & Innovation Council", "Founding Research Associates", "Mentors & Academic Experts", "Mental Health & Human Development Division"].map((sectionName) => {
                    const sectionMembers = leadershipMembers.filter(
                      (m: any) => m.section.toLowerCase().trim() === sectionName.toLowerCase().trim()
                    ).sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));

                    return (
                      <div key={sectionName} className="space-y-4">
                        <div className="border-l-2 border-accent-blue pl-3 flex items-center justify-between py-1">
                          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">{sectionName}</h4>
                          <span className="text-[10px] text-slate-500 font-mono font-bold bg-slate-950 px-2 py-0.5 rounded-md border border-slate-900">{sectionMembers.length} Members</span>
                        </div>

                        {sectionMembers.length === 0 ? (
                          <div className="bg-slate-950/20 border border-slate-900 rounded-2xl py-6 text-center text-[11px] text-slate-600 font-medium">
                            No members added to this section yet.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {sectionMembers.map((member: any) => {
                              let tags: string[] = [];
                              try {
                                if (typeof member.expertise === "string") {
                                  tags = JSON.parse(member.expertise);
                                } else if (Array.isArray(member.expertise)) {
                                  tags = member.expertise;
                                }
                              } catch {
                                tags = [];
                              }

                              const isDeleting = actionLoading === `delete-${member.id}`;

                              return (
                                <div key={member.id} className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex gap-3 text-xs justify-between items-start shadow-sm hover:border-slate-700 transition-colors">
                                  <div className="flex gap-3">
                                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shrink-0">
                                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1 text-left">
                                      <p className="font-bold text-slate-200">{member.name}</p>
                                      <p className="text-[10px] text-accent-blue font-semibold">{member.role}</p>
                                      <p className="text-[10px] text-slate-400 font-semibold">{member.institution}</p>
                                      <div className="flex flex-wrap gap-1 pt-1">
                                        {tags.slice(0, 3).map((tag: string) => (
                                          <span key={tag} className="text-[8px] font-bold px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800/80 text-slate-500 uppercase font-mono">{tag}</span>
                                        ))}
                                        {tags.length > 3 && <span className="text-[8px] text-slate-600 font-bold font-mono">+{tags.length - 3} more</span>}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-1.5 items-end justify-between self-stretch shrink-0">
                                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/60 text-slate-500">Order: {member.sortOrder}</span>
                                    <div className="flex items-center space-x-1.5">
                                      <button
                                        onClick={() => handleOpenEditModal(member)}
                                        className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 text-slate-400 hover:text-white transition-all cursor-pointer"
                                        title="Edit Member"
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => handleDeleteMember(member.id)}
                                        disabled={isDeleting}
                                        className="p-1.5 rounded-lg border border-slate-800 hover:border-rose-900 bg-slate-900/40 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 transition-all cursor-pointer disabled:opacity-50"
                                        title="Delete Member"
                                      >
                                        {isDeleting ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ======================================================== */}
            {/* TAB: USER ROLES MANAGEMENT */}
            {/* ======================================================== */}
            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold font-heading text-research-blue">User Account & Role Controls</h3>
                    <p className="text-xs text-slate-400 mt-0.5">List all registered users, inspect credentials, and manage roles dynamically.</p>
                  </div>
                  <button
                    onClick={() => {
                      setUsersLoading(true);
                      fetch("/api/admin/users")
                        .then((res) => res.json())
                        .then((data) => {
                          if (data.users) setUsers(data.users);
                        })
                        .catch(console.error)
                        .finally(() => setUsersLoading(false));
                    }}
                    disabled={usersLoading}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-600 text-[10px] font-bold text-slate-300 hover:text-white rounded-lg transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {/* Search box */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="flex-1 bg-slate-950/60 border border-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-2.5 px-4 text-xs font-medium focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                  />
                </div>

                {/* Table list */}
                {usersLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-accent-blue" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Retrieving User Directory...</span>
                  </div>
                ) : (
                  <div className="bg-slate-950/45 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800/60 bg-slate-900/40 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            <th className="py-3.5 px-4 font-extrabold">Name / Email</th>
                            <th className="py-3.5 px-4 font-extrabold">Joined Date</th>
                            <th className="py-3.5 px-4 font-extrabold">Current Role</th>
                            <th className="py-3.5 px-4 font-extrabold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 text-slate-350">
                          {users
                            .filter((u) => {
                              const q = userSearchQuery.toLowerCase();
                              return (u.name || "").toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                            })
                            .map((user) => {
                              const isPendingAction = actionLoading === `role-${user.id}`;
                              return (
                                <tr key={user.id} className="hover:bg-slate-900/10 transition-colors">
                                  <td className="py-3 px-4">
                                    <p className="text-xs font-bold text-slate-200">{user.name || "Unnamed User"}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{user.email}</p>
                                  </td>
                                  <td className="py-3 px-4 text-[10.5px] text-slate-400 font-medium">
                                    {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className={`inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${
                                      user.role === "ADMIN"
                                        ? "bg-red-950/20 text-rose-400 border-red-900/35"
                                        : user.role === "RESEARCHER"
                                          ? "bg-blue-950/20 text-accent-blue border-blue-900/35"
                                          : user.role === "STUDENT"
                                            ? "bg-amber-950/20 text-amber-400 border-amber-900/35"
                                            : "bg-purple-950/20 text-purple-400 border-purple-900/35"
                                    }`}>
                                      {user.role}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <select
                                      value={user.role}
                                      disabled={isPendingAction}
                                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                      className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-bold rounded-lg py-1.5 px-2.5 focus:outline-none focus:border-accent-blue transition-all disabled:opacity-50"
                                    >
                                      <option value="RESEARCHER">Researcher</option>
                                      <option value="ADMIN">Admin</option>
                                      <option value="STUDENT">Student</option>
                                      <option value="INSTITUTION">Institution</option>
                                    </select>
                                  </td>
                                </tr>
                              );
                            })}
                          {users.filter((u) => {
                            const q = userSearchQuery.toLowerCase();
                            return (u.name || "").toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                          }).length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-10 text-center text-xs text-slate-500 font-medium">
                                No users matched your search criteria.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>

          {/* LEADERSHIP ADD/EDIT MODAL */}
          <AnimatePresence>
            {isLeadershipModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                onClick={() => setIsLeadershipModalOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  className="bg-[#0B0F19] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative text-slate-350"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-accent-blue via-blue-500 to-indigo-500" />
                  
                  <button
                    onClick={() => setIsLeadershipModalOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <form onSubmit={handleSaveMember} className="p-6 md:p-8 space-y-4 max-h-[85vh] overflow-y-auto">
                    <div className="border-b border-slate-800 pb-3">
                      <h3 className="text-base font-bold font-heading text-white">
                        {editingMember ? "Edit Network Member" : "Add Network Member"}
                      </h3>
                      <p className="text-[11px] text-slate-400">Configure credentials, organization, and bio details.</p>
                    </div>

                    <div className="space-y-3.5 text-xs text-left">
                      {/* Image Upload Area */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Photo *</label>
                        <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shrink-0 flex items-center justify-center relative">
                            {photoPreview ? (
                              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-slate-700" />
                            )}
                            {photoUploading && (
                              <div className="absolute inset-0 bg-[#0B0F19]/80 backdrop-blur-xs flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-accent-blue" />
                              </div>
                            )}
                          </div>

                          <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragOverPhoto(true); }}
                            onDragLeave={() => setIsDragOverPhoto(false)}
                            onDrop={handlePhotoDrop}
                            onClick={() => photoFileRef.current?.click()}
                            className={`flex-1 h-16 border border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                              isDragOverPhoto 
                                ? "bg-accent-blue/10 border-accent-blue" 
                                : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                            }`}
                          >
                            <input
                              ref={photoFileRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoSelect}
                            />
                            <Upload className={`w-4 h-4 mb-0.5 ${isDragOverPhoto ? "text-accent-blue animate-bounce" : "text-slate-500"}`} />
                            <span className="text-[10px] font-bold text-slate-400">
                              {photoUploading ? "Uploading..." : "Drag photo or click to upload"}
                            </span>
                            <span className="text-[8px] text-slate-500 font-medium">Auto-compressed client-side</span>
                          </div>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Sameer Kalra"
                          value={memberName}
                          onChange={e => setMemberName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-650 rounded-xl py-2 px-3 focus:outline-none focus:border-accent-blue transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Role */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role / Designation *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Clinical Advisor"
                            value={memberRole}
                            onChange={e => setMemberRole(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-650 rounded-xl py-2 px-3 focus:outline-none focus:border-accent-blue transition-all"
                          />
                        </div>
                        {/* Institution */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Sir Ganga Ram Hospital"
                            value={memberInstitution}
                            onChange={e => setMemberInstitution(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-655 rounded-xl py-2 px-3 focus:outline-none focus:border-accent-blue transition-all"
                          />
                        </div>
                      </div>

                      {/* Section & SortOrder */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Section *</label>
                          <select
                            value={memberSection}
                            onChange={e => setMemberSection(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2.5 px-2.5 focus:outline-none focus:border-accent-blue transition-all"
                          >
                            <option value="Board of Advisors">Board of Advisors</option>
                            <option value="Executive Leadership">Executive Leadership</option>
                            <option value="Research & Innovation Council">Research & Innovation Council</option>
                            <option value="Founding Research Associates">Founding Research Associates</option>
                            <option value="Mentors & Academic Experts">Mentors & Academic Experts</option>
                            <option value="Mental Health & Human Development Division">Mental Health & Human Development Division</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sort Order</label>
                          <input
                            type="number"
                            required
                            value={memberSortOrder}
                            onChange={e => setMemberSortOrder(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:border-accent-blue transition-all"
                          />
                        </div>
                      </div>

                      {/* LinkedIn */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LinkedIn URL *</label>
                        <input
                          type="url"
                          required
                          placeholder="https://linkedin.com/in/..."
                          value={memberLinkedin}
                          onChange={e => setMemberLinkedin(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-655 rounded-xl py-2 px-3 focus:outline-none focus:border-accent-blue transition-all"
                        />
                      </div>

                      {/* Expertise */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expertise Tags</label>
                        <input
                          type="text"
                          placeholder="e.g. Clinical Research, Immunology (comma separated)"
                          value={memberExpertise}
                          onChange={e => setMemberExpertise(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-655 rounded-xl py-2 px-3 focus:outline-none focus:border-accent-blue transition-all"
                        />
                      </div>

                      {/* Bio */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Biography *</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Detailed background information..."
                          value={memberBio}
                          onChange={e => setMemberBio(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-655 rounded-xl py-2 px-3 focus:outline-none focus:border-accent-blue transition-all resize-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsLeadershipModalOpen(false)}
                        className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer font-bold text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={actionLoading === "save-member" || photoUploading}
                        className="flex items-center space-x-1 px-5 py-2 bg-accent-blue hover:bg-blue-500 text-white rounded-xl transition-all cursor-pointer font-bold text-xs disabled:opacity-65"
                      >
                        {actionLoading === "save-member" ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>{actionLoading === "save-member" ? "Saving..." : "Save Member"}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
