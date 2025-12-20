import RegisterPage from "@/components/RegisterSection/RegisterPage";
import { getSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  // If user is already logged in, redirect to appropriate dashboard
  const user = await getSession();

  if (user) {
    // Redirect based on user role
    if (user.role === "ADMIN") {
      redirect("/admin/dashboard");
    } else {
      redirect("/user-account");
    }
  }

  return (
    <>
      <RegisterPage />
    </>
  );
};

export default page;

