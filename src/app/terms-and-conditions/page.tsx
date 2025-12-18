import React from "react";
import TermsAndConditionsPage from "@/components/PolicySection/TermsAndConditionsPage";
import { Layout } from "@/components/Layout";

type Props = {};

const page = (props: Props) => {
  return (
    <Layout>
      <TermsAndConditionsPage />
    </Layout>
  );
};

export default page;

