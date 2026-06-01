import type { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Researcher Portal Login | Healix BioLabs",
  description: "Log in or register your account at India's Biomedical Research Network. Authenticate with Supabase, Clerk, or developer sandbox profiles to manage your research score, indexing, and opportunities.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
