import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { getCurrentUser } from "@/lib/actions/user.action";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  return (
    <main className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop Only */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar {...currentUser} />
      </div>

      {/* Main Content Area */}
      <section className="flex flex-1 flex-col min-w-0 bg-gray-50">
        {/* Mobile Navigation - Mobile Only */}
        <div className="lg:hidden">
          <MobileNavigation
            userId={currentUser.$id}
            accountId={currentUser.accountId}
            {...currentUser}
          />
        </div>

        {/* Header - Desktop Only */}
        <div className="hidden lg:block">
          <Header userId={currentUser.$id} accountId={currentUser.accountId} />
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-white m-2 lg:m-4 rounded-xl shadow-sm border border-gray-200">
          <div className="h-full p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </section>

      <Toaster />
    </main>
  );
};

export default layout;
