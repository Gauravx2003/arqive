"use server";

import { CreateAdminClient } from "@/index";
import { Client, Account, Databases } from "node-appwrite";
import { Query, ID } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import { Stringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getByEmail = async (email: string) => {
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
  avatar,
  password,
}: {
  email: string;
  fullname: string;
  avatar: string;
  password: string;
}) => {
  const existingUser = await getByEmail(email);

  if (existingUser) {
    throw new Error("User already exists.");
  }

  try {
    const { account, database } = await CreateAdminClient();

    // Create Appwrite account with password
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      fullname
    );

    // Create user document in database
    await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollection,
      ID.unique(),
      {
        email,
        fullname,
        avatar,
        accountId: newAccount.$id,
      }
    );

    // Send OTP for email verification
    const accountId = await sendEmailOTP({ email });
    
    return Stringify({ accountId: accountId || newAccount.$id });
  } catch (error) {
    handleError(error, "Failed to create account.");
    throw error;
  }
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

export const signInWithPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const existingUser = await getByEmail(email);
    if (!existingUser) {
      throw new Error("User not found. Please sign up first.");
    }

    const { account } = await CreateAdminClient();
    
    // Create session with email and password
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return Stringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to sign in with password.");
    throw error;
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
  } catch (error) {
    console.error("❌ Error logging out user:", error);
    //redirect("/sign-in");
  }

  redirect("/sign-in");
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
    throw error;
  }
};