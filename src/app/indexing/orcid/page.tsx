import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import OrcidClient from "./OrcidClient";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ORCID iD Integration | Healix BioLabs",
  description:
    "Authorize your 16-digit ORCID iD to sync your verified scholarly works, employment history, and funding awards directly into your BioLabs researcher credentials card.",
  openGraph: {
    title: "ORCID Integration | Healix BioLabs",
    description: "Sync works, employments, and grants dynamically from public ORCID API profiles.",
    type: "website",
  },
};

export default async function OrcidPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />
      <Navbar currentUser={currentUser} />
      <main className="flex-grow pt-28 pb-16">
        <OrcidClient currentUser={currentUser} />
      </main>
      <Footer />
    </div>
  );
}
