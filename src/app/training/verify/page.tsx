import React, { Suspense } from "react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import ScientificBackground from "@/components/canvas/ScientificBackground";
import { getCurrentUser } from "@/lib/auth";
import VerificationPortalClient from "./VerificationPortalClient";
import type { Metadata } from "next";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Credential Verification | Healix BioLabs Academy",
  description: "Verify academic certifications of completion issued by the Healix BioLabs training system.",
};

export default async function VerifyPage() {
  const currentUser = await getCurrentUser();

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-between overflow-x-hidden">
      {/* Scientific SVG Animated Canvas */}
      <ScientificBackground />

      {/* Navbar Navigation */}
      <Navbar currentUser={currentUser} />

      {/* Main Verification Content */}
      <main className="flex-grow pt-28 pb-16">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center text-slate-300">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Loading Portal...</p>
              </div>
            </div>
          }
        >
          <VerificationPortalClient />
        </Suspense>
      </main>

      {/* Footer Details */}
      <Footer />
    </div>
  );
}
