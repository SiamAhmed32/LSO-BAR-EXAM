import SolicitorFreePage from '@/components/Home/SolicitorFreeSections/SolicitorFreePage';
import { Layout } from '@/components/Layout';
import React from 'react';

type Props = {};

const page = (props: Props) => {
	return (
		<Layout>
			<SolicitorFreePage />
		</Layout>
	);
};

export default page;

