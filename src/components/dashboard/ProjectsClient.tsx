"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderGit2, Plus, UserPlus, Calendar, ArrowRight, LayoutGrid, CheckCircle2, ChevronRight, X, AlertCircle, Check, Users, CalendarDays } from "lucide-react";
import { TrelloIcon } from "@/components/ui/BrandIcons";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectsClientProps {
  projects: any[];
  researcher: any;
  allResearchers: any[];
}

interface Task {
  id: string;
  title: string;
  desc: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  owner: string;
}

export default function ProjectsClient({ projects, researcher, allResearchers }: ProjectsClientProps) {
  const router = useRouter();
  
  // Navigation & Workspace states
  const [activeProject, setActiveProject] = useState<any>(projects[0] || null);
  const [viewTab, setViewTab] = useState<"kanban" | "timeline">("kanban");
  
  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Create Project Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Biomedical Informatics");
  const [timeline, setTimeline] = useState("");
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState("");

  // Invite Member Form
  const [selectedInviteId, setSelectedInviteId] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Mock Kanban Tasks for interactive demonstration
  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", title: "Review CRISPR Off-Target Sequencing", desc: "Analyze deep sequencing files for off-target edits in hepatocytes.", status: "TODO", priority: "HIGH", owner: "Dr. Priya Sharma" },
    { id: "t2", title: "Preprocess CT Imaging Dataset", desc: "Standardize resolution and contrast across 500 pulmonary CT scans.", status: "IN_PROGRESS", priority: "MEDIUM", owner: "Dr. Avnish Verma" },
    { id: "t3", title: "Synthesize Liposome Carriers", desc: "Batch test lipid formulation ratios for nanoparticle encapsulation.", status: "REVIEW", priority: "HIGH", owner: "Dr. Priya Sharma" },
    { id: "t4", title: "Format Bibliographic Citations", desc: "Standardize references list to match Nature Biotechnology format.", status: "DONE", priority: "LOW", owner: "Dr. Rajesh Patel" },
  ]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProject(true);
    setProjectError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category, timeline }),
      });

      if (res.ok) {
        const data = await res.json();
        setCreateModalOpen(false);
        setTitle("");
        setDescription("");
        setTimeline("");
        router.refresh();
        // Set new project as active after a timeout to let router load database updates
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        const data = await res.json();
        setProjectError(data.error || "Failed to create project");
      }
    } catch (err) {
      console.error(err);
      setProjectError("An unexpected error occurred.");
    } finally {
      setSavingProject(false);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInviteId) return;
    setInviting(true);
    setInviteError("");
    setInviteSuccess(false);

    try {
      const res = await fetch("/api/projects/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: activeProject.id, researcherId: selectedInviteId }),
      });

      if (res.ok) {
        setInviteSuccess(true);
        setTimeout(() => {
          setInviteModalOpen(false);
          setSelectedInviteId("");
          setInviteSuccess(false);
          window.location.reload(); // Refresh to load new membership relationships
        }, 1200);
      } else {
        const data = await res.json();
        setInviteError(data.error || "Failed to invite researcher");
      }
    } catch (err) {
      console.error(err);
      setInviteError("An unexpected error occurred.");
    } finally {
      setInviting(false);
    }
  };

  // Move tasks across columns in the interactive Kanban simulation
  const moveTask = (taskId: string, direction: "next" | "prev") => {
    const order: Task["status"][] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          const currentIndex = order.indexOf(t.status);
          const nextIndex = currentIndex + (direction === "next" ? 1 : -1);
          if (nextIndex >= 0 && nextIndex < order.length) {
            return { ...t, status: order[nextIndex] };
          }
        }
        return t;
      })
    );
  };

  // Gantt Milestones list
  const milestones = [
    { name: "Phase 1: Dataset Acquisition & Cleaning", start: "Jan", end: "Mar", progress: 100, status: "Complete", color: "bg-emerald-500" },
    { name: "Phase 2: Neural Net Model Implementation", start: "Mar", end: "Jun", progress: 75, status: "In Progress", color: "bg-research-blue" },
    { name: "Phase 3: PCR Wet-Lab Assays & Trials", start: "Jun", end: "Sep", progress: 20, status: "Not Started", color: "bg-primary-yellow" },
    { name: "Phase 4: Synthesis & Publication Submission", start: "Sep", end: "Dec", progress: 0, status: "Not Started", color: "bg-slate-700" },
  ];

  return (
    <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
      

      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-research-blue tracking-tight">
            Research Collaborations
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Manage projects, update task statuses, and invite co-investigators.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center space-x-2 bg-accent-blue hover:bg-accent-blue/90 text-white text-xs font-bold px-5 py-3 rounded-full transition-all shrink-0 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl p-8 max-w-xl mx-auto space-y-6">
          <FolderGit2 className="w-12 h-12 text-slate-400 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-slate-750">No active projects</h3>
            <p className="text-xs text-slate-500 mt-1">
              Create a collaboration project to track milestones and invite researchers.
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-accent-blue hover:bg-accent-blue/90 text-white font-semibold text-xs px-6 py-2.5 rounded-full transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <span>Create First Project</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Projects Selector Sidebar (1 col) */}
          <div className="space-y-3 lg:col-span-1 bg-slate-900/40 border border-slate-800 p-4 rounded-3xl shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3 px-1">My Workspaces</p>
            {projects.map((proj) => {
              const isSelected = activeProject && activeProject.id === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => {
                    setActiveProject(proj);
                    // Reset tab
                    setViewTab("kanban");
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? "bg-[#0B0F19] border-accent-blue shadow-md text-slate-100"
                      : "bg-slate-900/30 border-slate-800 hover:border-slate-700 hover:bg-slate-900 hover:shadow-xs text-slate-400"
                  }`}
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 w-fit mb-2">
                    {proj.category}
                  </span>
                  <h4 className={`text-xs font-bold ${isSelected ? "text-slate-100" : "text-slate-300"} line-clamp-1`}>{proj.title}</h4>
                  <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-800 mt-3">
                    <div
                      className="bg-primary-yellow h-full"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Project Workspace (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Workspace Card Header */}
            <div className="bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="space-y-2">
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 bg-blue-950/20 text-accent-blue border border-blue-900/30 rounded uppercase tracking-wider">
                    {activeProject.category}
                  </span>
                  
                  <h2 className="text-xl md:text-2xl font-heading font-extrabold text-research-blue">
                    {activeProject.title}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    {activeProject.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-400 font-semibold pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Timeline: {activeProject.timeline || "Ongoing"}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>{activeProject.members.length} Team Members</span>
                    </span>
                  </div>
                </div>

                {/* Team & Invite Actions */}
                <div className="flex flex-col items-stretch sm:items-end gap-3 shrink-0">
                  <div className="flex -space-x-2 overflow-hidden mb-1 justify-center sm:justify-end">
                    {activeProject.members.map((m: any) => (
                      <img
                        key={m.id}
                        className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-slate-900"
                        src={m.researcher.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${m.researcher.fullName}`}
                        alt={m.researcher.fullName}
                        title={`${m.researcher.fullName} (${m.role})`}
                      />
                    ))}
                  </div>

                  {activeProject.creatorId === researcher.id && (
                    <button
                      onClick={() => setInviteModalOpen(true)}
                      className="flex items-center justify-center space-x-1 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl text-[10px] font-semibold text-slate-300 hover:text-slate-100 transition-all cursor-pointer hover:shadow-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-primary-yellow" />
                      <span>Invite Member</span>
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* Workspace View Selector */}
            <div className="flex border-b border-slate-800 gap-6 text-xs font-semibold">
              <button
                onClick={() => setViewTab("kanban")}
                className={`pb-3 flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
                  viewTab === "kanban"
                    ? "text-accent-blue border-accent-blue font-extrabold"
                    : "text-slate-500 border-transparent hover:text-slate-300"
                }`}
              >
                <TrelloIcon className="w-4 h-4" />
                <span>Kanban Board</span>
              </button>
              
              <button
                onClick={() => setViewTab("timeline")}
                className={`pb-3 flex items-center space-x-1.5 border-b-2 transition-all cursor-pointer ${
                  viewTab === "timeline"
                    ? "text-accent-blue border-accent-blue font-extrabold"
                    : "text-slate-500 border-transparent hover:text-slate-300"
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                <span>Gantt Milestones</span>
              </button>
            </div>

            {/* WORKSPACE VIEW CONTENT */}
            <div>
              {viewTab === "kanban" ? (
                /* KANBAN BOARD VIEW */
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  
                  {/* Generate columns */}
                  {(["TODO", "IN_PROGRESS", "REVIEW", "DONE"] as const).map((col) => {
                    const colTasks = tasks.filter((t) => t.status === col);
                    const colHeaders = {
                      TODO: { label: "To Do", color: "bg-slate-500" },
                      IN_PROGRESS: { label: "In Progress", color: "bg-accent-blue" },
                      REVIEW: { label: "Under Review", color: "bg-primary-yellow" },
                      DONE: { label: "Completed", color: "bg-emerald-500" },
                    };

                    return (
                      <div key={col} className="bg-slate-900/30 border border-slate-800 rounded-2xl p-3.5 space-y-3 min-h-[400px] shadow-xs">
                        
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                          <div className="flex items-center space-x-1.5">
                            <span className={`w-2 h-2 rounded-full ${colHeaders[col].color}`} />
                            <span className="text-xs font-bold text-slate-200 font-heading">{colHeaders[col].label}</span>
                          </div>
                          <span className="text-[10px] text-slate-300 font-mono font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {colTasks.length}
                          </span>
                        </div>

                        {/* Task list */}
                        <div className="space-y-2.5">
                          {colTasks.map((task) => (
                            <div
                                key={task.id}
                                className="bg-[#0B0F19] border border-slate-800 p-3.5 rounded-xl space-y-3 shadow-sm hover:border-slate-700 hover:shadow-xs transition-all text-xs"
                            >
                              <div className="space-y-1">
                                <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  task.priority === "HIGH" ? "bg-rose-950/20 text-rose-400 border border-rose-900/30" :
                                  task.priority === "MEDIUM" ? "bg-amber-950/20 text-amber-400 border border-amber-900/30" :
                                  "bg-slate-900 text-slate-300 border border-slate-800"
                                }`}>
                                  {task.priority} Priority
                                </span>
                                <h5 className="font-bold text-slate-100 leading-snug">{task.title}</h5>
                                <p className="text-[10px] text-slate-400 leading-normal">{task.desc}</p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-800 mt-2 text-[10px]">
                                <span className="text-slate-400 font-semibold truncate max-w-[80px]" title={task.owner}>
                                  {task.owner}
                                </span>
                                
                                <div className="flex items-center space-x-1">
                                  {col !== "TODO" && (
                                    <button
                                      onClick={() => moveTask(task.id, "prev")}
                                      className="p-1 hover:bg-slate-800 rounded border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      &larr;
                                    </button>
                                  )}
                                  {col !== "DONE" && (
                                    <button
                                      onClick={() => moveTask(task.id, "next")}
                                      className="p-1 hover:bg-slate-800 rounded border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                                    >
                                      &rarr;
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {colTasks.length === 0 && (
                            <div className="py-8 text-center text-[10px] text-slate-500 border border-dashed border-slate-800 rounded-xl bg-[#0B0F19]/30">
                              No tasks in column
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}

                </div>
              ) : (
                /* GANTT MILESTONES TIMELINE VIEW */
                <div className="bg-[#0B0F19]/65 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Research Phase</span>
                    <div className="flex space-x-12 pr-4 font-mono">
                      <span>Q1</span>
                      <span>Q2</span>
                      <span>Q3</span>
                      <span>Q4</span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {milestones.map((m, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">{m.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">{m.start} - {m.end} ({m.status})</span>
                        </div>
                        
                        <div className="relative w-full bg-slate-950 h-5 rounded-full overflow-hidden border border-slate-800 flex items-center justify-between px-3 text-[10px]">
                          {/* Progress slider bar */}
                          <div
                            className={`absolute inset-y-0 left-0 ${m.color} opacity-20`}
                            style={{ width: `${m.progress}%` }}
                          />
                          <span className="z-10 text-slate-300 font-semibold">{m.progress}% Completed</span>
                          <span className="z-10 font-bold font-mono text-slate-400">{m.start} &rarr; {m.end}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCreateModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl z-10 animate-in"
            >
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                <h2 className="text-lg font-bold font-heading text-research-blue flex items-center space-x-2">
                  <FolderGit2 className="w-5 h-5 text-primary-yellow" />
                  <span>Create Research Project</span>
                </h2>
                <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-650 p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {projectError && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3 mb-4 flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{projectError}</span>
                </div>
              )}

              <form onSubmit={handleCreateProject} className="space-y-4 text-xs text-slate-700">
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider block">Project Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Project BioShield: Pandemic Response"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider block">Timeline Schedule</label>
                  <input
                    type="text"
                    required
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="e.g. Jun 2026 - Dec 2026"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider block">Scientific Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Neuro Engineering, Genomics"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider block">Description</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of the project goals, methodologies, and co-investigators..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue resize-none"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="bg-slate-50 hover:bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-600 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProject}
                    className="bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/50 text-white px-6 py-2 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    {savingProject ? "Creating..." : "Create Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite Member Modal */}
      <AnimatePresence>
        {inviteModalOpen && activeProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInviteModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-2xl z-10 animate-in"
            >
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
                <h2 className="text-base font-bold font-heading text-research-blue flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-primary-yellow" />
                  <span>Invite Collaborator</span>
                </h2>
                <button onClick={() => setInviteModalOpen(false)} className="text-slate-400 hover:text-slate-650 p-1 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {inviteError && (
                <div className="text-xs text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-3 mb-4 flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}

              {inviteSuccess && (
                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4 flex items-center space-x-1.5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Researcher added successfully! Reloading...</span>
                </div>
              )}

              <form onSubmit={handleInviteMember} className="space-y-4 text-xs text-slate-700">
                <div className="space-y-1.5">
                  <label className="text-slate-500 font-bold uppercase tracking-wider block">Select Researcher</label>
                  <select
                    value={selectedInviteId}
                    onChange={(e) => setSelectedInviteId(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue"
                  >
                    <option value="">-- Choose registered researcher --</option>
                    {allResearchers
                      .filter((ar) => !activeProject.members.some((m: any) => m.researcherId === ar.id))
                      .map((ar) => (
                        <option key={ar.id} value={ar.id}>
                          {ar.fullName} ({ar.institutionName || "Independent"})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setInviteModalOpen(false)}
                    className="bg-slate-50 hover:bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-600 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviting || inviteSuccess}
                    className="bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/50 text-white px-6 py-2 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    {inviting ? "Inviting..." : "Add to Team"}
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
