import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import Search from "@/components/Search";
import { LogOut } from "@/lib/actions/user.action";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-sm border-b border-white/20 mx-1 mt-1 rounded-xl">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Section with enhanced styling */}
        <div className="flex-1 max-w-2xl relative z-40">
          <div className="relative">
            {/* Gradient background for search container */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-3xl blur-sm"></div>
            <div className="relative">
              <Search />
            </div>
          </div>
        </div>

        {/* Right Actions with enhanced styling */}
        <div className="flex items-center space-x-4 ml-6 relative z-30">
          {/* File Uploader with glow effect */}
          <div className="hidden sm:block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <FileUploader ownerId={userId} accountId={accountId} />
            </div>
          </div>

          {/* Logout Button with enhanced styling */}
          <form
            action={async () => {
              "use server";
              await LogOut();
            }}
          >
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="group flex items-center space-x-2 px-4 py-2.5 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="Logout"
                width={18}
                height={18}
                className="opacity-70 group-hover:opacity-100 transition-opacity duration-200"
              />
              <span className="hidden md:inline font-medium">Logout</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
    </header>
  );
};

export default Header;
