import React from "react";
import PrivacyPolicyPage from "@/components/PolicySection/PrivacyPolicyPage";
import { Layout } from "@/components/Layout";

type Props = {};

const page = (props: Props) => {
  return (
    <Layout>
      <PrivacyPolicyPage />
    </Layout>
  );
};

export default page;

