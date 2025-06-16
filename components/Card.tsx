import React from "react";
import { Models } from "node-appwrite";
import Link from "next/link";
import Thumbnail from "./Thumbnail";
import { convertFileSize } from "@/lib/utils";
import FormattedDate from "./FormattedDate";
import ActionDropdown from "./ActionDropdown";

const Card = ({ file }: { file: Models.Document }) => {
  return (
    <Link
      href={file.url}
      target="_blank"
      className="file-card group z-0 relative overflow-hidden"
    >
      {/* Clean white background */}
      <div className="absolute inset-0  bg-white rounded-xl border border-gray-200/60 transition-all duration-300 group-hover:border-blue-300/40 group-hover:shadow-xl group-hover:shadow-blue-500/10" />

      {/* Subtle hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-cyan-50/0 rounded-xl opacity-0 group-hover:opacity-100 group-hover:from-blue-50/30 group-hover:via-purple-50/20 group-hover:to-cyan-50/30 transition-all duration-500" />

      {/* Main content wrapper */}
      <div className="relative p-3 h-full transform transition-all duration-300 group-hover:scale-[1.02] group-hover:-translate-y-1">
        {/* Header section */}
        <div className="flex justify-between items-start mb-4">
          {/* Thumbnail with subtle hover effect */}
          <div className="transform transition-all duration-300 group-hover:scale-110">
            <Thumbnail
              type={file.type}
              extension={file.extension}
              url={file.url}
              className="!size-16 drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
              imageClassName="!size-10"
            />
          </div>

          {/* Actions and file size - fixed layout */}
          <div className="flex flex-col items-end space-y-3">
            <div className="transform transition-all duration-200 group-hover:scale-105">
              <ActionDropdown file={file} />
            </div>

            {/* Fixed file size badge */}
            <div className="min-w-[70px]">
              <div className="px-1 py-0.5 bg-gray-100 rounded-lg border border-gray-200/50 transition-all duration-300 group-hover:bg-blue-50 group-hover:border-blue-200/60 text-center">
                <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700 transition-colors duration-300 whitespace-nowrap">
                  {convertFileSize(file.size)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* File details section */}
        <div className="space-y-3">
          {/* File name with clean styling */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 transition-colors duration-300 group-hover:text-blue-700 leading-tight">
              {file.name}
            </h3>
          </div>

          {/* Metadata section */}
          <div className="space-y-2">
            {/* Creation date */}
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 transition-all duration-300 group-hover:bg-blue-500 group-hover:scale-125" />
              <FormattedDate
                date={file.$createdAt}
                className="text-sm font-medium text-gray-600 transition-colors duration-300 group-hover:text-gray-800"
              />
            </div>

            {/* Owner info */}
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 transition-all duration-300 group-hover:bg-emerald-500 group-hover:scale-125" />
              <p className="text-sm text-gray-600 line-clamp-1 transition-colors duration-300 group-hover:text-gray-800">
                <span className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                  By{" "}
                </span>
                <span className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  {file.owner.fullname}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Subtle shimmer effect on hover */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-xl pointer-events-none">
          <div className="absolute top-0 -left-full w-1/3 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-full" />
        </div>
      </div>

      {/* Clean bottom accent line */}
      {/* <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500 group-hover:w-2/3 rounded-full" /> */}
    </Link>
  );
};

export default Card;
