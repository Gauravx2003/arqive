import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FileUploader from "@/components/FileUploader";
import Search from "@/components/Search";
import { LogOut } from "@/lib/actions/user.action";
import Sort from "./Sort";

const Header = ({
  userId,
  accountId,
}: {
  userId: string;
  accountId: string;
}) => {
  return (
    <header className="backdrop-blur-md bg-white/30 shadow-sm border-b rounded-xl border-white/20 mx-1 mt-1 relative z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Section */}
        <div className="flex-1 max-w-2xl relative z-40">
          <Search />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 ml-6 relative z-30">
          {/* File Uploader */}
          <div className="hidden sm:block">
            <FileUploader ownerId={userId} accountId={accountId} />
          </div>

          {/* Logout Button */}
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
              className="flex items-center space-x-2 px-4 py-4.5 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="Logout"
                width={18}
                height={18}
                className="opacity-70"
              />
              <span className="hidden md:inline font-medium">Logout</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
