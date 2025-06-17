import React from "react";
import Image from "next/image";
import { getFileIcon } from "@/lib/utils";
import { cn } from "@/lib/utils";

const Thumbnail = ({
  type,
  extension,
  imageClassName,
  className,
  url = "",
}: {
  type: string;
  url?: string;
  imageClassName?: string;
  className: string;
  extension: string;
}) => {
  const isImage = type === "image" && extension !== "svg";

  return (
    <figure className={cn("thumbnail", className)}>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt="thumbnail"
        width={120}
        height={120}
        className={cn(
          "size-8 object-contain",
          imageClassName,
          isImage && "thumbnail-image rounded-2xl"
        )}
      />
    </figure>
  );
};

export default Thumbnail;
