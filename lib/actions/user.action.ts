"use server";

import { CreateAdminClient } from "@/index";
import { Client, Account, Databases } from "node-appwrite";
import { Query, ID } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import { Stringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getByEmail = async (email: string) => {
  const { database } = await CreateAdminClient();

  const result = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollection,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const handleError = async (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await CreateAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP.");
  }
};

export const CreateAccount = async ({
  email,
  fullname,
}: {
  email: string;
  fullname: string;
}) => {
  const existingUser = await getByEmail(email);

  const accountId = await sendEmailOTP({ email });
  if (!accountId) {
    throw new Error("Failed to send OTP");
  }

  if (!existingUser) {
    const { database } = await CreateAdminClient();

    await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollection,
      ID.unique(),
      {
        email,
        fullname,
        avatar:
          "https://imgs.search.brave.com/08vXeKVhSauIzbv7ImRsT_Xgs6tMBTXjNWUfOfOay1E/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9wcm9m/aWxlLXBsYWNlaG9s/ZGVyLWltYWdlLWdy/YXktc2lsaG91ZXR0/ZS1uby1waG90by1w/ZXJzb24tYXZhdGFy/LWRlZmF1bHQtcGlj/LXVzZWQtd2ViLWRl/c2lnbi0xMjczOTM0/ODMuanBn",
        accountId,
      }
    );
  }

  return Stringify({ accountId });
};

export const verifysecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await CreateAdminClient();
    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return Stringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify secret.");
  }
};

export const getCurrentUser = async () => {
  try {
    // 1. Get session token from cookie
    const cookieStore = await cookies();
    const sessionSecret = cookieStore.get("appwrite-session")?.value;

    if (!sessionSecret) {
      console.warn("No appwrite-session found in cookies.");
      return null;
    }

    // 2. Set up Appwrite client using the session token
    const client = new Client()
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId)
      .setSession(sessionSecret); // ✅ This makes the client behave like the logged-in user

    const account = new Account(client);
    const database = new Databases(client);

    const result = await account.get();

    const user = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollection,
      [Query.equal("accountId", result.$id)]
    );

    //console.log("📄 DB user result:", user);

    if (user.total <= 0) return null;

    return Stringify(user.documents[0]);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};

export const LogOut = async () => {
  try {
    // 1. Get session token from cookie
    const cookieStore = await cookies();
    const sessionSecret = cookieStore.get("appwrite-session")?.value;

    if (!sessionSecret) {
      console.warn("No appwrite-session found in cookies.");
      return null;
    }

    // 2. Set up Appwrite client using the session token
    const client = new Client()
      .setEndpoint(appwriteConfig.endpoint)
      .setProject(appwriteConfig.projectId)
      .setSession(sessionSecret); // ✅ This makes the client behave like the logged-in user

    const account = new Account(client);

    await account.deleteSession("current");
    cookieStore.delete("appwrite-session");

    console.log("✅ User logged out successfully");
    redirect("/sign-in");
  } catch (error) {
    console.error("❌ Error logging out user:", error);
    //redirect("/sign-in");
  }
};

export const SignIn = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getByEmail(email);
    if (!existingUser) {
      throw new Error("User not found. Please sign up first.");
    }

    const accountId = await sendEmailOTP({ email });
    if (!accountId) {
      throw new Error("Failed to send OTP");
    }

    return Stringify({ accountId });
  } catch (error) {
    handleError(error, "Failed to sign in user.");
  }
};
