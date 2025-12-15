import BarristerFreePage from '@/components/Home/BarristerFreeSections/BarristerFreePage';
import { Layout } from '@/components/Layout';
import React from 'react';

type Props = {};

const page = (props: Props) => {
	return (
		<Layout>
			<BarristerFreePage />
		</Layout>
	);
};

export default page;