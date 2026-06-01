import React from "react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import PublicationsClient from "./PublicationsClient";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Publications Portal & Scientific Repository | Healix BioLabs",
  description: "Explore verified biomedical white papers, clinical trials, and literature reviews indexed on the Healix BioLabs platform.",
};

export default async function PublicationsPage() {
  const currentUser = await getCurrentUser();

  // Check if current user has researcher status
  let researcher = null;
  if (currentUser) {
    try {
      researcher = await prisma.researcher.findUnique({
        where: { userId: currentUser.id },
      });
    } catch (err) {
      console.warn("Database offline, using null researcher fallback:", err);
    }
  }

  // Load all approved publications
  let publications: any[] = [];
  try {
    publications = await prisma.publication.findMany({
      where: {
        isApproved: true,
      },
      include: {
        researcher: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (err) {
    console.warn("Database offline, using empty publications fallback:", err);
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />

      <Navbar currentUser={currentUser} />

      <main className="flex-grow pt-28 pb-16">
        <PublicationsClient publications={publications} researcher={researcher} />
      </main>

      <Footer />
    </div>
  );
}
