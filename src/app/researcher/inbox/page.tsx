import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import InboxClient from "./InboxClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Researcher Inbox | Healix BioLabs",
  description: "Manage student connections, doubts, and thesis submissions",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResearcherInboxPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "RESEARCHER" && currentUser.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />
      <Navbar currentUser={currentUser} />
      <main className="flex-grow pt-28 pb-16">
        <InboxClient currentUser={currentUser} />
      </main>
      <Footer />
    </div>
  );
}
