"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = ({
  fullname,
  email,
  avatar,
}: {
  fullname: string;
  avatar: string;
  email: string;
}) => {
  const pathname = usePathname();

  return (
    <aside className="sidebar remove-scrollbar w-64 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-xl flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-slate-700/50">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start"
        >
          <Image
            src="/assets/images/logo.png"
            alt="Arqive Logo"
            width={140}
            height={40}
            className="hidden h-auto lg:block invert rounded-4xl"
          />
          <Image
            src="/assets/icons/logo-brand.svg"
            alt="Arqive"
            width={40}
            height={40}
            className="lg:hidden brightness-0 invert"
          />
        </Link>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <li key={item.name}>
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden",
                    "hover:bg-slate-700/50 hover:shadow-lg hover:scale-105",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 animate-pulse"></div>
                  )}
                  <Image
                    src={item.icon}
                    alt={`${item.name} icon`}
                    width={20}
                    height={20}
                    className={cn(
                      "transition-all duration-300 relative z-10",
                      isActive
                        ? "brightness-0 invert"
                        : "opacity-70 group-hover:opacity-100"
                    )}
                  />
                  <span
                    className={cn(
                      "ml-3 font-medium text-sm hidden lg:block transition-all duration-300 relative z-10",
                      isActive
                        ? "text-white font-semibold"
                        : "text-slate-300 group-hover:text-white"
                    )}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info Section */}
      <div className="px-6 py-4 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={avatar}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-blue-500/50 shadow-lg"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800 shadow-sm"></div>
          </div>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="text-sm font-semibold text-white capitalize truncate">
              {fullname}
            </p>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
