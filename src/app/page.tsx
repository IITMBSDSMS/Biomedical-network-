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
  const featuredResearchers = await prisma.researcher.findMany({
    where: { isVerified: true },
    take: 3,
    orderBy: { researchScore: "desc" },
  });

  // Query approved publications
  const featuredPublications = await prisma.publication.findMany({
    where: { isApproved: true },
    take: 3,
    include: {
      researcher: true,
    },
    orderBy: { createdAt: "desc" },
  });

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
        />
      </main>

      {/* Footer Details */}
      <Footer />
    </div>
  );
}
