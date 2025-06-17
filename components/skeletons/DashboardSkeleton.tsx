import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        {/* Welcome Header Skeleton */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="hidden lg:block">
                <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Overview Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Storage Usage Chart Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8 h-full">
              <div className="text-center mb-6">
                <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mx-auto"></div>
              </div>
              <div className="flex items-center justify-center mb-6">
                <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Files Section Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="hidden sm:block">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                </div>
              </div>

              <div className="space-y-4">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 min-w-0">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="flex items-center space-x-4">
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                          <div className="h-3 bg-gray-200 rounded w-12"></div>
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
            <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200/50 text-center"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
