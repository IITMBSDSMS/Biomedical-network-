import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import FellowshipsClient from "./FellowshipsClient";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Healix Research Fellowship | Biomedical Internships",
  description: "Apply for the Healix Research Fellowship. Collaborate with India's leading scientists, access state-of-the-art labs, and publish research.",
};

export default async function FellowshipsPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />

      <Navbar currentUser={currentUser} />

      <main className="flex-grow pt-28 pb-16">
        <FellowshipsClient currentUser={currentUser} />
      </main>

      <Footer />
    </div>
  );
}
