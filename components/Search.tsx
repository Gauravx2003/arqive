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
import { useDebounce } from "use-debounce";
import { cn } from "@/lib/utils";
import Portal from "./Portal";

const Search = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [results, setResults] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(searchQuery);
  const [debounceQuery] = useDebounce(query, 400);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const fetchFiles = async () => {
      if (debounceQuery.length === 0) {
        setResults([]);
        setOpen(false);
        setLoading(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }

      setLoading(true);
      try {
        const files = await getFiles({ types: [], searchText: debounceQuery });
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
  }, [debounceQuery]);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  const handleClick = (file: Models.Document) => {
    console.log("Enterd HandleClick: ", file);
    setOpen(false);
    setResults([]);
    setQuery("");

    console.log("Type is: ", file.type);
    console.log("Query is: ", encodeURIComponent(file.name));

    console.log(
      "Navigating to:",
      `/${
        file.type === "video" || file.type === "audio"
          ? "media"
          : file.type + (file.type === "others" ? "" : "s")
      }?query=${encodeURIComponent(file.name)}`
    );

    router.push(
      `/${
        file.type === "video" || file.type === "audio"
          ? "media"
          : file.type + (file.type === "others" ? "" : "s")
      }?query=${encodeURIComponent(file.name)}`
    );
  };

  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    router.push(path);
  };

  return (
    <>
      <div className="relative flex-1 max-w-2xl">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Image
              src="/assets/icons/search.svg"
              alt="Search"
              height={18}
              width={18}
              className="text-gray-400"
            />
          </div>

          <Input
            value={query}
            placeholder="Search files, documents, images..."
            className={cn(
              "pl-10 pr-10 h-11 bg-white border-gray-200 rounded-3xl",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200",
              "placeholder:text-gray-400 text-sm font-medium",
              open && results.length > 0 && "rounded-b-none border-b-0"
            )}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />

          {/* Clear Button */}
          {query && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
            >
              <Image
                src="/assets/icons/remove.svg"
                alt="Clear search"
                height={16}
                width={16}
                className="text-gray-400 hover:text-gray-600"
              />
            </button>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Backdrop for mobile */}
        {open && (
          <div
            className="fixed inset-0 z-[9998] lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </div>

      {/* Search Results Dropdown - Using Portal for proper z-index */}
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
            <div className="relative w-full h-full remove-scrolllbar">
              {/* Position the dropdown relative to the search input */}
              <div
                className="absolute pointer-events-auto"
                style={{
                  top: "80px", // Adjust based on your header height
                  left: "42%",
                  transform: "translateX(-50%)",
                  width: "100%",
                  maxWidth: "32rem", // max-w-2xl equivalent
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                }}
              >
                <div className="bg-white border border-gray-200 border-t-0 rounded-b-lg shadow-2xl max-h-80 overflow-y-auto">
                  {results.length > 0 ? (
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          {results.length}{" "}
                          {results.length === 1 ? "result" : "results"} found{" "}
                          <span className="mt-2 inline-flex px-1 py-0.5 text-xs font-normal normal-case  text-blue-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="lucide lucide-circle-alert h-4 w-4"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" x2="12" y1="8" y2="12"></line>
                              <line x1="12" x2="12.01" y1="16" y2="16"></line>
                            </svg>
                            <span className="ml-1">
                              Navigation to the files may not work for now, but
                              it will SOON!!
                            </span>
                          </span>
                        </p>
                      </div>

                      {results.map((file, index) => (
                        <div
                          key={file.$id}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-150",
                            "hover:bg-gray-50 hover:border-l-4 hover:border-blue-500",
                            index !== results.length - 1 &&
                              "border-b border-gray-50"
                          )}
                          onClick={() => {
                            console.log("File Clicked ", file);
                            handleClick(file);
                          }}
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <Thumbnail
                                type={file.type}
                                extension={file.extension}
                                url={file.url}
                                className="w-8 h-8 rounded-md"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {file.type} •{" "}
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            </div>
                          </div>

                          <div className="flex-shrink-0 text-right">
                            <FormattedDate
                              date={file.$createdAt}
                              className="text-xs text-gray-400"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <Image
                          src="/assets/icons/search.svg"
                          alt="No results"
                          height={20}
                          width={20}
                          className="opacity-40"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        No files found
                      </p>
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
