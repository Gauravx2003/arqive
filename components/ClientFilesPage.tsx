"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/files.action";
import { getFileTypesParams } from "@/lib/utils";
import Sort from "@/components/Sort";
import Card from "@/components/Card";
import Image from "next/image";

const getDisplayName = (type: string) => {
  if (!type) return "All Files";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    documents:
      "https://www.clipartmax.com/png/full/218-2181614_file-cabinet-icon-mac-document-management-logo-png.png",
    images:
      "https://png.pngtree.com/png-vector/20191204/ourmid/pngtree-mountains-illustration-vector-on-white-background-png-image_2072312.jpg",
    media:
      "https://www.clipartmax.com/png/full/430-4305244_see-also-related-to-unique-red-start-button-button-transparent-video-player.png",
    audios:
      "https://www.clipartmax.com/png/full/430-4305244_see-also-related-to-unique-red-start-button-button-transparent-video-player.png",
    others:
      "https://www.freeiconspng.com/uploads/black-question-mark-icon-clip-art-10.png",
  };

  return (
    <Image
      src={icons[type] || icons["others"]}
      alt={type}
      height={50}
      width={50}
    />
  );
};

const ClientFilesPage = ({ type }: { type: string }) => {
  const [files, setFiles] = useState<any>(null);
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

  if (loading)
    return (
      <div className="p-4 text-center text-gray-600">Loading files...</div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              {getTypeIcon(type)}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getDisplayName(type)}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {files?.total > 0 ? (
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

            {files?.total > 0 && (
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Sort by:
                </span>
                <Sort />
              </div>
            )}
          </div>
        </div>

        {/* Files Grid or Empty State */}
        {files?.total > 0 ? (
          <div className="grid grid-cols-1sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.documents.map((file: any) => (
              <div
                key={file.$id}
                className="transform transition-all z-0 duration-200 hover:scale-105"
              >
                <Card file={file} />
              </div>
            ))}
          </div>
        ) : (
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
                Try uploading some files or adjusting your search criteria.
              </div>
            </div>
          </div>
        )}

        {files?.total > 0 && (
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

export default ClientFilesPage;
