import React from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import GalleryClient from "./GalleryClient";
import { getCurrentUser } from "@/lib/auth";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event Gallery & Scientific Works | Healix BioLabs",
  description: "Browse the official gallery of Healix BioLabs, showcasing high-resolution research posters, symposium events, bulletins, and biological innovation works.",
};

export default async function GalleryPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      {/* Scientific SVG Animated Canvas */}
      <ScientificBackground />

      {/* Navbar Navigation */}
      <Navbar currentUser={currentUser} />

      {/* Main Page Area */}
      <main className="flex-grow pt-28 pb-16">
        <GalleryClient />
      </main>

      {/* Footer Details */}
      <Footer />
    </div>
  );
}
