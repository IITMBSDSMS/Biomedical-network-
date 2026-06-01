import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import GoogleScholarClient from "./GoogleScholarClient";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Google Scholar Profile Integration | Healix BioLabs",
  description:
    "Sync your Google Scholar citations index, publications list, and citation metrics directly into your BioLabs researcher profile.",
  openGraph: {
    title: "Google Scholar Integration | Healix BioLabs",
    description: "Sync publication metrics and citation counts dynamically using Scholar profile integrations.",
    type: "website",
  },
};

export default async function GoogleScholarPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />
      <Navbar currentUser={currentUser} />
      <main className="flex-grow pt-28 pb-16">
        <GoogleScholarClient currentUser={currentUser} />
      </main>
      <Footer />
    </div>
  );
}
