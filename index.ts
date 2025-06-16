"use server";

import { Client, Account, Databases, Avatars, Storage } from "node-appwrite";
import { appwriteConfig } from "./lib/appwrite/config";
import { cookies } from "next/headers";

export const CreateSessionClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

  const session = (await cookies()).get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session found. Please sign in.");
  }

  return {
    get account() {
      return new Account(client);
    },

    get database() {
      return new Databases(client);
    },
  };
};

export const CreateAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setKey(appwriteConfig.secret);

  return {
    get account() {
      return new Account(client);
    },

    get database() {
      return new Databases(client);
    },
    get avatar() {
      return new Avatars(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
};
