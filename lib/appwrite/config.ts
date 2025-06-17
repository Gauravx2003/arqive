export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE!,
  userCollection: process.env.NEXT_PUBLIC_APPWRITE_USERS!,
  filesCollection: process.env.NEXT_PUBLIC_APPWRITE_FILES!,
  bucketid: process.env.NEXT_PUBLIC_APPWRITE_BUCKET!,
  secret: process.env.NEXT_APPWRITE_SECRET!,
  otp: process.env.NEXT_PUBLIC_APPWRITE_OTP!,
};
