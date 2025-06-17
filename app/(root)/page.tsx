import React, { Suspense } from "react";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/files.action";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
import Chart from "@/components/Chart";
import Link from "next/link";
import { MAX_SIZE } from "@/lib/utils";
import Image from "next/image";
import Thumbnail from "@/components/Thumbnail";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

const DashboardContent = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/sign-in");
  }

  // Get storage usage data
  const totalSpace = await getTotalSpaceUsed();
  const usageSummary = getUsageSummary(totalSpace);

  // Get latest files (sorted by updatedAt descending)
  const latestFiles = await getFiles({
    types: [],
    searchText: "",
    sort: "$updatedAt-desc",
    limit: 10,
  });

  // Calculate total used space and percentage
  const totalUsedSpace = Object.values(totalSpace).reduce(
    (sum: number, category: any) => sum + category.size,
    0
  );

  const totalAvailableSpace = MAX_SIZE;
  const usagePercentage = Math.round(
    (totalUsedSpace / totalAvailableSpace) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Welcome Header */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
            </div>

            <div className="relative flex items-center justify-between">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Welcome back,
                  </span>
                  <br />
                  <span className="text-gray-800">
                    {currentUser.fullname}! 👋
                  </span>
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Here's an overview of your file storage and recent activity
                </p>
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex items-center px-3 py-1 bg-green-100 rounded-full">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700">
                      All systems operational
                    </span>
                  </div>
                  <div className="flex items-center px-3 py-1 bg-blue-100 rounded-full">
                    <span className="text-sm font-medium text-blue-700">
                      {usagePercentage}% storage used
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                    <Image
                      src="https://www.clipartmax.com/png/full/40-401525_chart-clipart-statistics-3d-pie-chart-png.png"
                      alt="Dashboard"
                      height={60}
                      width={60}
                      className=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Storage Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {usageSummary.map((summary, index) => (
            <Link
              key={summary.title}
              href={summary.url}
              className="group transform transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 group-hover:bg-white/90">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-cyan-50/0 opacity-0 group-hover:opacity-100 group-hover:from-blue-50/50 group-hover:via-purple-50/30 group-hover:to-cyan-50/50 transition-all duration-500"></div>

                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                        <span className="text-xl">
                          {summary.title === "Documents" && (
                            <Image
                              src="/assets/images/doc.png"
                              alt="doc"
                              height={30}
                              width={30}
                              className="brightness-0 invert"
                            />
                          )}
                          {summary.title === "Images" && (
                            <Image
                              src="https://www.freeiconspng.com/uploads/camera-icon-images--pictures--becuo-3.png"
                              alt="img"
                              height={30}
                              width={30}
                              className="brightness-0 invert"
                            />
                          )}
                          {summary.title === "Media" && (
                            <Image
                              src="https://www.clipartmax.com/png/full/430-4305244_see-also-related-to-unique-red-start-button-button-transparent-video-player.png"
                              alt="media"
                              height={30}
                              width={30}
                              className="brightness-0 invert"
                            />
                          )}
                          {summary.title === "Others" && (
                            <Image
                              src="https://www.freeiconspng.com/uploads/black-question-mark-icon-clip-art-10.png"
                              alt="oth"
                              height={30}
                              width={30}
                              className="brightness-0 invert"
                            />
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                    {summary.title}
                  </h3>

                  <div className="space-y-3">
                    <p className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {convertFileSize(summary.size)}
                    </p>
                    {summary.latestDate && (
                      <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                        Last updated:{" "}
                        {new Date(summary.latestDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Enhanced Progress bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{
                          width: `${Math.min(
                            (summary.size / totalUsedSpace) * 50,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Enhanced Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Storage Usage Chart */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 h-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Storage Usage
                </h2>
                <p className="text-gray-600">
                  {convertFileSize(totalUsedSpace)} of{" "}
                  {convertFileSize(totalAvailableSpace)} used
                </p>
              </div>

              <div className="flex items-center justify-center mb-6">
                <Chart used={totalUsedSpace} total={totalAvailableSpace} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/50 shadow-sm">
                  <span className="text-sm font-semibold text-gray-700 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    Used Space
                  </span>
                  <span className="text-sm font-bold text-blue-600 px-2 py-1 bg-blue-100 rounded-full">
                    {usagePercentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-xl border border-gray-200/50 shadow-sm">
                  <span className="text-sm font-semibold text-gray-700 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Available
                  </span>
                  <span className="text-sm font-bold text-green-600 px-2 py-1 bg-green-100 rounded-full">
                    {convertFileSize(totalAvailableSpace - totalUsedSpace)}
                  </span>
                </div>
              </div>

              {/* Enhanced Storage Health Indicator */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full shadow-sm ${
                      usagePercentage < 70
                        ? "bg-green-400 animate-pulse"
                        : usagePercentage < 90
                        ? "bg-yellow-400 animate-pulse"
                        : "bg-red-400 animate-pulse"
                    }`}
                  ></div>
                  <span className="text-sm font-semibold text-gray-700">
                    Storage Health:{" "}
                    <span
                      className={`${
                        usagePercentage < 70
                          ? "text-green-600"
                          : usagePercentage < 90
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {usagePercentage < 70
                        ? "Excellent"
                        : usagePercentage < 90
                        ? "Good"
                        : "Attention Needed"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Latest Files Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Recent Activity
                  </h2>
                  <p className="text-gray-600">
                    Files you've recently interacted with
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl blur-md opacity-60"></div>
                    <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">⚡</span>
                    </div>
                  </div>
                </div>
              </div>

              {latestFiles.documents && latestFiles.documents.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {latestFiles.documents
                    .slice(0, 6)
                    .map((file: Models.Document, index: number) => (
                      <div
                        key={file.$id}
                        className="group p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200/50 hover:border-blue-300/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                              <Thumbnail
                                type={file.type}
                                extension={file.extension}
                                url={file.url}
                                className="!size-10 drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                                imageClassName="!size-9"
                              />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-300">
                              {file.name}
                            </h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-300">
                                {file.type}
                              </span>
                              <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                {convertFileSize(file.size)}
                              </p>
                              <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                {new Date(file.$updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <Link
                              href={file.url}
                              target="_blank"
                              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-gray-300/50 rounded-full blur-xl"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-4xl text-gray-400">📂</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    No recent activity
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Start uploading files to see your recent activity here
                  </p>
                </div>
              )}

              {latestFiles.documents && latestFiles.documents.length > 6 && (
                <div className="mt-6 text-center">
                  <Link
                    href="/documents"
                    className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    View All Files
                    <svg
                      className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                {
                  name: "Upload Files",
                  icon: "📤",
                  href: "#",
                  color: "from-blue-500 to-indigo-600",
                  description: "Add new files",
                },
                {
                  name: "View Documents",
                  icon: "📄",
                  href: "/documents",
                  color: "from-green-500 to-emerald-600",
                  description: "Browse docs",
                },
                {
                  name: "Browse Images",
                  icon: "🖼️",
                  href: "/images",
                  color: "from-purple-500 to-pink-600",
                  description: "View gallery",
                },
                {
                  name: "Manage Storage",
                  icon: "⚙️",
                  href: "#",
                  color: "from-orange-500 to-red-600",
                  description: "Storage settings",
                },
              ].map((action, index) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200/50 hover:border-blue-300/50 hover:shadow-xl transition-all duration-300 text-center hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                  >
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-700 group-hover:text-blue-700 transition-colors duration-300 mb-1">
                    {action.name}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                    {action.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
};

export default Dashboard;
