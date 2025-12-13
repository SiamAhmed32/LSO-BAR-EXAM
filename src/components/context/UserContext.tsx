"use client";

import { createContext, useContext, ReactNode, useMemo } from "react";
import { SessionUser } from "@/lib/server/session";
interface UserContextType {
  user: SessionUser | null;
  role: SessionUser["role"] | null;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: SessionUser | null;
}) {
  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: Boolean(user),
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  console.log("useUser", ctx);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
