import React, { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import { getCurrentUser } from "@/lib/actions/user.action";
import { Toaster } from "@/components/ui/sonner";
import { redirect } from "next/navigation";
import { UserProvider } from "../context/UserContext";
import PageLoader from "@/components/PageLoader";

export const dynamic = "force-dynamic";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  return (
    <PageLoader>
      <main className="relative flex h-screen bg-gray-100 overflow-hidden">
        <Toaster />
        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:flex lg:flex-shrink-0 relative z-10">
          <Sidebar {...currentUser} />
        </div>

        {/* Main Content Area */}
        <section className="flex flex-1 flex-col min-w-0 bg-gray-50 relative">
          {/* Mobile Navigation - Mobile Only */}
          <div className="lg:hidden relative z-20">
            <MobileNavigation
              userId={currentUser.$id}
              accountId={currentUser.accountId}
              {...currentUser}
            />
          </div>

          {/* Header - Desktop Only */}
          <div className="hidden lg:block relative z-20">
            <Header
              userId={currentUser.$id}
              accountId={currentUser.accountId}
            />
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto bg-white lg:m-2 rounded-xl shadow-sm border border-gray-200 relative z-0">
            <div className="h-full sm:p-6 lg:p-8">
              <UserProvider value={currentUser}>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                  }
                >
                  {children}
                </Suspense>
              </UserProvider>
            </div>
          </div>
        </section>
      </main>
    </PageLoader>
  );
};

export default layout;
