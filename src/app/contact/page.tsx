import React from "react";
import { getCurrentUser } from "@/lib/auth";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import ContactClient from "./ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Academic Relations | Healix BioLabs",
  description: "Get in touch with Healix BioLabs academic relations and partnership team for inquiries, support, and collaboration proposals.",
};

export default async function ContactPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      <ScientificBackground />

      <Navbar currentUser={currentUser} />

      <main className="flex-grow pt-28 pb-16">
        <ContactClient currentUser={currentUser} />
      </main>

      <Footer />
    </div>
  );
}
