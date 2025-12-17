import { Layout } from "@/components";
import UserAccPage from "@/components/UserAccSection/UserAccPage";
import { getSession } from "@/lib/server/session";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  const user = await getSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <Layout>
      <UserAccPage />
    </Layout>
  );
};

export default page;
