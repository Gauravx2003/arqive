import React from "react";
import Image from "next/image";
import PageLoader from "@/components/PageLoader";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageLoader>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <section className="hidden lg:flex lg:w-2/5 xl:w-2/5 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          </div>
          <div className="flex flex-col justify-center items-center p-10 w-full z-10">
            <div className="max-w-[400px] text-center space-y-8">
              {/* Logo */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
                <Image
                  src="/assets/images/logo.png"
                  alt="Arqive Logo"
                  width={180}
                  height={68}
                  className="h-auto"
                />
              </div>

              {/* Brand Text */}
              <div className="space-y-4 text-white">
                <h1 className="text-4xl font-bold tracking-tight">
                  Manage Files
                  <span className="block text-2xl font-normal text-blue-100 mt-2">
                    Securely
                  </span>
                </h1>
                <p className="text-lg text-blue-100 leading-relaxed">
                  Store, organize, and access your files from anywhere with
                  enterprise-grade security
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-blue-100">Secure</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <p className="text-xs text-blue-100">Organized</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-blue-100">Synced</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side - Form Section */}
        <section className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-8 text-center">
              <div className="inline-block bg-white rounded-xl p-4 shadow-lg">
                <Image
                  src="/assets/icons/logo-full-brand.svg"
                  alt="Arqive Logo"
                  width={160}
                  height={60}
                  className="h-auto"
                />
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 lg:p-10">
              {children}
            </div>

            {/* Footer Text */}
            <p className="text-center text-sm text-slate-500 mt-6">
              Trusted by thousands of users worldwide
            </p>
          </div>
        </section>
      </div>
    </PageLoader>
  );
};

export default layout;
