"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ShareModal } from "./ActionDropDownContent";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import { constructDownloadUrl } from "@/lib/utils";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/files.action";
import { usePathname } from "next/navigation";
import { FileDetails } from "./ActionDropDownContent";

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [renameError, setRenameError] = useState("");
  const path = usePathname();

  console.log("File: ", file);

  const closeAllModals = () => {
    setIsDropDownOpen(false);
    setIsModalOpen(false);
    setAction(null);
    setName(file.name);
    setRenameError("");
  };

  const validateFileName = (fileName: string) => {
    if (!fileName.trim()) {
      return "File name cannot be empty";
    }
    if (fileName.length > 255) {
      return "File name is too long";
    }
    if (/[<>:"/\\|?*]/.test(fileName)) {
      return "File name contains invalid characters";
    }
    return "";
  };

  const handleRemoveUsers = async (email: string) => {
    const updatedEmails = emails.filter((e) => e != email);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: emails,
      path,
    });

    if (success) setEmails(updatedEmails);
    closeAllModals();
  };

  const handleAction = async () => {
    if (!action) return;

    // Validate rename input
    if (action.value === "rename") {
      const error = validateFileName(name);
      if (error) {
        setRenameError(error);
        return;
      }
    }

    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({ fileId: file.$id, extension: file.extension, path, name }),
      share: () => updateFileUsers({ fileId: file.$id, path, emails: emails }),
      delete: () =>
        deleteFile({
          fileId: file.$id,
          path,
          bucketFileId: file.bucketFileId,
          owner: file.owner.email,
        }),
    };

    success = await actions[action.value as keyof typeof actions]();

    if (success) closeAllModals();

    setIsLoading(false);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📋";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      case "mp4":
      case "avi":
      case "mov":
        return "🎥";
      case "mp3":
      case "wav":
        return "🎵";
      case "zip":
      case "rar":
        return "🗜️";
      default:
        return "📁";
    }
  };

  const renderDialog = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button max-w-md">
        <DialogHeader className="flex flex-col gap-4">
          <DialogTitle className="text-center text-xl font-semibold">
            {label}
          </DialogTitle>

          {value === "rename" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <span className="text-2xl">{getFileIcon(file.name)}</span>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">Current name:</p>
                  <p className="font-medium truncate">{file.name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  New name:
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setRenameError("");
                  }}
                  placeholder="Enter new file name"
                  className={`${
                    renameError ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {renameError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <span>⚠️</span>
                    {renameError}
                  </p>
                )}
              </div>
            </div>
          )}

          {value === "details" && <FileDetails file={file} />}

          {value === "share" && (
            <ShareModal
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUsers}
            />
          )}

          {value === "delete" && (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🗑️</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-gray-700">
                  Are you sure you want to delete this file?
                </p>
                <div className="flex items-center gap-2 justify-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-lg">{getFileIcon(file.name)}</span>
                  <span className="font-medium text-gray-900">{file.name}</span>
                </div>
                <p className="text-sm text-red-600 font-medium">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          )}
        </DialogHeader>

        {["rename", "share", "delete"].includes(value) && (
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={closeAllModals}
              className="flex-1 sm:flex-none"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={isLoading || (value === "rename" && !name.trim())}
              className={`flex-1 sm:flex-none relative ${
                value === "delete"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : value === "rename"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={16}
                    height={16}
                    className="animate-spin"
                  />
                  <span>
                    {value === "delete"
                      ? "Deleting..."
                      : value === "rename"
                      ? "Renaming..."
                      : "Processing..."}
                  </span>
                </div>
              ) : (
                <span className="capitalize font-medium">
                  {value === "delete"
                    ? "Delete File"
                    : value === "rename"
                    ? "Rename File"
                    : value}
                </span>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="option"
            width={25}
            height={25}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((item) => (
            <DropdownMenuItem
              key={item.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(item);

                if (
                  ["rename", "share", "delete", "details"].includes(item.value)
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {item.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    height={30}
                    width={30}
                  />
                  {item.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    height={30}
                    width={30}
                  />
                  {item.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialog()}
    </Dialog>
  );
};

export default ActionDropdown;
