"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/files.action";
import { getFileTypesParams } from "@/lib/utils";
import Sort from "@/components/Sort";
import Image from "next/image";
import dynamic from "next/dynamic";
import FileListSkeleton from "./skeletons/FileListSkeleton";
import { Models } from "node-appwrite";

const Card = dynamic(() => import("@/components/Card"), {
  loading: () => (
    <div className="animate-pulse bg-gray-200 rounded-xl h-48"></div>
  ),
  ssr: false,
});

const getDisplayName = (type: string) => {
  if (!type) return "All Files";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    documents: "/assets/images/doc.png",
    images:
      "https://www.freeiconspng.com/uploads/camera-icon-images--pictures--becuo-3.png",
    media:
      "https://www.clipartmax.com/png/full/430-4305244_see-also-related-to-unique-red-start-button-button-transparent-video-player.png",
    audios:
      "https://www.clipartmax.com/png/full/430-4305244_see-also-related-to-unique-red-start-button-button-transparent-video-player.png",
    others:
      "https://www.freeiconspng.com/uploads/black-question-mark-icon-clip-art-10.png",
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl blur-md opacity-60"></div>
      <div className="relative p-2 bg-white rounded-xl shadow-sm">
        <Image
          src={icons[type] || icons["others"]}
          alt={type}
          height={50}
          width={50}
          className="transition-transform duration-200 hover:scale-110"
        />
      </div>
    </div>
  );
};

const ClientFilesPage = ({ type }: { type: string }) => {
  const [files, setFiles] = useState<{
    documents: Models.Document[];
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const searchText = searchParams.get("query") || "";
  const sort = searchParams.get("sort") || "";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const types = getFileTypesParams(type);
      const result = await getFiles({ types, searchText, sort });
      setFiles(result);
      setLoading(false);
    };

    fetchData();
  }, [type, searchText, sort]);

  if (loading) return <FileListSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              {getTypeIcon(type)}
              <div>
                <h1 className="text-3xl font-bold  bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {getDisplayName(type)}
                </h1>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  {files && files.total > 0 ? (
                    <>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mr-2">
                        {files?.total}
                      </span>
                      {files?.total === 1 ? "file found" : "files found"}
                    </>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      No files found
                    </span>
                  )}
                </p>
              </div>
            </div>

            {files && files.total > 0 && (
              <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-blue-50/50 px-4 py-3 rounded-xl border border-gray-200/50 shadow-sm">
                <span className="text-sm font-medium text-gray-900 whitespace-nowrap flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Sort by:
                </span>
                <Sort />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Files Grid or Empty State */}
        {files && files.total > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files?.documents.map((file, index) => (
              <div
                key={file.$id}
                className="transform transition-all duration-300 hover:scale-105 hover:z-10"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <Card file={file} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-6xl text-gray-400">📂</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No files found
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {searchText
                  ? `No ${type || "files"} found matching "${searchText}"`
                  : `No ${type || "files"} have been uploaded yet`}
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-full text-sm text-blue-700">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                Try uploading some files or adjusting your search criteria
              </div>
            </div>
          </div>
        )}

        {files && files.total > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
              <span className="text-sm font-medium text-gray-600 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Showing all {files.total} {files.total === 1 ? "file" : "files"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientFilesPage;
