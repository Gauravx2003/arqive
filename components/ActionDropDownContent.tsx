import React from "react";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormattedDate from "./FormattedDate";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import Image from "next/image";
import { Button } from "./ui/button";

const ImageThumbnail = ({ file }: { file: Models.Document }) => (
  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-200/50">
    {/* Enhanced thumbnail with glow effect */}
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl blur-md opacity-60" />
      <div className="relative">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="drop-shadow-lg"
        />
      </div>
    </div>

    {/* File info with better typography */}
    <div className="flex flex-col flex-1 min-w-0">
      <h3 className="font-semibold text-gray-900 text-base truncate mb-1 leading-tight">
        {file.name}
      </h3>
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <FormattedDate
          date={file.$createdAt}
          className="text-sm text-gray-600 font-medium"
        />
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-white border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200">
    <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
      {label}
    </span>
    <span className="text-sm font-semibold text-gray-900 max-w-[60%] truncate">
      {value}
    </span>
  </div>
);

export const FileDetails = ({ file }: { file: Models.Document }) => {
  return (
    <div className="space-y-6">
      {/* Enhanced thumbnail section */}
      <ImageThumbnail file={file} />

      {/* Details section with cards */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
            File Details
          </h4>
        </div>

        <div className="grid gap-3">
          <DetailRow label="Format" value={file.extension.toUpperCase()} />
          <DetailRow label="File Size" value={convertFileSize(file.size)} />
          <DetailRow label="Owner" value={file.owner.fullname} />
          <DetailRow
            label="Last Modified"
            value={formatDateTime(file.$updatedAt)}
          />
        </div>
      </div>
    </div>
  );
};

export const ShareModal = ({
  file,
  onInputChange,
  onRemove,
}: {
  file: Models.Document;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Enhanced thumbnail section */}
      <ImageThumbnail file={file} />

      {/* Share section */}
      <div className="space-y-4">
        {/* Section header */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <h4 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
            Share File
          </h4>
        </div>

        {/* Input section with better styling */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Add people to share this file with
          </p>
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter email addresses (comma separated)"
              onChange={(e) =>
                onInputChange(e.target.value.trimEnd().split(","))
              }
              className="pr-10 py-3 border-gray-300 focus:border-blue-400 focus:ring-blue-400/20 rounded-lg text-sm placeholder:text-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M20 4L3 11l6.5 2.5L12 20l8-16z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Shared users section */}
        <div className="space-y-4">
          {/* Stats header */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg border border-gray-200/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-semibold text-gray-700">
                Currently Shared With
              </span>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {file.users.length} {file.users.length === 1 ? "user" : "users"}
            </span>
          </div>

          {/* Users list */}
          {file.users.length > 0 ? (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {file.users.map((email: string) => (
                <div
                  key={email}
                  className="flex items-center justify-between gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-200 group"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm font-semibold">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {email}
                    </span>
                  </div>

                  {/* Remove button */}
                  <Button
                    onClick={() => onRemove(email)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Image
                      src="/assets/icons/remove.svg"
                      alt="Remove user"
                      width={16}
                      height={16}
                      className="transition-transform duration-200 hover:scale-110"
                    />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400"
                >
                  <path
                    d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="9"
                    cy="7"
                    r="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M22 21v-2a4 4 0 0 0-3-3.87"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3.13a4 4 0 0 1 0 7.75"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-500 font-medium">
                No users added yet
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Add email addresses above to share this file
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
