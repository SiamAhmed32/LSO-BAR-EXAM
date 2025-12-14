import React from 'react';
import FaqPage from '@/components/FaqSection/FaqPage';
import { Layout } from '@/components/Layout';

type Props = {};

const page = (props: Props) => {
  return (
    <Layout>
      <FaqPage />
    </Layout>
  );
};

export default page;
