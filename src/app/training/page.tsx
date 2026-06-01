import type { Metadata } from "next";
import TrainingClient from "./TrainingClient";

export const metadata: Metadata = {
  title: "Research Academy & Training | Healix BioLabs",
  description: "Access the Healix BioLabs Scientific Training Academy. Train on Scientific Inquiry, hypothesis formulation, literature reviews, and earn verifiable cryptographic research certificates.",
  alternates: {
    canonical: "/training",
  },
};

export default function TrainingPage() {
  return <TrainingClient />;
}
