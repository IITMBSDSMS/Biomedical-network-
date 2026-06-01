import React from "react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import ProjectsClient from "@/components/dashboard/ProjectsClient";
import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research Collaborations & Workspaces | Healix BioLabs",
  description: "Access your collaborative biomedical research workspaces, Kanban milestone boards, and Gantt project timelines.",
};

export default async function ProjectsPage() {
  const currentUser = await getCurrentUser();

  let researcher = null;
  let projects: any[] = [];
  let allResearchers: any[] = [];

  if (currentUser) {
    try {
      researcher = await prisma.researcher.findUnique({
        where: { userId: currentUser.id },
      });
    } catch (err) {
      console.warn("Database offline, using null researcher fallback:", err);
    }

    if (researcher) {
      // Find projects where researcher is a member
      try {
        projects = await prisma.project.findMany({
          where: {
            members: {
              some: { researcherId: researcher.id },
            },
          },
          include: {
            creator: true,
            members: {
              include: {
                researcher: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      } catch (err) {
        console.warn("Database offline, using empty projects fallback:", err);
      }

      // Find other researchers to invite
      try {
        allResearchers = await prisma.researcher.findMany({
          where: {
            NOT: { id: researcher.id },
          },
          select: {
            id: true,
            fullName: true,
            institutionName: true,
          },
          orderBy: {
            fullName: "asc",
          },
        });
      } catch (err) {
        console.warn("Database offline, using empty allResearchers fallback:", err);
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />

      <Navbar currentUser={currentUser} />

      <main className="flex-grow pt-28 pb-16">
        {currentUser ? (
          researcher ? (
            <ProjectsClient
              projects={projects}
              researcher={researcher}
              allResearchers={allResearchers}
            />
          ) : (
            <div className="max-w-md mx-auto px-4 mt-16 text-center">
              <div className="bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-lg space-y-6">
                <ShieldAlert className="w-12 h-12 text-primary-yellow mx-auto" />
                <h2 className="text-xl font-heading font-extrabold text-research-blue">Complete Profile Required</h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are signed in, but you haven&apos;t created your researcher profile yet. To collaborate on research projects, you must initialize your profile details.
                </p>
                <Link
                  href="/login" // Redirect to login which will trigger profile creation
                  className="bg-primary-yellow hover:bg-primary-yellow/90 text-slate-950 font-bold text-xs px-6 py-3 rounded-full transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-primary-yellow/10"
                >
                  <span>Set Up Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )
        ) : (
          <div className="max-w-md mx-auto px-4 mt-16 text-center">
            <div className="bg-[#0B0F19]/65 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-lg space-y-6">
              <ShieldAlert className="w-12 h-12 text-primary-yellow mx-auto" />
              <h2 className="text-xl font-heading font-extrabold text-research-blue">Authentication Required</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Please log in to access the collaboration project workspaces, Kanban boards, and Gantt milestones.
              </p>
              <Link
                href="/login"
                className="bg-primary-yellow hover:bg-primary-yellow/90 text-slate-950 font-bold text-xs px-6 py-3 rounded-full transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-primary-yellow/10"
              >
                <span>Access Secure Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
