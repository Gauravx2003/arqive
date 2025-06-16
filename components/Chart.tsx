"use client";

import React from "react";
import { convertFileSize } from "@/lib/utils";

interface ChartProps {
  used: number;
  total: number;
}

const Chart = ({ used, total }: ChartProps) => {
  const percentage = Math.round((used / total) * 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on usage percentage
  const getColor = (percent: number) => {
    if (percent < 70) return "#10B981"; // Green
    if (percent < 90) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  const color = getColor(percentage);

  return (
    <div className="relative w-48 h-48 mx-auto">
      {/* Background Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#E5E7EB"
          strokeWidth="8"
          fill="none"
          className="opacity-20"
        />

        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out drop-shadow-sm"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {percentage}%
          </div>
          <div className="text-sm text-gray-600 font-medium">Used</div>
          <div className="text-xs text-gray-500 mt-1">
            {convertFileSize(used)}
          </div>
        </div>
      </div>

      {/* Animated pulse effect */}
      <div
        className="absolute inset-0 rounded-full opacity-20 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        }}
      />
    </div>
  );
};

export default Chart;
