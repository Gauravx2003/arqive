// context/UserContext.tsx
"use client";

import { createContext, useContext } from "react";
import { Models } from "node-appwrite";

const UserContext = createContext<Models.Document | null>(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: Models.Document;
}) => <UserContext.Provider value={value}>{children}</UserContext.Provider>;
