"use client";

import React from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";

import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import { LogOut } from "@/lib/actions/user.action";

const MobileNavigation = ({
  fullname,
  avatar,
  email,
  userId,
  accountId,
}: {
  fullname: string;
  avatar: string;
  email: string;
  userId: string;
  accountId: string;
}) => {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="mobile-header bg-white border-b border-gray-200 shadow-sm relative z-30">
      <div className="flex justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/images/logo.png"
            alt="Arqive"
            width={100}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        {/* Menu Trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Image
                src="/assets/icons/menu.svg"
                alt="Menu"
                width={24}
                height={24}
                className="text-gray-700"
              />
            </button>
          </SheetTrigger>

          <SheetContent className="w-80 h-full bg-white p-0 flex flex-col z-[10000]">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

            {/* Header with User Info */}
            <div className="px-6 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    height={48}
                    width={48}
                    className="rounded-full ring-2 ring-white shadow-sm"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize truncate">
                    {fullname}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.url}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center px-4 py-3 rounded-lg transition-all duration-200 w-full",
                          "hover:bg-gray-50 hover:shadow-sm",
                          isActive
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 text-blue-700 shadow-sm"
                            : "text-gray-700 hover:text-gray-900"
                        )}
                      >
                        <Image
                          src={item.icon}
                          alt={`${item.name} icon`}
                          width={20}
                          height={20}
                          className={cn(
                            "transition-colors duration-200",
                            isActive ? "text-blue-600" : "text-gray-500"
                          )}
                        />
                        <span
                          className={cn(
                            "ml-4 font-medium text-base",
                            isActive ? "text-blue-700" : "text-gray-700"
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

            {/* Bottom Actions */}
            <div className="px-4 py-6 border-t border-gray-100 bg-gray-50 space-y-4">
              {/* File Uploader */}
              <div className="w-full">
                <FileUploader ownerId={userId} accountId={accountId} />
              </div>

              {/* Logout Button */}
              <Button
                type="button"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                onClick={async () => {
                  await LogOut();
                  setOpen(false);
                }}
              >
                <Image
                  src="/assets/icons/logout.svg"
                  alt="Logout"
                  width={18}
                  height={18}
                  className="text-white"
                />
                <span>Logout</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default MobileNavigation;
