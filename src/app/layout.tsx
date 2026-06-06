import type { Metadata } from "next";
import "./globals.css";
import HealixSplash from "@/components/ui/HealixSplash";
import AuthSync from "@/components/auth/AuthSync";

const displayFont = { variable: "font-heading" };
const bodyFont = { variable: "font-sans" };

export const metadata: Metadata = {
  title: {
    default: "Healix BioLabs | India's #1 Biomedical Research Network",
    template: "%s | Healix BioLabs",
  },
  description:
    "Healix BioLabs is India's premier biomedical research network — connecting researchers, innovators, students and institutions through one unified platform. Join 500+ researchers, publish papers, apply for fellowships, and collaborate on cutting-edge biomedical projects.",
  keywords: [
    "healix biolabs",
    "biomedical research india",
    "india research network",
    "biolabs india",
    "bioinformatics platform",
    "genomics research",
    "clinical research india",
    "scientific collaboration",
    "research fellowship india",
    "medical research students",
    "AIIMS research network",
    "IIT biomedical research",
    "research publication platform",
    "campus ambassador biomedical",
    "healix technologies",
    "biomedical intelligence",
    "research network students india",
    "open science india",
  ],
  authors: [{ name: "Healix Technologies Pvt. Ltd.", url: "https://healix-technologies.com" }],
  creator: "Healix Technologies",
  publisher: "Healix Technologies Pvt. Ltd.",
  metadataBase: new URL("https://biolabsresearch-healix.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Healix BioLabs | India's #1 Biomedical Research Network",
    description:
      "Connecting researchers, innovators, students and institutions through India's most advanced biomedical research platform. Publish papers, apply for fellowships, collaborate on projects.",
    url: "https://biolabsresearch-healix.com",
    siteName: "Healix BioLabs",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Healix BioLabs — India's Biomedical Research Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healix BioLabs | India's #1 Biomedical Research Network",
    description:
      "Connecting researchers, innovators, students and institutions through India's most advanced biomedical research platform.",
    creator: "@HealixBioLabs",
    site: "@HealixBioLabs",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/logo.png", type: "image/png", sizes: "180x180" }],
    shortcut: "/logo.png",
  },
  manifest: "/manifest.json",
  category: "Science & Education",
  classification: "Biomedical Research Platform",
  verification: {
    google: "healix-biolabs-google-site-verification",
  },
  other: {
    "application-name": "Healix BioLabs",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Healix BioLabs",
    "format-detection": "telephone=no",
    "theme-color": "#0B0F19",
  },
};

// JSON-LD structured data for rich Google search results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://biolabsresearch-healix.com/#organization",
      name: "Healix BioLabs",
      url: "https://biolabsresearch-healix.com",
      logo: {
        "@type": "ImageObject",
        url: "https://biolabsresearch-healix.com/logo.png",
        width: 512,
        height: 512,
      },
      description:
        "India's premier biomedical research network connecting researchers, innovators, students and institutions.",
      parentOrganization: {
        "@type": "Organization",
        name: "Healix Technologies Pvt. Ltd.",
        url: "https://healix-technologies.com",
      },
      sameAs: [
        "https://healix-technologies.com",
        "https://linkedin.com/company/healix-biolabs",
        "https://twitter.com/HealixBioLabs",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        availableLanguage: ["English", "Hindi"],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://biolabsresearch-healix.com/#website",
      url: "https://biolabsresearch-healix.com",
      name: "Healix BioLabs",
      description: "India's Biomedical Research Network",
      publisher: {
        "@id": "https://biolabsresearch-healix.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate:
            "https://biolabsresearch-healix.com/researchers?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://biolabsresearch-healix.com/#webpage",
      url: "https://biolabsresearch-healix.com",
      name: "Healix BioLabs | India's #1 Biomedical Research Network",
      isPartOf: { "@id": "https://biolabsresearch-healix.com/#website" },
      about: { "@id": "https://biolabsresearch-healix.com/#organization" },
      description:
        "Connecting researchers, innovators, students and institutions through India's most advanced biomedical research platform.",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://biolabsresearch-healix.com",
          },
        ],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <head>
        {/* JSON-LD Structured Data — boosts Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicon overrides */}
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#0B0F19" />
        <meta name="msapplication-TileColor" content="#0B0F19" />
        <meta name="msapplication-TileImage" content="/logo.png" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {/* Global session splash preloader — shown once per browser session */}
        <HealixSplash />
        {/* Client-to-server token synchronization listener */}
        <AuthSync />
        {children}
      </body>
    </html>
  );
}
