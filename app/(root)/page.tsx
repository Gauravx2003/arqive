import React from "react";
import { getCurrentUser } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/files.action";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
import Chart from "@/components/Chart";
import Link from "next/link";
import { MAX_SIZE } from "@/lib/utils";

const Dashboard = async () => {
  const currentUser = await getCurrentUser();

  // if (!currentUser) {
  //   redirect("/sign-in");
  // }

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

  // Assuming 15GB total storage (you can make this dynamic)
  const totalAvailableSpace = MAX_SIZE; // 15GB in bytes
  const usagePercentage = Math.round(
    (totalUsedSpace / totalAvailableSpace) * 100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {currentUser.fullname}! 👋
                </h1>
                <p className="text-gray-600 text-lg">
                  Here's an overview of your file storage and recent activity
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {usageSummary.map((summary, index) => (
            <Link
              key={summary.title}
              href={summary.url}
              className="group transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group-hover:bg-white/90">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <span className="text-xl">
                      {summary.title === "Documents" && "📄"}
                      {summary.title === "Images" && "🖼️"}
                      {summary.title === "Media" && "🎥"}
                      {summary.title === "Others" && "📁"}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                  {summary.title}
                </h3>

                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-800">
                    {convertFileSize(summary.size)}
                  </p>
                  {summary.latestDate && (
                    <p className="text-sm text-gray-500">
                      Last updated:{" "}
                      {new Date(summary.latestDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (summary.size / totalUsedSpace) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Storage Usage Chart - Center of Attraction */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8 h-full">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Storage Usage
                </h2>
                <p className="text-gray-600">
                  {convertFileSize(totalUsedSpace)} of{" "}
                  {convertFileSize(totalAvailableSpace)} used
                </p>
              </div>

              {/* Chart Component */}
              <div className="flex items-center justify-center mb-6">
                <Chart used={totalUsedSpace} total={totalAvailableSpace} />
              </div>

              {/* Usage Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Used Space
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {usagePercentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    Available
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {convertFileSize(totalAvailableSpace - totalUsedSpace)}
                  </span>
                </div>
              </div>

              {/* Storage Health Indicator */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      usagePercentage < 70
                        ? "bg-green-400"
                        : usagePercentage < 90
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {usagePercentage < 70
                      ? "Healthy"
                      : usagePercentage < 90
                      ? "Moderate"
                      : "High Usage"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Files Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Recent Activity
                  </h2>
                  <p className="text-gray-600">
                    Files you've recently interacted with
                  </p>
                </div>
                <div className="hidden sm:block">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-xl">⚡</span>
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
                        className="group p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200/50 hover:border-blue-300/50 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow duration-300">
                              <span className="text-xl">
                                {file.type === "document" && "📄"}
                                {file.type === "image" && "🖼️"}
                                {(file.type === "video" ||
                                  file.type === "audio") &&
                                  "🎥"}
                                {file.type === "other" && "📁"}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-300">
                              {file.name}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1">
                              <p className="text-xs text-gray-500 capitalize">
                                {file.type}
                              </p>
                              <p className="text-xs text-gray-500">
                                {convertFileSize(file.size)}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(file.$updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <Link
                              href={file.url}
                              target="_blank"
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                            >
                              View
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-gray-400">📂</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No recent activity
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start uploading files to see your recent activity here
                  </p>
                </div>
              )}

              {latestFiles.documents && latestFiles.documents.length > 6 && (
                <div className="mt-6 text-center">
                  <Link
                    href="/documents"
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                  >
                    View All Files
                    <svg
                      className="ml-2 w-4 h-4"
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

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 lg:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  name: "Upload Files",
                  icon: "📤",
                  href: "#",
                  color: "from-blue-500 to-indigo-600",
                },
                {
                  name: "View Documents",
                  icon: "📄",
                  href: "/documents",
                  color: "from-green-500 to-emerald-600",
                },
                {
                  name: "Browse Images",
                  icon: "🖼️",
                  href: "/images",
                  color: "from-purple-500 to-pink-600",
                },
                {
                  name: "Manage Storage",
                  icon: "⚙️",
                  href: "#",
                  color: "from-orange-500 to-red-600",
                },
              ].map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200/50 hover:border-blue-300/50 hover:shadow-md transition-all duration-300 text-center"
                >
                  <div
                    className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300`}
                  >
                    <span className="text-xl">{action.icon}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors duration-300">
                    {action.name}
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

export default Dashboard;
