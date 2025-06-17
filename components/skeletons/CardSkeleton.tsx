import React from "react";

const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200/60 p-3 animate-pulse">
      {/* Header section */}
      <div className="flex justify-between items-start mb-4">
        {/* Thumbnail skeleton */}
        <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>

        {/* Actions and file size */}
        <div className="flex flex-col items-end space-y-3">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="w-16 h-6 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* File details section */}
      <div className="space-y-3">
        {/* File name */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Metadata section */}
        <div className="space-y-2">
          {/* Creation date */}
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Owner info */}
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSkeleton;
