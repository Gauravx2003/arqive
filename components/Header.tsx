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
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Section */}
        <div className="flex-1 max-w-2xl">
          <Search />
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 ml-6">
          {/* File Uploader */}
          <div className="hidden sm:block">
            <FileUploader ownerId={userId} accountId={accountId} />
          </div>

          {/* Logout Button */}
          <form action={LogOut}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 px-4 py-2 border-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-200"
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
