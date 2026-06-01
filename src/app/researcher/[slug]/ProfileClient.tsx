"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Award, BookOpen, CheckCircle, Edit, FolderGit2, GraduationCap, Link as LinkIcon, Mail, Check, AlertCircle } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/BrandIcons";
import { motion, AnimatePresence } from "framer-motion";
import { HealixUser } from "@/lib/auth";

interface ProfileClientProps {
  researcher: any;
  currentUser: HealixUser | null;
}

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

export default function ProfileClient({ researcher, currentUser }: ProfileClientProps) {
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [fullName, setFullName] = useState(researcher.fullName);
  const [photoUrl, setPhotoUrl] = useState(researcher.photoUrl || "");
  const [bio, setBio] = useState(researcher.bio || "");
  const [institutionName, setInstitutionName] = useState(researcher.institutionName || "");
  const [interestsInput, setInterestsInput] = useState(
    safeJsonParseArray(researcher.researchInterests).join(", ")
  );
  const [skillsInput, setSkillsInput] = useState(
    safeJsonParseArray(researcher.skills).join(", ")
  );
  const [linkedIn, setLinkedIn] = useState(researcher.linkedIn || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isOwner = currentUser && currentUser.id === researcher.userId;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const interestsArray = interestsInput
      .split(",")
      .map((i: string) => i.trim())
      .filter((i: string) => i !== "");
    const skillsArray = skillsInput
      .split(",")
      .map((s: string) => s.trim())
      .filter((s: string) => s !== "");

    try {
      const res = await fetch("/api/researcher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          photoUrl,
          bio,
          institutionName,
          researchInterests: interestsArray,
          skills: skillsArray,
          linkedIn,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setTimeout(() => {
          setEditModalOpen(false);
          setSuccess(false);
          // Redirect if slug changed
          router.push(`/researcher/${data.researcher.slug}`);
          router.refresh();
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const parsedInterests = safeJsonParseArray(researcher.researchInterests);
  const parsedSkills = safeJsonParseArray(researcher.skills);

  return (
    <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Profile Section */}
      <div className="bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden mb-8 shadow-sm">

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
            <img
              src={researcher.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${researcher.fullName}`}
              alt={researcher.fullName}
              className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover bg-slate-950 border border-slate-800 shadow-sm"
            />
            
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-research-blue flex items-center gap-2">
                  <span>{researcher.fullName}</span>
                  {researcher.isVerified && (
                    <CheckCircle className="w-5 h-5 text-accent-blue fill-blue-950/20 shrink-0" />
                  )}
                </h1>
              </div>

              <p className="text-xs text-slate-400 font-mono tracking-wider font-bold">{researcher.researchId}</p>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-semibold">
                <div className="flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-500" />
                  <span>{researcher.institutionName || "Independent Researcher"}</span>
                </div>
                {researcher.linkedIn && (
                  <a
                    href={researcher.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1.5 text-accent-blue hover:text-research-blue hover:underline"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn Connection</span>
                  </a>
                )}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                {researcher.bio || "This researcher hasn't added a biography yet."}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            {isOwner && (
              <button
                onClick={() => setEditModalOpen(true)}
                className="flex items-center space-x-1.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-slate-100 transition-all cursor-pointer hover:shadow-sm"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}

            {/* Score Grid Widget */}
            <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 w-[240px]">
              <div>
                <span className="block text-sm font-extrabold text-primary-yellow font-heading">
                  {researcher.researchScore.toFixed(1)}
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block mt-0.5">Score</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="block text-sm font-extrabold text-research-blue font-heading">
                  {researcher.publications.length}
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block mt-0.5">Papers</span>
              </div>
              <div>
                <span className="block text-sm font-extrabold text-research-blue font-heading">
                  {researcher.projectsJoined.length}
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-wider block mt-0.5">Projects</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sidebar Info */}
        <div className="space-y-6">
          
          {/* Interests card */}
          <div className="bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Research Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {parsedInterests.length > 0 ? (
                parsedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 bg-slate-900/60 text-slate-300 text-xs border border-slate-800 rounded-lg"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">None specified yet.</span>
              )}
            </div>
          </div>

          {/* Skills card */}
          <div className="bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Scientific Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {parsedSkills.length > 0 ? (
                parsedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-slate-900/60 text-slate-300 text-xs border border-slate-800 rounded-lg"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">None specified yet.</span>
              )}
            </div>
          </div>

        </div>

        {/* Publications and Projects lists */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Publications Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-research-blue flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-accent-blue" />
              <span>Publications</span>
            </h2>

            <div className="space-y-4">
              {researcher.publications.length > 0 ? (
                researcher.publications.map((pub: any) => (
                  <div
                    key={pub.id}
                    className="bg-[#0B0F19]/65 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 bg-blue-950/20 text-accent-blue border border-blue-900/30 rounded uppercase tracking-wider mb-2">
                          {pub.category.replace("_", " ")}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100">
                          {pub.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                          {pub.abstract}
                        </p>
                      </div>
                      
                      <a
                        href={`/publications/${pub.id}`}
                        className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-slate-300 hover:text-slate-100 whitespace-nowrap"
                      >
                        Read Paper
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#0B0F19]/30 border border-dashed border-slate-800/80 rounded-2xl p-8 text-center">
                  <p className="text-xs text-slate-500">No approved publications associated with this researcher.</p>
                </div>
              )}
            </div>
          </div>

          {/* Collaborative Projects Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-heading text-research-blue flex items-center space-x-2">
              <FolderGit2 className="w-5 h-5 text-primary-yellow" />
              <span>Research Projects</span>
            </h2>

            <div className="space-y-4">
              {researcher.projectsJoined.length > 0 ? (
                researcher.projectsJoined.map((pm: any) => (
                  <div
                    key={pm.project.id}
                    className="bg-[#0B0F19]/65 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-100">
                        {pm.project.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1 max-w-md">
                        {pm.project.description}
                      </p>
                      <span className="inline-block text-[10px] text-slate-500 mt-1 font-semibold">
                        Timeline: {pm.project.timeline || "Ongoing"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0">
                      {/* Progress Circle/Widget */}
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-slate-300">{pm.project.progress}%</span>
                        <div className="w-20 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 mt-1">
                          <div
                            className="bg-primary-yellow h-full"
                            style={{ width: `${pm.project.progress}%` }}
                          />
                        </div>
                      </div>

                      <a
                        href="/projects"
                        className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-slate-100 transition-all"
                      >
                        Board View
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#0B0F19]/30 border border-dashed border-slate-800/80 rounded-2xl p-8 text-center">
                  <p className="text-xs text-slate-500">Not participating in any collaborative projects yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Edit Profile Modal Dialog */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl z-10 max-h-[85vh] overflow-y-auto animate-in"
            >
              <h2 className="text-xl font-bold font-heading text-research-blue mb-6 flex items-center space-x-2">
                <Edit className="w-5 h-5 text-primary-yellow" />
                <span>Edit Researcher Profile</span>
              </h2>

              {error && (
                <div className="text-xs text-rose-455 bg-rose-950/20 border border-rose-900/50 rounded-xl p-3 mb-4 flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="text-xs text-emerald-455 bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-3 mb-4 flex items-center space-x-1.5">
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>Profile updated successfully! Reloading...</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs text-slate-300">
                
                {/* Full name & Photo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider block">Photo URL</label>
                    <input
                      type="text"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="e.g. Avatar SVG URL"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                </div>

                {/* Institution & LinkedIn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider block">Institution Name</label>
                    <input
                      type="text"
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      placeholder="e.g. AIIMS New Delhi"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider block">LinkedIn URL</label>
                    <input
                      type="text"
                      value={linkedIn}
                      onChange={(e) => setLinkedIn(e.target.value)}
                      placeholder="e.g. https://linkedin.com/in/username"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                </div>

                {/* Biography */}
                <div className="space-y-1.5">
                  <label className="text-slate-400 font-bold uppercase tracking-wider block">Biography</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your research focus and academic background..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue resize-none"
                  />
                </div>

                {/* Interests & Skills */}
                <div className="space-y-4 pt-2 border-t border-slate-800">
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider block">
                      Research Interests <span className="text-slate-500 font-normal">(Comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={interestsInput}
                      onChange={(e) => setInterestsInput(e.target.value)}
                      placeholder="e.g. Medical AI, CRISPR-Cas9, Genomics"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider block">
                      Scientific Skills <span className="text-slate-500 font-normal">(Comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="e.g. PyTorch, Molecular Biology, SolidWorks"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/50 text-white px-6 py-2 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    {saving ? "Saving changes..." : "Save Changes"}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
