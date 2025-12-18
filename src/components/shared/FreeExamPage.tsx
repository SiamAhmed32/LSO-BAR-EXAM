'use client';

import React, { useState } from 'react';
import Container from '@/components/shared/Container';
import SectionHeading from '@/components/shared/SectionHeading';
import { useRouter } from 'next/navigation';

interface FreeExamPageProps {
	examType: 'barrister' | 'solicitor';
	examTitle: string;
	/**
	 * Optional explicit path to navigate to after accepting terms.
	 * If not provided, defaults to the free exam start route.
	 */
	startPath?: string;
}

const FreeExamPage: React.FC<FreeExamPageProps> = ({
	examType,
	examTitle,
	startPath,
}) => {
	const router = useRouter();
	const [hasAgreed, setHasAgreed] = useState(false);

	const handleAgree = () => {
		setHasAgreed(true);

		// If a custom target path is provided (e.g., for paid exams), use it.
		// Otherwise fall back to the default free exam start route.
		const targetPath = startPath || `/${examType}-free-exam/start`;
		router.push(targetPath);
	};

	return (
		<section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg min-h-screen">
			<Container>
				<div className="max-w-4xl mx-auto">
					{/* Page Heading */}
					<div className="text-center mb-8 sm:mb-12">
						<SectionHeading className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-primaryText">
							{examTitle}
						</SectionHeading>
					</div>

					{/* Copyright Notice Section */}
					<div className="mb-8 sm:mb-12">
						<div className="bg-primaryCard border border-borderBg rounded-lg p-6 sm:p-8">
							<h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4 sm:mb-6">
								COPYRIGHT NOTICE
							</h2>
							<div className="space-y-4 text-primaryText text-sm sm:text-base leading-relaxed">
								<p>
									All material on{' '}
									<a
										href="https://www.lsobarexam.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-primaryColor hover:underline font-semibold"
									>
										https://www.lsobarexam.com
									</a>{' '}
									is copyrighted and the property of LSO Bar Exam. This includes:
								</p>
								<ul className="list-disc list-inside space-y-2 ml-4">
									<li>All practice questions; and</li>
									<li>All solutions to the practice questions</li>
								</ul>
								<p>
									By taking this exam, you agree that you will not take any screenshots, photos,
									or otherwise engage in the unauthorized reproduction, dissemination, copying or
									other unauthorized use of any material on{' '}
									<a
										href="https://www.lsobarexam.com"
										target="_blank"
										rel="noopener noreferrer"
										className="text-primaryColor hover:underline font-semibold"
									>
										https://www.lsobarexam.com
									</a>
									. <strong>ANYONE WHO ENGAGES IN SUCH CONDUCT WILL BE PURSUED TO THE FULLEST EXTENT OF THE LAW.</strong> As someone who is hoping to enter into the legal profession, you are highly advised not to breach copyright laws.
								</p>
							</div>
						</div>
					</div>

					{/* Disclaimer Section */}
					<div className="mb-8 sm:mb-12">
						<div className="bg-primaryCard border border-borderBg rounded-lg p-6 sm:p-8">
							<h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4 sm:mb-6">
								DISCLAIMER
							</h2>
							<div className="space-y-4 text-primaryText text-sm sm:text-base leading-relaxed">
								<p>
									LSO Bar Exam is not affiliated with the Law Society of Ontario. While we
									used our best efforts in creating these questions, we do not guarantee their
									accuracy. We will not be responsible for any actual or potential negative impact
									that these questions may have on your bar exam performance.
								</p>
							</div>
						</div>
					</div>

					{/* Agree Button */}
					<div className="text-center">
						<button
							onClick={handleAgree}
							disabled={hasAgreed}
							className="px-8 py-4 cursor-pointer bg-primaryColor text-white font-semibold text-base sm:text-lg rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{hasAgreed ? 'Terms Accepted' : 'I Agree To These Terms'}
						</button>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default FreeExamPage;

