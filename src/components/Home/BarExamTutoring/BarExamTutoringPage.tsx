'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/shared/Container';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, BookOpen, Calendar } from 'lucide-react';

const BarExamTutoringPage = () => {
	return (
		<section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-secColor/5 to-primaryBg relative overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute top-0 left-0 w-96 h-96 bg-primaryColor/5 rounded-full -ml-48 -mt-48 blur-3xl"></div>
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-secColor/10 rounded-full -mr-48 -mb-48 blur-3xl"></div>
			
			<Container className="relative z-10">
				<div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
					{/* Left Side - Text Content */}
					<motion.div 
						initial={{ opacity: 0, x: -50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
						viewport={{ once: true }}
						className="flex-1 text-left order-2 lg:order-1"
					>
						<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primaryText mb-4 sm:mb-6">
							Bar Exam Tutoring
						</h2>
						<p className="text-base sm:text-lg md:text-xl text-primaryText/70 mb-6 sm:mb-8">
							Get personalized guidance from experienced tutors who've mastered the LSO exams
						</p>
						<div className="space-y-6 sm:space-y-8 text-primaryText text-sm sm:text-base md:text-lg leading-relaxed">
							<p>
								Need more than practice questions? Our one-on-one tutoring sessions connect you with experienced tutors who have recently mastered the LSO exams. We don&apos;t just review answers; we diagnose your specific knowledge gaps, create personalized study schedules, and teach you the critical test-taking strategies required to navigate the dense LSO materials and pass with confidence.
							</p>
							
							{/* Pricing/Services List with Icons */}
							<div className="space-y-4 sm:space-y-5">
								<motion.div 
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.2, duration: 0.4 }}
									viewport={{ once: true }}
									className="border-l-4 border-secColor pl-4 sm:pl-6 bg-secColor/5 rounded-r-lg p-4"
								>
									<div className="flex items-start gap-3">
										<Users className="w-6 h-6 text-secColor flex-shrink-0 mt-1" />
										<div>
											<p className="font-semibold text-base sm:text-lg md:text-xl text-primaryText mb-1">
												1 on 1 Private Tutoring
											</p>
											<p className="text-secColor font-bold text-lg sm:text-xl md:text-2xl">
												$40 per hour
											</p>
										</div>
									</div>
								</motion.div>
								
								<motion.div 
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.3, duration: 0.4 }}
									viewport={{ once: true }}
									className="border-l-4 border-secColor pl-4 sm:pl-6 bg-secColor/5 rounded-r-lg p-4"
								>
									<div className="flex items-start gap-3">
										<BookOpen className="w-6 h-6 text-secColor flex-shrink-0 mt-1" />
										<div>
											<p className="font-semibold text-base sm:text-lg md:text-xl text-primaryText mb-1">
												Full tutoring for the whole of Barrister or Solicitor
											</p>
											<p className="text-secColor font-bold text-lg sm:text-xl md:text-2xl">
												$2500 each exam
											</p>
										</div>
									</div>
								</motion.div>
								
								<motion.div 
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.4, duration: 0.4 }}
									viewport={{ once: true }}
									className="border-l-4 border-secColor pl-4 sm:pl-6 bg-secColor/5 rounded-r-lg p-4"
								>
									<div className="flex items-start gap-3">
										<Calendar className="w-6 h-6 text-secColor flex-shrink-0 mt-1" />
										<div>
											<p className="font-semibold text-base sm:text-lg md:text-xl text-primaryText mb-1">
												Personalized study schedules & Plan
											</p>
											<p className="text-secColor font-bold text-lg sm:text-xl md:text-2xl">
												$200
											</p>
										</div>
									</div>
								</motion.div>
							</div>

							{/* Enhanced CTA Button */}
							<motion.div 
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.4 }}
								viewport={{ once: true }}
								className="mt-8 sm:mt-10"
							>
								<Link
									href="/contact"
									className="inline-flex items-center gap-3 bg-gradient-to-r from-secColor to-secColor/90 text-white font-bold py-4 px-8 rounded-lg hover:shadow-xl hover:shadow-secColor/30 hover:scale-105 active:scale-95 transition-all duration-200 text-base sm:text-lg md:text-xl group"
								>
									<span>Get Started with Tutoring</span>
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
								</Link>
							</motion.div>
						</div>
					</motion.div>

					{/* Right Side - Image */}
					<motion.div 
						initial={{ opacity: 0, x: 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
						viewport={{ once: true }}
						className="flex-1 w-full flex justify-center lg:justify-end order-1 lg:order-2"
					>
						<div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-square rounded-lg overflow-hidden shadow-2xl">
							<Image
								src="https://images.pexels.com/photos/2682452/pexels-photo-2682452.jpeg"
								alt="Bar Exam Tutoring"
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
							/>
							{/* Overlay gradient */}
							<div className="absolute inset-0 bg-gradient-to-t from-secColor/20 to-transparent"></div>
						</div>
					</motion.div>
				</div>
			</Container>
		</section>
	);
};

export default BarExamTutoringPage;