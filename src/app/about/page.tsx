import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import AboutClient from "./AboutClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "About Us | Healix BioLabs",
  description: "Learn about Healix Technologies and our mission to build a premium, unified biomedical intelligence and research network in India.",
};

export default async function AboutPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />
      <Navbar currentUser={currentUser} />
      <main className="flex-grow pt-28 pb-16">
        <AboutClient currentUser={currentUser} />
      </main>
      <Footer />
    </div>
  );
}
