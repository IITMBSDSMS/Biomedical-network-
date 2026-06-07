import React from "react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import AdminDashboardClient from "./AdminDashboardClient";
import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return (
      <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
        <ScientificBackground />
        <Navbar currentUser={currentUser} />
        <main className="flex-grow flex items-center justify-center pt-28">
          <div className="max-w-md w-full px-4 text-center">
            <div className="bg-[#0B0F19]/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-lg space-y-6">
              <ShieldAlert className="w-12 h-12 text-primary-yellow mx-auto" />
              <h2 className="text-xl font-heading font-extrabold text-research-blue">Access Prohibited</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                You do not have administrative credentials. Please authenticate using an authorized administrator account to access ecosystem controls.
              </p>
              <Link
                href="/login"
                className="bg-primary-yellow hover:bg-primary-yellow/90 text-brand-black font-bold text-xs px-6 py-3 rounded-full transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-primary-yellow/10"
              >
                <span>Portal Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Load Admin metrics
  const researchers = await prisma.researcher.findMany({
    orderBy: { createdAt: "desc" },
  });

  const publications = await prisma.publication.findMany({
    include: { researcher: true },
    orderBy: { createdAt: "desc" },
  });

  const fellowshipApplications = await prisma.fellowshipApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const projectCount = await prisma.project.count();

  // Fetch ambassador applications
  const ambassadorApplications = await prisma.ambassadorApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Fetch recent email logs for demonstration in the sandbox
  const emailLogs = await prisma.emailLog.findMany({
    orderBy: { sentAt: "desc" },
    take: 12,
  });

  // Fetch leadership members
  const leadershipMembers = await prisma.leadershipMember.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />

      <Navbar currentUser={currentUser} />

      <main className="flex-grow pt-28 pb-16">
        <AdminDashboardClient
          initialResearchers={researchers}
          initialPublications={publications}
          initialFellowshipApplications={fellowshipApplications}
          initialEmailLogs={emailLogs}
          initialAmbassadorApplications={ambassadorApplications}
          projectCount={projectCount}
          initialLeadershipMembers={leadershipMembers}
        />
      </main>

      <Footer />
    </div>
  );
}
