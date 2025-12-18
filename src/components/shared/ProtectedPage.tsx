import { getSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

interface ProtectedPageProps {
  children: ReactNode;
}

/**
 * Server component wrapper that protects pages requiring authentication
 * Redirects to login if user is not authenticated
 */
export default async function ProtectedPage({ children }: ProtectedPageProps) {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}

