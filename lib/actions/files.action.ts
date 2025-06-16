"use server";

import { CreateAdminClient } from "@/index";
import { getCurrentUser, handleError } from "./user.action";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models } from "node-appwrite";
import { constructFileUrl, getFileType, Stringify } from "../utils";
import { revalidatePath } from "next/cache";
import { Query } from "node-appwrite";

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
      });

    revalidatePath(path);
    return Stringify(newFile);
  } catch (error) {
    handleError(error, "Something went Wrong");
  }
};

const createQueries = (
  currentUser: Models.Document,
  types: string[],
  searchText: string,
  sort: string
) => {
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  if (types.length > 0) queries.push(Query.equal("type", types));
  if (searchText) queries.push(Query.contains("name", searchText));

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
}: GetFilesProps) => {
  const { database } = await CreateAdminClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User Not Found");

    const queries = createQueries(currentUser, types, searchText, sort);

    const files = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      //   appwriteConfig.projectId,
      queries
    );

    //console.log("From Queries we got: ", files);

    return Stringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
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
}: {
  fileId: string;
  path: string;
  bucketFileId: string;
}) => {
  try {
    const { storage, database } = await CreateAdminClient();

    // await storage.deleteFile(
    //   appwriteConfig.bucketid
    // )

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
