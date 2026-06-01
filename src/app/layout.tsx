import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import HealixSplash from "@/components/ui/HealixSplash";

const displayFont = {
  variable: "font-heading",
};

const bodyFont = {
  variable: "font-sans",
};

export const metadata: Metadata = {
  title: "Healix BioLabs | India's Biomedical Research Network",
  description: "Connecting Researchers, Innovators, Students and Institutions Through One Unified Platform. Building the Future of Biomedical Intelligence.",
  keywords: ["biomedical research", "india research network", "biolabs", "bioinformatics", "genomics", "clinical research", "scientific collaboration"],
  authors: [{ name: "Healix Technologies Pvt. Ltd." }],
  creator: "Healix Technologies",
  publisher: "Healix Technologies",
  metadataBase: new URL("https://healix-biolabs.org"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Healix BioLabs | India's Biomedical Research Network",
    description: "Connecting Researchers, Innovators, Students and Institutions Through One Unified Platform.",
    url: "https://healix-biolabs.org",
    siteName: "Healix BioLabs",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix BioLabs | India's Biomedical Research Network",
    description: "Connecting Researchers, Innovators, Students and Institutions Through One Unified Platform.",
    creator: "@HealixBioLabs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkEnabled = publishableKey && publishableKey !== "pk_test_placeholder" && publishableKey.startsWith("pk_");

  const appLayout = (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {/* Global session splash preloader — shown once per browser session */}
        <HealixSplash />
        {children}
      </body>
    </html>
  );

  if (isClerkEnabled) {
    return (
      <ClerkProvider publishableKey={publishableKey}>
        {appLayout}
      </ClerkProvider>
    );
  }

  return appLayout;
}
