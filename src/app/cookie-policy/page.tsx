import React from "react";
import CookiePolicyPage from "@/components/PolicySection/CookiePolicyPage";
import { Layout } from "@/components/Layout";

type Props = {};

const page = (props: Props) => {
  return (
    <Layout>
      <CookiePolicyPage />
    </Layout>
  );
};

export default page;

