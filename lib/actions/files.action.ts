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
    const totalUsedSpace = Object.values(totalSpace).reduce(
      (sum: number, category: any) => sum + category.size,
      0
    );

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
    handleError(error, "Something went Wrong");
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

<<<<<<< HEAD
    // console.log("Current User: ", currentUser);

=======
>>>>>>> a9a62f7a4a0d4ea6682183c8160c56580cf535d3
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

    const totalSpace = {
      document: { size: 0, latestDate: "" },
      image: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
<<<<<<< HEAD
      others: { size: 0, latestDate: "" },
=======
      other: { size: 0, latestDate: "" },
>>>>>>> a9a62f7a4a0d4ea6682183c8160c56580cf535d3
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

<<<<<<< HEAD
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

=======
>>>>>>> a9a62f7a4a0d4ea6682183c8160c56580cf535d3
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
    const updatedFile = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      fileId,
      { users: emails }
    );

    revalidatePath(path);

    return Stringify(updatedFile);
  } catch (error) {
    handleError(error, "Cant Share");
  }
};