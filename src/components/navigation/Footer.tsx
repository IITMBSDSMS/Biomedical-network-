"use client";

import React from "react";
import Link from "next/link";
import { Dna } from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/BrandIcons";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    ecosystem: [
      { name: "Researchers", href: "/researchers" },
      { name: "Publications Index", href: "/publications" },
      { name: "Research Projects", href: "/projects" },
      { name: "Fellowships Portal", href: "/fellowships" },
      { name: "Opportunities Board", href: "/opportunities" },
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Contact Support", href: "/contact" },
      { name: "Healix Technologies (Parent Co.)", href: "https://healix-technologies.com", external: true },
    ],
    indexing: [
      { name: "Google Scholar Index", href: "/indexing/google-scholar" },
      { name: "ResearchGate Sync", href: "/indexing/researchgate" },
      { name: "ORCID Sync", href: "/indexing/orcid" },
    ],
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="bg-slate-950/40 border-t border-slate-900 mt-auto pt-16 pb-8 relative z-10 text-slate-400"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 pb-12 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Healix BioLabs"
                className="w-6 h-6 rounded-full object-cover border border-slate-800"
              />
              <span className="text-lg font-heading font-extrabold tracking-tight text-white">
                Healix <span className="text-primary-yellow">BioLabs</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connecting researchers, innovators, students, and institutions through one unified platform. Building the future of biomedical intelligence.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-500 hover:text-accent-blue transition-colors">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/showcase/biolabsofficial/?viewAsMember=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-accent-blue transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/biolabsofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-accent-blue transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links: Ecosystem */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4 font-heading">
              Ecosystem
            </h4>
            <ul className="space-y-2.5">
              {links.ecosystem.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4 font-heading">
              Organization
            </h4>
            <ul className="space-y-2.5">
              {links.company.map((link: any) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-primary-yellow transition-colors font-medium flex items-center space-x-1 group"
                    >
                      <span>{link.name}</span>
                      <svg className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ) : (
                    <Link href={link.href} className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Indexing */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4 font-heading">
              Academic Indexing
            </h4>
            <ul className="space-y-2.5">
              {links.indexing.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-[11px] text-slate-500">
          <p>© {currentYear} Healix Technologies Pvt. Ltd. All rights reserved. A subsidiary of{" "}
            <a href="https://healix-technologies.com" target="_blank" rel="noopener noreferrer" className="text-primary-yellow hover:underline font-semibold">Healix Technologies</a>.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors font-medium">Contact Relations</a>
          </div>
        </div>

      </div>
    </motion.footer>
  );
}
