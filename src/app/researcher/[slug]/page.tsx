import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import ProfileClient from "./ProfileClient";

import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface ResearcherPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ResearcherPageProps): Promise<Metadata> {
  const { slug } = await params;
  const researcher = await prisma.researcher.findUnique({
    where: { slug },
    select: { fullName: true, bio: true, institutionName: true },
  });

  if (!researcher) {
    return {
      title: "Researcher Profile | Healix BioLabs",
    };
  }

  return {
    title: `${researcher.fullName} | Healix BioLabs Profile`,
    description: researcher.bio || `View professional research score and publications for ${researcher.fullName} at ${researcher.institutionName || "Healix BioLabs"}.`,
  };
}

export default async function ResearcherProfilePage({ params }: ResearcherPageProps) {
  const { slug } = await params;
  const currentUser = await getCurrentUser();

  // Find the researcher with slug
  const researcher = await prisma.researcher.findUnique({
    where: { slug },
    include: {
      publications: {
        orderBy: { createdAt: "desc" },
      },
      projectsJoined: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!researcher) {
    notFound();
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />

      <Navbar currentUser={currentUser} />

      <main className="flex-grow pt-28 pb-16">
        <ProfileClient researcher={researcher} currentUser={currentUser} />
      </main>

      <Footer />
    </div>
  );
}
