import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import ResearchGateClient from "./ResearchGateClient";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ResearchGate Profile Integration | Healix BioLabs",
  description:
    "Sync your ResearchGate research items, score metrics, co-authors list, and active project timelines directly into your BioLabs researcher profile.",
  openGraph: {
    title: "ResearchGate Integration | Healix BioLabs",
    description: "Sync research score, co-authors lists, and work items dynamically from ResearchGate profiles.",
    type: "website",
  },
};

export default async function ResearchGatePage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />
      <Navbar currentUser={currentUser} />
      <main className="flex-grow pt-28 pb-16">
        <ResearchGateClient currentUser={currentUser} />
      </main>
      <Footer />
    </div>
  );
}
