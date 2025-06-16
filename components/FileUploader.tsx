"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFileType, convertFileToUrl } from "@/lib/utils";
import Thumbnail from "@/components/Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { toast } from "sonner";
import { uploadFiles } from "@/lib/actions/files.action";
import { usePathname } from "next/navigation";

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
    e: React.MouseEvent<HTMLImageElement>,
    filename: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => filename != file.name));
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prevFiles) => prevFiles.filter((f) => f.name != file.name));
          return toast.error("File must be up to 50MB");
        }

        return uploadFiles({ file, ownerId, accountId, path }).then(
          (uploadFiles) => {
            if (uploadFiles) {
              setFiles((prevFiles) =>
                prevFiles.filter((f) => f.name != file.name)
              );
              toast.success(`${file.name} uploaded successfully!`);
            }
          }
        );
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
    <div className={cn("relative", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer transition-all duration-200 rounded-lg",
          isDragActive && "scale-105"
        )}
      >
        <input {...getInputProps()} />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center space-x-2 px-4 py-2 h-10 font-medium transition-all duration-200",
            "bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0",
            "hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:scale-105",
            "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            isDragActive && "from-green-500 to-emerald-600 shadow-lg scale-105"
          )}
        >
          <Image
            src="/assets/icons/upload.svg"
            alt="Upload"
            width={18}
            height={18}
            className="brightness-0 invert"
          />
          <span className="hidden sm:inline">
            {isDragActive ? "Drop files here" : "Upload"}
          </span>
        </Button>
      </div>

      {/* Upload Preview */}
      {files.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-h-80 overflow-y-auto">
            <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <h4 className="text-sm font-semibold text-gray-900">
                Uploading {files.length} {files.length === 1 ? "file" : "files"}
              </h4>
            </div>

            <div className="space-y-3">
              {files.map((file, index) => {
                const { type, extension } = getFileType(file.name);
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

                return (
                  <div
                    key={`${file.name}+${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        <Thumbnail
                          type={type}
                          extension={extension}
                          url={convertFileToUrl(file)}
                          className="w-10 h-10"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {fileSizeMB} MB • {type}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <Image
                          src="/assets/icons/file-loader.gif"
                          width={24}
                          height={24}
                          alt="Uploading"
                          className="opacity-70"
                        />
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleRemoveFile(e, file.name)}
                      className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-red-100 transition-colors group"
                    >
                      <Image
                        src="/assets/icons/remove.svg"
                        alt="Remove file"
                        width={16}
                        height={16}
                        className="opacity-60 group-hover:opacity-100"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
