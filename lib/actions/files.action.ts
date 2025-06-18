"use server";

import { CreateAdminClient } from "@/index";
import { getCurrentUser, handleError } from "./user.action";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models } from "node-appwrite";
import { constructFileUrl, getFileType, Stringify } from "../utils";
import { revalidatePath } from "next/cache";
import { Query } from "node-appwrite";
import { MAX_SIZE } from "../utils";
import { Client, Storage } from "appwrite";

// 🔵 TYPES
type SpaceCategory = { size: number; latestDate: string };
type TotalSpaceUsed = {
  document: SpaceCategory;
  image: SpaceCategory;
  video: SpaceCategory;
  audio: SpaceCategory;
  others: SpaceCategory;
};

export const uploadFiles = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, database } = await CreateAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.bucketid,
      ID.unique(),
      inputFile
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    const totalSpace = await getTotalSpaceUsed();
    const totalUsedSpace = (
      Object.values(totalSpace) as SpaceCategory[]
    ).reduce((sum, category) => sum + category.size, 0);

    if (fileDocument.size + totalUsedSpace > MAX_SIZE)
      throw new Error("You Don't Have Enough Storage");

    const newFile = await database
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollection,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketid, bucketFile.$id);
        handleError(error, "Failed to Create Document");
        throw error;
      });

    revalidatePath(path);
    return Stringify(newFile);
  } catch (error) {
    console.error("❌ Upload Error Raw:", error);
    console.error(
      "❌ Upload Error Type:",
      Object.prototype.toString.call(error)
    );
    console.error("❌ Upload Error JSON:", JSON.stringify(error, null, 2));
    handleError(error, "Upload failed.");
    throw error;
  }
};

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string,
  limit?: number
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));
  if (limit) queries.push(Query.limit(limit));

  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    console.log("SORT IS: ", sortBy);

    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }

  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "",
  limit,
}: GetFilesProps) => {
  const { database } = await CreateAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User Not Found");

    // console.log("Current User: ", currentUser);

    const queries = createQueries(currentUser, types, searchText, sort, limit);

    const files = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      queries
    );

    return Stringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};

export const getTotalSpaceUsed = async () => {
  try {
    const { database } = await CreateAdminClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User Not Found");

    const queries = [
      Query.or([
        Query.equal("owner", [currentUser.$id]),
        Query.contains("users", [currentUser.email]),
      ]),
      Query.select(["type", "size", "$updatedAt"]),
    ];

    const files = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      queries
    );

    const totalSpace: TotalSpaceUsed = {
      document: { size: 0, latestDate: "" },
      image: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      others: { size: 0, latestDate: "" },
    };

    files.documents.forEach((file: Models.Document) => {
      const fileType = file.type as keyof typeof totalSpace;
      if (totalSpace[fileType]) {
        totalSpace[fileType].size += file.size;

        // Update latest date if this file is more recent
        if (
          !totalSpace[fileType].latestDate ||
          new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
        ) {
          totalSpace[fileType].latestDate = file.$updatedAt;
        }
      }
    });

    return Stringify(totalSpace);
  } catch (error) {
    handleError(error, "Failed to get total space used");
  }
};

export const renameFile = async ({
  fileId,
  name,
  extension,
  path,
}: RenameFileProps) => {
  const { database } = await CreateAdminClient();

  try {
    const newName = `${name}.${extension}`;

    const updatedFile = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      fileId,
      {
        name: newName,
      }
    );

    revalidatePath(path);

    return Stringify(updatedFile);
  } catch (error) {
    handleError(error, "Cant Rename");
  }
};

export const deleteFile = async ({
  fileId,
  path,
  bucketFileId,
  owner,
}: {
  fileId: string;
  path: string;
  bucketFileId: string;
  owner: string;
}) => {
  try {
    const { storage, database } = await CreateAdminClient();

    const currentUser = await getCurrentUser();

    if (currentUser.email != owner) {
      // Fetch the file document to get the current users array
      const fileDoc = await database.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollection,
        fileId
      );

      // Remove currentUser.email from users array
      const updatedUsers = (fileDoc.users || []).filter(
        (email: string) => email !== currentUser.email
      );

      // Update the file document with the new users array
      await database.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollection,
        fileId,
        { users: updatedUsers }
      );

      revalidatePath(path);

      return Stringify({ status: "success" });
    }

    const deletedFile = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      fileId
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.bucketid, bucketFileId);
    }

    revalidatePath(path);

    return Stringify({ status: "success" });
  } catch (error) {
    handleError(error, "Cant delete");
  }
};

export const updateFileUsers = async ({
  fileId,
  emails,
  path,
}: {
  fileId: string;
  emails: string[];
  path: string;
}) => {
  const { database } = await CreateAdminClient();

  try {
    // Step 1: Fetch the existing users array from the document
    const existingDoc = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      fileId
    );

    const existingUsers: string[] = existingDoc.users || [];

    // Step 2: Append new emails and remove duplicates
    const updatedUsers = Array.from(new Set([...existingUsers, ...emails]));

    // Step 3: Update the document with the new array
    const updatedFile = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      fileId,
      { users: updatedUsers }
    );

    // Step 4: Revalidate path
    revalidatePath(path);

    return Stringify(updatedFile);
  } catch (error) {
    handleError(error, "Can't Share");
  }
};
