"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/files.action";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormattedDate from "./FormattedDate";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Portal from "./Portal";

const Search = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchQuery);
  const [inputValue, setInputValue] = useState(searchQuery);
  const router = useRouter();
  const path = usePathname();

  // Only fetch when query changes (from URL or manual search)
  useEffect(() => {
    const fetchFiles = async () => {
      if (query.length === 0) {
        setResults([]);
        setOpen(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const files = await getFiles({ types: [], searchText: query });
        setResults(files.documents);
        setOpen(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [query]);

  // Update input value when URL search query changes
  useEffect(() => {
    setInputValue(searchQuery);
    setQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    if (inputValue.trim() === "") {
      handleClearSearch();
      return;
    }

    // Update URL with search query
    const params = new URLSearchParams(searchParams.toString());
    params.set("query", inputValue.trim());
    router.push(`${path}?${params.toString()}`);
    setQuery(inputValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleClick = (file: Models.Document) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${
        file.type === "video" || file.type === "audio"
          ? "media"
          : file.type + (file.type === "others" ? "" : "s")
      }?query=${encodeURIComponent(file.name)}`
    );
  };

  const handleClearSearch = () => {
    setInputValue("");
    setQuery("");
    setResults([]);
    setOpen(false);
    
    // Remove query from URL but preserve other params
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    const newUrl = params.toString() ? `${path}?${params.toString()}` : path;
    router.push(newUrl);
  };

  return (
    <>
      <div className="relative flex-1 max-w-2xl">
        {/* Enhanced Search Input */}
        <div className="relative group">
          {/* Animated border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

          <div className="relative flex">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <div className="relative">
                <Image
                  src="/assets/icons/search.svg"
                  alt="Search"
                  height={20}
                  width={20}
                  className="text-gray-400 transition-all duration-200 group-hover:scale-110"
                />
                {loading && (
                  <div className="absolute inset-0 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>

            <Input
              value={inputValue}
              placeholder="🔍 Search files, documents, images..."
              className={cn(
                "pl-12 pr-24 h-12 bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-l-3xl rounded-r-none shadow-sm",
                "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:bg-white transition-all duration-300",
                "placeholder:text-gray-500 text-sm font-medium",
                "hover:shadow-md hover:border-gray-300/70",
                open &&
                  results.length > 0 &&
                  "border-b-0 shadow-lg"
              )}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-r-3xl transition-all duration-200 hover:shadow-lg flex items-center justify-center min-w-[60px] border border-l-0 border-blue-500"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </button>

            {/* Enhanced Clear Button */}
            {(inputValue || query) && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-16 pr-2 flex items-center transition-all duration-200 hover:bg-gray-50/50 group/clear"
              >
                <div className="p-1 rounded-full hover:bg-red-100 transition-colors duration-200">
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="Clear search"
                    height={16}
                    width={16}
                    className="text-gray-400 transition-all duration-200 group-hover/clear:text-red-500 group-hover/clear:scale-110"
                  />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Backdrop for mobile */}
        {open && (
          <div
            className="fixed inset-0 z-[9998] lg:hidden bg-black/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </div>

      {/* Enhanced Search Results Dropdown */}
      {open && (
        <Portal>
          <div
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <div className="relative w-full h-full">
              <div
                className="absolute pointer-events-auto"
                style={{
                  top: "95px",
                  left: "42%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  maxWidth: "32rem",
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                }}
              >
                <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 border-t-0 rounded-b-2xl shadow-2xl max-h-80 overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-3 border-b border-gray-100/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                          {results.length}{" "}
                          {results.length === 1 ? "result" : "results"} found
                        </p>
                        <div className="mt-2 inline-flex items-center px-2 py-1 text-xs font-normal text-green-700 bg-green-50/50 rounded-full border border-green-200/50">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <path d="m9 12 2 2 4-4"></path>
                            <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"></path>
                          </svg>
                          Search optimized for better navigation!
                        </div>
                      </div>

                      {results.map((file, index) => (
                        <div
                          key={file.$id}
                          className={cn(
                            "group flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200",
                            "hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 hover:border-l-4 hover:border-blue-500",
                            index !== results.length - 1 &&
                              "border-b border-gray-50"
                          )}
                          onClick={() => {
                            handleClick(file);
                          }}
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 transform transition-transform duration-200 group-hover:scale-110">
                              <Thumbnail
                                type={file.type}
                                extension={file.extension}
                                url={file.url}
                                className="w-10 h-10 rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
                                {file.name}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors duration-200">
                                  {file.type}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <FormattedDate
                              date={file.$createdAt}
                              className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors duration-200"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <Image
                          src="/assets/icons/search.svg"
                          alt="No results"
                          height={24}
                          width={24}
                          className="opacity-40"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">
                        No files found
                      </h3>
                      <p className="text-xs text-gray-400">
                        Try adjusting your search terms
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Search;