import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import ChaptersClient from "./ChaptersClient";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Campus Chapters Network | Healix BioLabs",
  description:
    "Explore the BioLabs Research Club Network. Join active college chapters or apply to become a student campus ambassador.",
  openGraph: {
    title: "Campus Chapters Network | Healix BioLabs",
    description:
      "Join the BioLabs campus ambassador network and launch a research chapter at your university.",
    type: "website",
  },
};

export default async function ChaptersPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />
      <Navbar currentUser={currentUser} />
      <main className="flex-grow pt-28 pb-16">
        <ChaptersClient currentUser={currentUser} />
      </main>
      <Footer />
    </div>
  );
}
