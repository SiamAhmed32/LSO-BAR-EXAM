import React from 'react';
import Container from '@/components/shared/Container';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeading from '@/components/shared/SectionHeading';

const TutoringPage = () => {
	return (
		// <section className="py-16 lg:py-24 bg-primaryBg">
		<section className="py-24  lg:py-32 bg-primaryBg">
			<Container>
				{/* Page Heading */}
				<div className="text-center mb-12 sm:mb-16 md:mb-20">
					<SectionHeading className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6">
						Bar Exam Tutoring
					</SectionHeading>
					<p className="text-base sm:text-lg md:text-xl text-primaryText/80 max-w-3xl mx-auto leading-relaxed">
						Elevate your exam preparation with personalized one-on-one guidance from experienced tutors
					</p>
				</div>

				{/* Main Content Section */}
				<div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16 mb-16 sm:mb-20 md:mb-24">
					{/* Left Side - Text Content */}
					<div className="flex-1 text-left order-2 lg:order-1">
						<div className="space-y-6 sm:space-y-8 text-primaryText text-sm sm:text-base md:text-lg leading-relaxed">
							<p className="text-lg sm:text-xl md:text-2xl font-medium">
								Need more than practice questions? Our one-on-one tutoring sessions connect you with experienced tutors who have recently mastered the LSO exams.
							</p>
							<p>
								We don&apos;t just review answers; we diagnose your specific knowledge gaps, create personalized study schedules, and teach you the critical test-taking strategies required to navigate the dense LSO materials and pass with confidence.
							</p>
							<p className="font-semibold text-primaryColor text-base sm:text-lg md:text-xl">
								Stop studying harder and start studying smarter with a personalized mentor in your corner.
							</p>
						</div>
					</div>

					{/* Right Side - Image */}
					<div className="flex-1 w-full flex justify-center lg:justify-end order-1 lg:order-2">
						<div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-square rounded-lg overflow-hidden shadow-lg">
							<Image
								src="https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg"
								alt="Bar Exam Tutoring"
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
							/>
						</div>
					</div>
				</div>

				{/* Pricing/Services Section */}
				<div className="mb-16 sm:mb-20 md:mb-24">
					<SectionHeading className="text-center mb-10 sm:mb-12 md:mb-16 text-primaryText">
						Our Tutoring Packages
					</SectionHeading>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
						{/* Package 1: 1 on 1 Private Tutoring */}
						<div className="bg-primaryCard p-6 sm:p-8 rounded-lg shadow-md border border-borderBg hover:shadow-lg transition-shadow duration-300">
							<div className="border-l-4 border-secColor pl-4 sm:pl-6 mb-4">
								<h3 className="font-semibold text-lg sm:text-xl md:text-2xl text-primaryText mb-2">
									1 on 1 Private Tutoring
								</h3>
								<p className="text-secColor font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
									$40 per hour
								</p>
							</div>
							<ul className="space-y-2 text-primaryText text-sm sm:text-base">
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Personalized attention</span>
								</li>
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Flexible scheduling</span>
								</li>
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Customized learning pace</span>
								</li>
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Focus on your weak areas</span>
								</li>
							</ul>
						</div>

						{/* Package 2: Full Tutoring */}
						<div className="bg-primaryCard p-6 sm:p-8 rounded-lg shadow-md border border-borderBg hover:shadow-lg transition-shadow duration-300">
							<div className="border-l-4 border-primaryColor pl-4 sm:pl-6 mb-4">
								<h3 className="font-semibold text-lg sm:text-xl md:text-2xl text-primaryText mb-2">
									Full Tutoring Package
								</h3>
								<p className="text-primaryColor font-bold text-2xl sm:text-3xl md:text-4xl mb-2">
									$2500 each exam
								</p>
								<p className="text-sm text-primaryText/70 mb-4">
									Barrister or Solicitor
								</p>
							</div>
							<ul className="space-y-2 text-primaryText text-sm sm:text-base">
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Comprehensive exam coverage</span>
								</li>
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Multiple tutoring sessions</span>
								</li>
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Study materials included</span>
								</li>
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Progress tracking & feedback</span>
								</li>
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Test-taking strategies</span>
								</li>
							</ul>
						</div>

						{/* Package 3: Study Plan */}
						<div className="bg-primaryCard p-6 sm:p-8 rounded-lg shadow-md border border-borderBg hover:shadow-lg transition-shadow duration-300">
							<div className="border-l-4 border-secColor pl-4 sm:pl-6 mb-4">
								<h3 className="font-semibold text-lg sm:text-xl md:text-2xl text-primaryText mb-2">
									Study Plan & Schedule
								</h3>
								<p className="text-secColor font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
									$200
								</p>
							</div>
							<ul className="space-y-2 text-primaryText text-sm sm:text-base">
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Personalized study schedules</span>
								</li>
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Customized study plan</span>
								</li>
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Milestone tracking</span>
								</li>
								<li className="flex items-start">
									<span className="text-primaryColor mr-2">✓</span>
									<span>Time management strategies</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Benefits Section */}
				<div className="mb-16 sm:mb-20 md:mb-24">
					<SectionHeading className="text-center mb-10 sm:mb-12 md:mb-16 text-primaryText">
						Why Choose Our Tutoring?
					</SectionHeading>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
						<div className="text-center p-6 bg-primaryCard rounded-lg shadow-sm">
							<div className="w-16 h-16 bg-primaryColor/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-3xl">🎯</span>
							</div>
							<h3 className="font-semibold text-lg sm:text-xl text-primaryText mb-2">
								Targeted Learning
							</h3>
							<p className="text-primaryText/70 text-sm sm:text-base">
								We identify and focus on your specific knowledge gaps to maximize your study efficiency.
							</p>
						</div>

						<div className="text-center p-6 bg-primaryCard rounded-lg shadow-sm">
							<div className="w-16 h-16 bg-primaryColor/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-3xl">📚</span>
							</div>
							<h3 className="font-semibold text-lg sm:text-xl text-primaryText mb-2">
								Expert Guidance
							</h3>
							<p className="text-primaryText/70 text-sm sm:text-base">
								Learn from tutors who have recently mastered the LSO exams and understand the current requirements.
							</p>
						</div>

						<div className="text-center p-6 bg-primaryCard rounded-lg shadow-sm">
							<div className="w-16 h-16 bg-primaryColor/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-3xl">⚡</span>
							</div>
							<h3 className="font-semibold text-lg sm:text-xl text-primaryText mb-2">
								Test Strategies
							</h3>
							<p className="text-primaryText/70 text-sm sm:text-base">
								Master critical test-taking strategies to navigate dense LSO materials with confidence.
							</p>
						</div>

						<div className="text-center p-6 bg-primaryCard rounded-lg shadow-sm">
							<div className="w-16 h-16 bg-primaryColor/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-3xl">📅</span>
							</div>
							<h3 className="font-semibold text-lg sm:text-xl text-primaryText mb-2">
								Flexible Scheduling
							</h3>
							<p className="text-primaryText/70 text-sm sm:text-base">
								Schedule sessions that fit your busy lifestyle and study at your own pace.
							</p>
						</div>

						<div className="text-center p-6 bg-primaryCard rounded-lg shadow-sm">
							<div className="w-16 h-16 bg-primaryColor/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-3xl">📊</span>
							</div>
							<h3 className="font-semibold text-lg sm:text-xl text-primaryText mb-2">
								Progress Tracking
							</h3>
							<p className="text-primaryText/70 text-sm sm:text-base">
								Monitor your improvement with detailed feedback and progress assessments.
							</p>
						</div>

						<div className="text-center p-6 bg-primaryCard rounded-lg shadow-sm">
							<div className="w-16 h-16 bg-primaryColor/10 rounded-full flex items-center justify-center mx-auto mb-4">
								<span className="text-3xl">💪</span>
							</div>
							<h3 className="font-semibold text-lg sm:text-xl text-primaryText mb-2">
								Confidence Building
							</h3>
							<p className="text-primaryText/70 text-sm sm:text-base">
								Build the confidence you need to pass with personalized mentorship and support.
							</p>
						</div>
					</div>
				</div>

				{/* CTA Section */}
				<div className="text-center bg-primaryCard p-8 sm:p-10 md:p-12 rounded-lg shadow-md max-w-4xl mx-auto">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primaryText mb-4 sm:mb-6">
						Ready to Start Your Journey?
					</h2>
					<p className="text-primaryText/70 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
						Get in touch with us today to discuss your tutoring needs and find the perfect package for your exam preparation.
					</p>
					<Link
						href="/contact"
						className="inline-block text-white hover:opacity-90 duration-200 font-semibold text-base sm:text-lg md:text-xl bg-primaryColor px-8 sm:px-10 md:px-12 py-4 sm:py-5 rounded-md shadow-lg hover:shadow-xl transition-all"
					>
						Contact Us Now
					</Link>
				</div>
			</Container>
		</section>
	);
};

export default TutoringPage;

