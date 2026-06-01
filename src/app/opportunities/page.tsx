import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import OpportunitiesBoardClient from "./OpportunitiesBoardClient";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Research Opportunity Board | Healix BioLabs",
  description:
    "Discover fellowships, PhD positions, internships, and open collaborations from India's top research institutions on the Healix BioLabs Research Opportunity Board.",
  openGraph: {
    title: "Research Opportunity Board | Healix BioLabs",
    description:
      "Fellowships, PhD positions, internships and research collaborations from IIT, IISc, AIIMS and more.",
    type: "website",
  },
};

export default async function OpportunitiesPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />
      <Navbar currentUser={currentUser} />
      <main className="flex-grow pt-28 pb-16">
        <OpportunitiesBoardClient currentUser={currentUser} />
      </main>
      <Footer />
    </div>
  );
}
