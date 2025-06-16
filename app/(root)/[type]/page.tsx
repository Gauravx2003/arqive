import React from "react";
import Sort from "@/components/Sort";
import { getFiles } from "@/lib/actions/files.action";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
import { getFileTypesParams } from "@/lib/utils";

const page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || "";
  const searchText = ((await searchParams)?.query as string) || "";
  const sort = ((await searchParams)?.sort as string) || "";

  const types = getFileTypesParams(type) as FileType[];
  const files = await getFiles({ types, searchText, sort });

  // Get file type display name
  const getDisplayName = (type: string) => {
    if (!type) return "All Files";
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Get file type icon
  const getTypeIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      documents: "📄",
      images: "🖼️",
      videos: "🎥",
      audios: "🎵",
      others: "📁",
    };
    return iconMap[type] || "📁";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title and Stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{getTypeIcon(type)}</span>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {getDisplayName(type)}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    {files.total > 0 ? (
                      <>
                        <span className="font-semibold text-blue-600">
                          {files.total}
                        </span>
                        {files.total === 1 ? " file" : " files"} found
                      </>
                    ) : (
                      "No files found"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Sort Controls */}
            {files.total > 0 && (
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </span>
                <Sort />
              </div>
            )}
          </div>
        </div>

        {/* Files Grid */}
        {files.total > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.documents.map((file: Models.Document) => (
              <div
                key={file.$id}
                className="transform transition-all duration-200 hover:scale-105"
              >
                <Card file={file} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl text-gray-400">📂</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No files found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchText
                  ? `No ${type || "files"} found matching "${searchText}"`
                  : `No ${type || "files"} have been uploaded yet`}
              </p>
              <div className="text-sm text-gray-500">
                <p>
                  Try uploading some files or adjusting your search criteria.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pagination placeholder - if needed */}
        {files.total > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
              Showing all {files.total} {files.total === 1 ? "file" : "files"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
