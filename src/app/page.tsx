import React from "react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import LandingClient from "@/components/home/LandingClient";

// Disable server caching so mock logs/logins react immediately in the local sandbox
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Home() {
  const currentUser = await getCurrentUser();

  // Query verified researchers
  let featuredResearchers: any[] = [];
  try {
    featuredResearchers = await prisma.researcher.findMany({
      where: { isVerified: true },
      take: 3,
      orderBy: { researchScore: "desc" },
    });
  } catch (err) {
    console.warn("Database offline, using empty featuredResearchers fallback:", err);
  }

  // Query approved publications
  let featuredPublications: any[] = [];
  try {
    featuredPublications = await prisma.publication.findMany({
      where: { isApproved: true },
      take: 3,
      include: {
        researcher: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("Database offline, using empty featuredPublications fallback:", err);
  }

  // Query leadership members
  let leadershipMembers: any[] = [];
  try {
    leadershipMembers = await prisma.leadershipMember.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch (err) {
    console.warn("Database offline, using empty leadershipMembers fallback:", err);
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      {/* Scientific SVG Animated Canvas */}
      <ScientificBackground />

      {/* Navbar Navigation */}
      <Navbar currentUser={currentUser} />

      {/* Interactive Page Body */}
      <main className="flex-grow">
        <LandingClient
          currentUser={currentUser}
          featuredResearchers={featuredResearchers}
          featuredPublications={featuredPublications}
          leadershipMembers={leadershipMembers}
        />
      </main>

      {/* Footer Details */}
      <Footer />
    </div>
  );
}
