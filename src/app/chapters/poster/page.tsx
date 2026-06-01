import React from "react";
import PosterClient from "./PosterClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campus Ambassador Program Poster | Healix BioLabs",
  description: "Official Campus Ambassador program print-ready poster for Healix BioLabs.",
};

export default function AmbassadorPosterPage() {
  return <PosterClient />;
}
