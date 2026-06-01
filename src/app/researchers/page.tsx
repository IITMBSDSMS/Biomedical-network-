import React from "react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import ResearchersClient from "./ResearchersClient";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Biomedical Researcher Directory | Healix BioLabs",
  description: "Search and connect with verified scientists, research leads, and students collaborating across India's premier academic institutions.",
};

export default async function ResearchersPage() {
  const currentUser = await getCurrentUser();

  // Load all researchers sorted by research score
  const researchers = await prisma.researcher.findMany({
    orderBy: {
      researchScore: "desc",
    },
  });

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />

      <Navbar currentUser={currentUser} />

      <main className="flex-grow pt-28 pb-16">
        <ResearchersClient researchers={researchers} />
      </main>

      <Footer />
    </div>
  );
}
