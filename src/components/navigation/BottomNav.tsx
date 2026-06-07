"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BookOpen, Briefcase, User, ShieldAlert } from "lucide-react";
import { HealixUser } from "@/lib/auth";

interface BottomNavProps {
  currentUser: HealixUser | null;
}

export default function BottomNav({ currentUser }: BottomNavProps) {
  const pathname = usePathname();

  // Define tabs
  const tabs = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Academy",
      href: "/training",
      icon: BookOpen,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: Briefcase,
    },
  ];

  // Dynamic Profile / Dashboard link based on user login & role
  let profileHref = "/login";
  let profileLabel = "Sign In";
  let ProfileIcon = User;

  if (currentUser) {
    profileLabel = currentUser.name ? currentUser.name.split(" ")[0] : "Profile";
    if (currentUser.role === "ADMIN") {
      profileHref = "/admin";
      ProfileIcon = ShieldAlert;
      profileLabel = "Admin";
    } else if (currentUser.role === "RESEARCHER") {
      profileHref = `/researcher/inbox`;
      profileLabel = "Inbox";
    }
  }

  tabs.push({
    name: profileLabel,
    href: profileHref,
    icon: ProfileIcon,
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-950/80 backdrop-blur-lg border-t border-slate-900/80 px-2 pt-2.5 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.4)] flex justify-around items-center">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = pathname === tab.href || (tab.href !== "/" && pathname.startsWith(tab.href));

        return (
          <Link key={tab.name} href={tab.href} className="relative flex flex-col items-center justify-center w-16 py-1 select-none">
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center justify-center text-center cursor-pointer"
            >
              <div
                className={`p-1 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-accent-blue bg-accent-blue/10 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                    : "text-slate-500 hover:text-slate-350"
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <span
                className={`text-[9px] font-bold tracking-wider uppercase mt-1 transition-colors ${
                  isActive ? "text-white" : "text-slate-500"
                }`}
              >
                {tab.name}
              </span>
            </motion.div>
            
            {isActive && (
              <motion.span
                layoutId="activeBottomTabLine"
                className="absolute top-0 w-8 h-[2px] bg-accent-blue rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
