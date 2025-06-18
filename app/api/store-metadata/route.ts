// /app/api/store-metadata/route.ts (App Router)
import { NextResponse } from "next/server";
import { CreateAdminClient } from "@/index";
import { ID } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { revalidatePath } from "next/cache";
import { getTotalSpaceUsed } from "@/lib/actions/files.action";
import { MAX_SIZE } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      size,
      extension,
      type,
      url,
      accountId,
      ownerId,
      bucketFileId,
      path,
    } = body;

    if (!name || !accountId || !ownerId || !bucketFileId || !size) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { database, storage } = await CreateAdminClient();

    // Check storage quota
    const totalSpace = await getTotalSpaceUsed();
    const totalUsedSpace = (
      Object.values(totalSpace) as { size: number }[]
    ).reduce((sum, category) => sum + category.size, 0);

    if (size + totalUsedSpace > MAX_SIZE) {
      // Optional: delete the uploaded file from Appwrite bucket
      await storage.deleteFile(appwriteConfig.bucketid, bucketFileId);

      return NextResponse.json(
        { error: "You don't have enough storage left." },
        { status: 403 }
      );
    }

    const fileDocument = {
      name,
      size,
      extension,
      type,
      url,
      accountId,
      owner: ownerId,
      bucketFileId,
      users: [],
    };

    const newDoc = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollection,
      ID.unique(),
      fileDocument
    );

    if (path) revalidatePath(path);

    return NextResponse.json(
      { message: "File metadata stored", document: newDoc },
      { status: 201 }
    );
  } catch (error) {
    console.error("[STORE_METADATA] Error:", error);
    return NextResponse.json(
      { error: "Failed to store file metadata" },
      { status: 500 }
    );
  }
}
