import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import ReaderClient from "./ReaderClient";

import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface PublicationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PublicationPageProps): Promise<Metadata> {
  const { id } = await params;
  const publication = await prisma.publication.findUnique({
    where: { id },
    select: { title: true, abstract: true },
  });

  if (!publication) {
    return {
      title: "Publication | Healix BioLabs",
    };
  }

  return {
    title: `${publication.title} | Healix BioLabs Publication`,
    description: publication.abstract 
      ? (publication.abstract.length > 155 ? `${publication.abstract.slice(0, 152)}...` : publication.abstract)
      : "Read scientific publications and reviews on Healix BioLabs.",
  };
}

export default async function PublicationDetailPage({ params }: PublicationPageProps) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  // Find the publication with ID
  const publication = await prisma.publication.findUnique({
    where: { id },
    include: {
      researcher: true,
    },
  });

  // Verify that the publication exists and is approved,
  // or allow the owner or an admin to preview it!
  if (!publication) {
    notFound();
  }

  const isOwner = currentUser && currentUser.id === publication.researcher.userId;
  const isAdmin = currentUser && currentUser.role === "ADMIN";

  if (!publication.isApproved && !isOwner && !isAdmin) {
    notFound(); // Hide unapproved publications from guests and other users
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />

      <Navbar currentUser={currentUser} />

      <main className="flex-grow pt-28 pb-16">
        <ReaderClient publication={publication} />
      </main>

      <Footer />
    </div>
  );
}
