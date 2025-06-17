"use client";

import React from "react";
import Image from "next/image";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[10001] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo with glow effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
            <Image
              src="/assets/images/logo.png"
              alt="Arqive Logo"
              width={200}
              height={75}
              className="h-auto mx-auto"
              priority
            />
          </div>
        </div>

        {/* Loading animation */}
        <div className="space-y-6">
          {/* Animated dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-bounce"></div>
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800 animate-pulse">
              Loading Arqive
            </h2>
            <p className="text-gray-600 animate-pulse">
              Preparing your secure file storage...
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-64 mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/30 rounded-full animate-ping [animation-delay:1s]"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-indigo-400/30 rounded-full animate-ping [animation-delay:2s]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400/30 rounded-full animate-ping [animation-delay:3s]"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
