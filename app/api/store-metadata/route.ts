// /app/api/store-metadata/route.ts (App Router)
import { NextResponse } from "next/server";
import { CreateAdminClient } from "@/index";
import { ID } from "node-appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { revalidatePath } from "next/cache";

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

    if (!name || !accountId || !ownerId || !bucketFileId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { database } = await CreateAdminClient();

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
