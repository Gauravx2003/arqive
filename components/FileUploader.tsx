// FileUploader.tsx - Updated to upload directly to Appwrite (browser-side)

"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getFileType, convertFileToUrl } from "@/lib/utils";
import Thumbnail from "@/components/Thumbnail";
import { usePathname } from "next/navigation";
import Portal from "./Portal";
import { Client, Storage, ID } from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

const appwriteClient = new Client()
  .setEndpoint(appwriteConfig.endpoint) // Replace with your endpoint
  .setProject(appwriteConfig.projectId); // Replace with your project ID

const storage = new Storage(appwriteClient);

const FileUploader = ({
  ownerId,
  accountId,
  className,
}: {
  ownerId: string;
  accountId: string;
  className?: string;
}) => {
  const [files, setFiles] = React.useState<File[]>([]);
  const path = usePathname();

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLButtonElement>,
    filename: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => filename !== file.name));
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > 50 * 1024 * 1024) {
          toast.error("File exceeds 50MB limit.");
          setFiles((prev) => prev.filter((f) => f.name !== file.name));
          return;
        }

        try {
          const appwriteFile = await storage.createFile(
            appwriteConfig.bucketid, // Replace with your bucket ID
            ID.unique(),
            file // Use File directly
          );

          // Send metadata to server
          const metaRes = await fetch("/api/store-metadata", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: appwriteFile.name,
              size: appwriteFile.sizeOriginal,
              extension: file.name.split(".").pop(),
              type: getFileType(file.name).type,
              url: `${appwriteConfig.endpoint}/storage/buckets/${appwriteFile.bucketId}/files/${appwriteFile.$id}/view?project=${appwriteConfig.projectId}`,
              accountId,
              ownerId,
              bucketFileId: appwriteFile.$id,
              path,
            }),
          });

          const metaData = await metaRes.json();

          if (!metaRes.ok) {
            await storage.deleteFile(appwriteConfig.bucketid, appwriteFile.$id); // cleanup again if needed
            toast.error(
              metaData.error || "Upload rejected. Storage quota exceeded."
            );
          } else {
            toast.success(`${file.name} uploaded successfully!`);
            setFiles((prev) => prev.filter((f) => f.name !== file.name));
          }
        } catch (error: unknown) {
          console.error("Upload failed:", error);
          toast.error(
            "Upload failed. Try a smaller file or check your connection."
          );
          setFiles((prev) => prev.filter((f) => f.name !== file.name));
        }
      });

      await Promise.all(uploadPromises);
    },
    [ownerId, accountId, path]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "video/*": [],
      "audio/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
      "text/*": [],
    },
  });

  return (
    <>
      {/* Upload Button */}
      <div className={className}>
        <div
          {...getRootProps()}
          className={`cursor-pointer transition-all duration-200 rounded-lg ${
            isDragActive ? "scale-105" : ""
          }`}
        >
          <input {...getInputProps()} />
          <Button
            type="button"
            variant="outline"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 hover:shadow-lg"
          >
            <Image
              src="/assets/icons/upload.svg"
              alt="Upload"
              width={18}
              height={18}
              className="brightness-0 invert"
            />
            <span className="ml-2">
              {isDragActive ? "Drop files here" : "Upload"}
            </span>
          </Button>
        </div>
      </div>

      {/* Upload Preview */}
      {files.length > 0 && (
        <Portal>
          <div className="fixed inset-0 z-[9999] pointer-events-none">
            <div className="absolute top-20 right-4 pointer-events-auto">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-3 max-h-80 min-w-80 overflow-y-auto">
                <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Uploading {files.length}{" "}
                    {files.length === 1 ? "file" : "files"}
                  </h4>
                </div>

                <div className="space-y-3">
                  {files.map((file, index) => {
                    const { type, extension } = getFileType(file.name);
                    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

                    return (
                      <div
                        key={`${file.name}+${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Thumbnail
                            type={type}
                            extension={extension}
                            url={convertFileToUrl(file)}
                            className="w-10 h-10"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {fileSizeMB} MB • {type}
                            </p>
                          </div>
                          <Image
                            src="/assets/icons/file-loader.gif"
                            width={24}
                            height={24}
                            alt="Uploading"
                            className="opacity-70"
                          />
                        </div>
                        <button
                          onClick={(e) => handleRemoveFile(e, file.name)}
                          className="ml-3 p-1 rounded-full hover:bg-red-100"
                        >
                          <Image
                            src="/assets/icons/remove.svg"
                            alt="Remove file"
                            width={16}
                            height={16}
                            className="opacity-60 hover:opacity-100"
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default FileUploader;
