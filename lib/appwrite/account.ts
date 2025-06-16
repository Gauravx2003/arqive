import { Client, Account, Databases } from "node-appwrite";
import { appwriteConfig } from "./config";

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const database = new Databases(client);
