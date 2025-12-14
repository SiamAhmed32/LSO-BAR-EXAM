import React from 'react';
import Container from '@/components/shared/Container';
import Image from 'next/image';
import Link from 'next/link';

const BarExamTutoringPage = () => {
	return (
		<section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg">
			<Container>
				<div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
					{/* Left Side - Image */}
					<div className="flex-1 w-full flex justify-center lg:justify-start order-2 lg:order-1">
						<div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-square rounded-lg overflow-hidden">
							<Image
								src="https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg"
								alt="Bar Exam Tutoring"
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
							/>
						</div>
					</div>

					{/* Right Side - Text Content */}
					<div className="flex-1 text-left order-1 lg:order-2">
						<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primaryText mb-6 sm:mb-8">
							Bar Exam Tutoring
						</h2>
						<div className="space-y-6 sm:space-y-8 text-primaryText text-sm sm:text-base md:text-lg leading-relaxed">
							<p>
								Need more than practice questions? Our one-on-one tutoring sessions connect you with experienced tutors who have recently mastered the LSO exams. We don&apos;t just review answers; we diagnose your specific knowledge gaps, create personalized study schedules, and teach you the critical test-taking strategies required to navigate the dense LSO materials and pass with confidence. Stop studying harder and start studying smarter with a personalized mentor in your corner.
							</p>
							
							{/* Pricing/Services List */}
							<div className="space-y-4 sm:space-y-5">
								<div className="border-l-4 border-secColor pl-4 sm:pl-6">
									<p className="font-semibold text-base sm:text-lg md:text-xl text-primaryText mb-1">
										1 on 1 Private Tutoring
									</p>
									<p className="text-secColor font-bold text-lg sm:text-xl md:text-2xl">
										$40 per hour
									</p>
								</div>
								
								<div className="border-l-4 border-secColor pl-4 sm:pl-6">
									<p className="font-semibold text-base sm:text-lg md:text-xl text-primaryText mb-1">
										Full tutoring for the whole of Barrister or Solicitor
									</p>
									<p className="text-secColor font-bold text-lg sm:text-xl md:text-2xl">
										$2500 each exam
									</p>
								</div>
								
								<div className="border-l-4 border-secColor pl-4 sm:pl-6">
									<p className="font-semibold text-base sm:text-lg md:text-xl text-primaryText mb-1">
										Personalized study schedules & Plan
									</p>
									<p className="text-secColor font-bold text-lg sm:text-xl md:text-2xl">
										$200
									</p>
								</div>
							</div>

							{/* Contact Link */}
							<div className="mt-6 sm:mt-8">
								<Link
									href="/contact"
									className="text-white hover:text-secColor duration-200 font-semibold text-base sm:text-lg md:text-xl bg-primaryColor p-4 rounded-md"
								>
									Click here to contact
								</Link>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default BarExamTutoringPage;