"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User as UserIcon, LogOut, ChevronDown, BookOpen, Inbox } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { HealixUser } from "@/lib/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isClerkEnabled = !!(publishableKey && publishableKey !== "pk_test_placeholder" && publishableKey.startsWith("pk_"));

interface NavbarProps {
  currentUser: HealixUser | null;
}

function ClerkSignOutButton({
  onSignOutSuccess,
  className,
  children,
}: {
  onSignOutSuccess: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: "/" });
      onSignOutSuccess();
    } catch (err) {
      console.error("Clerk SignOut failed:", err);
    }
  };

  return (
    <button onClick={handleSignOut} className={className}>
      {children}
    </button>
  );
}

export default function Navbar({ currentUser }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Researchers", href: "/researchers" },
    { name: "Publications", href: "/publications" },
    { name: "Projects", href: "/projects" },
    { name: "Academy", href: "/training" },
    { name: "Fellowships", href: "/fellowships" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "Chapters", href: "/chapters" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  if (currentUser?.role === "ADMIN") {
    navLinks.push({ name: "Admin Console", href: "/admin" });
  }

  const handleLogout = async () => {
    try {
      // Clear session cookies server-side
      await fetch("/api/auth/logout", { method: "POST" });

      // Clear session cookies client-side
      document.cookie = "healix_supabase_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "healix_mock_user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
      
      setAuthDropdownOpen(false);
      router.refresh();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isHome = pathname === "/";
  const isLandingPage = pathname === "/" || pathname === "/fellowships";
  const isLightPage = false;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 flex flex-col transition-all duration-300 ${
        isLandingPage && !(scrolled || mobileMenuOpen) ? "" : "shadow-sm"
      }`}
    >
      {/* Top Cap Bar: Parent Organization (Harvard style) - hidden on homepage */}
      {!isLandingPage && (
        <div className={`py-2 px-4 sm:px-6 lg:px-8 border-b transition-all duration-300 ${
          isLightPage 
            ? "bg-slate-50 text-slate-500 border-slate-200/80" 
            : "bg-slate-950 text-slate-400 border-slate-900/80"
        }`}>
          <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[9px] sm:text-[10px] font-bold tracking-widest uppercase">
            <span>Healix Technologies Pvt. Ltd.</span>
            <span className={`opacity-80 hidden sm:inline ${
              isLightPage ? "text-[#2563EB]" : "text-primary-yellow"
            }`}>
              Biomedical Intelligence Network
            </span>
          </div>
        </div>
      )}

      {/* Main navigation header */}
      <div
        className={`w-full transition-all duration-300 ${
          isLandingPage && !(scrolled || mobileMenuOpen)
            ? "bg-transparent py-5"
            : isLightPage
              ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-3.5 shadow-xs"
              : "bg-slate-950/90 backdrop-blur-md border-b border-slate-900/80 py-3.5 shadow-md"
        }`}
      >
        <div className="max-w-[1850px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5">
              <img
                src="/logo.png"
                alt="Healix BioLabs"
                className={`w-8 h-8 rounded-full object-cover shadow-sm border ${
                  isLightPage ? "border-slate-200" : "border-slate-800"
                }`}
              />
              <span className={`text-xl font-heading font-extrabold tracking-tight transition-colors ${
                isLightPage ? "text-[#0F172A]" : "text-white"
              }`}>
                Healix <span className={isLightPage ? "text-[#2563EB]" : "text-primary-yellow"}>BioLabs</span>
              </span>
            </Link>
 
            {/* Desktop Navigation Links (Harvard Style - Centered & Premium) */}
            <nav className="hidden lg:flex space-x-9">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-xs font-bold uppercase tracking-widest transition-colors ${
                      isActive 
                        ? isLightPage
                          ? "text-[#2563EB] font-extrabold"
                          : "text-accent-blue font-extrabold"
                        : isLightPage
                          ? "text-slate-500 hover:text-[#0F172A]"
                          : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavLine"
                        className={`absolute -bottom-2 left-0 right-0 h-[2.5px] rounded-full ${
                          isLightPage ? "bg-[#2563EB]" : "bg-accent-blue"
                        }`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
 
            {/* Right Action Bar */}
            <div className="hidden lg:flex items-center space-x-4">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none border cursor-pointer ${
                      isLightPage
                        ? "bg-slate-50 hover:bg-slate-100 border-slate-200 text-[#0F172A]"
                        : "bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-white"
                    }`}
                  >
                    <img
                      src={currentUser.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                      alt={currentUser.name || "User"}
                      className={`w-4 h-4 rounded-full object-cover border ${
                        isLightPage ? "border-slate-200" : "border-slate-800"
                      }`}
                    />
                    <span className={`font-bold ${isLightPage ? "text-[#0F172A]" : "text-white"}`}>{currentUser.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 ${isLightPage ? "text-slate-500" : "text-slate-300"}`} />
                  </button>
 
                  <AnimatePresence>
                    {authDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl p-2 z-50 border ${
                          isLightPage
                            ? "bg-white border-slate-200 text-slate-800"
                            : "bg-slate-900 border border-slate-800 text-slate-200"
                        }`}
                      >
                        <div className={`px-3 py-2 border-b mb-1 ${
                          isLightPage ? "border-slate-100" : "border-slate-800"
                        }`}>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                          <p className={`text-xs font-bold truncate ${
                            isLightPage ? "text-slate-800" : "text-slate-300"
                          }`}>{currentUser.email}</p>
                          <span className={`inline-block mt-1.5 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
                            isLightPage
                              ? "bg-blue-50 text-[#2563EB] border-blue-100"
                              : "bg-blue-950/50 text-accent-blue border-blue-900/50"
                          }`}>
                            {currentUser.role}
                          </span>
                        </div>
                        
                        {currentUser.role === "RESEARCHER" && currentUser.researcherId && (
                          <Link
                            href={`/researcher/${currentUser.researcherSlug || currentUser.email.split("@")[0].replace(".", "-")}`}
                            onClick={() => setAuthDropdownOpen(false)}
                            className={`flex items-center space-x-2 px-3 py-2 text-xs rounded-lg transition-all font-semibold ${
                              isLightPage
                                ? "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                            }`}
                          >
                            <UserIcon className={`w-3.5 h-3.5 ${isLightPage ? "text-slate-400" : "text-slate-500"}`} />
                            <span>My Research Profile</span>
                          </Link>
                        )}

                        {currentUser.role === "RESEARCHER" && currentUser.researcherId && (
                          <Link
                            href="/researcher/inbox"
                            onClick={() => setAuthDropdownOpen(false)}
                            className={`flex items-center space-x-2 px-3 py-2 text-xs rounded-lg transition-all font-semibold ${
                              isLightPage
                                ? "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"
                                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                            }`}
                          >
                            <Inbox className={`w-3.5 h-3.5 ${isLightPage ? "text-slate-400" : "text-emerald-500"}`} />
                            <span>My Inbox</span>
                          </Link>
                        )}

                        <Link
                          href="/training"
                          onClick={() => setAuthDropdownOpen(false)}
                          className={`flex items-center space-x-2 px-3 py-2 text-xs rounded-lg transition-all font-semibold ${
                            isLightPage
                              ? "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"
                              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                          }`}
                        >
                          <BookOpen className={`w-3.5 h-3.5 ${isLightPage ? "text-slate-400" : "text-slate-500"}`} />
                          <span>Training Academy</span>
                        </Link>
 
                        {isClerkEnabled ? (
                          <ClerkSignOutButton
                            onSignOutSuccess={() => {
                              setAuthDropdownOpen(false);
                              router.refresh();
                            }}
                            className={`flex items-center space-x-2 w-full text-left px-3 py-2 text-xs rounded-lg transition-all font-semibold cursor-pointer ${
                              isLightPage
                                ? "text-rose-600 hover:bg-rose-50"
                                : "text-rose-450 hover:bg-rose-950/20"
                            }`}
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </ClerkSignOutButton>
                        ) : (
                          <button
                            onClick={handleLogout}
                            className={`flex items-center space-x-2 w-full text-left px-3 py-2 text-xs rounded-lg transition-all font-semibold cursor-pointer ${
                              isLightPage
                                ? "text-rose-600 hover:bg-rose-50"
                                : "text-rose-450 hover:bg-rose-950/20"
                            }`}
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`flex items-center space-x-1.5 text-[10px] font-bold tracking-wider uppercase px-4 py-2.5 rounded-lg transition-all duration-200 cursor-pointer shadow-sm ${
                    isLandingPage && !(scrolled || mobileMenuOpen)
                      ? "bg-white hover:bg-slate-100 !text-slate-950"
                      : isLightPage
                        ? "bg-[#2563EB] hover:bg-blue-700 text-white"
                        : "bg-[#3B82F6] hover:bg-blue-600 text-white"
                  }`}
                >
                  <span className={isLandingPage && !(scrolled || mobileMenuOpen) ? "!text-slate-950" : ""}>Sign In</span>
                </Link>
              )}
            </div>
 
            {/* Mobile hamburger toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-1 focus:outline-none transition-colors cursor-pointer ${
                  isLightPage ? "text-[#0F172A] hover:text-slate-600" : "text-white hover:text-slate-200"
                }`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
 
          </div>
        </div>
      </div>
 
      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden overflow-hidden shadow-lg border-b ${
              isLightPage 
                ? "bg-white border-slate-200" 
                : "bg-slate-950 border-slate-900"
            }`}
          >
            <div className={`px-4 pt-2 pb-6 space-y-2 ${isLightPage ? "text-slate-650" : "text-slate-300"}`}>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-bold uppercase tracking-wider ${
                    pathname === link.href 
                      ? isLightPage ? "text-[#2563EB]" : "text-accent-blue" 
                      : isLightPage ? "text-slate-500 hover:text-[#0F172A]" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
 
              <div className={`border-t pt-4 mt-2 ${isLightPage ? "border-slate-100" : "border-slate-800"}`}>
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={currentUser.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`}
                        alt={currentUser.name || "User"}
                        className={`w-8 h-8 rounded-full border ${
                          isLightPage ? "border-slate-200" : "border-slate-800"
                        }`}
                      />
                      <div>
                        <p className={`text-xs font-bold ${isLightPage ? "text-slate-800" : "text-white"}`}>{currentUser.name}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[200px]">{currentUser.email}</p>
                      </div>
                    </div>
                    {isClerkEnabled ? (
                      <ClerkSignOutButton
                        onSignOutSuccess={() => {
                          setMobileMenuOpen(false);
                          router.refresh();
                        }}
                        className={`flex items-center space-x-2 text-xs font-bold w-full px-3 py-2 rounded-lg cursor-pointer ${
                          isLightPage
                            ? "text-rose-600 bg-rose-50"
                            : "text-rose-450 bg-rose-950/20"
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </ClerkSignOutButton>
                    ) : (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className={`flex items-center space-x-2 text-xs font-bold w-full px-3 py-2 rounded-lg cursor-pointer ${
                          isLightPage
                            ? "text-rose-600 bg-rose-50"
                            : "text-rose-450 bg-rose-950/20"
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-center space-x-2 text-xs font-bold w-full px-3 py-2.5 rounded-lg text-center ${
                        isLightPage
                          ? "bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm"
                          : "bg-slate-900 border border-slate-800 text-white"
                      }`}
                    >
                      <span>Sign In</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
