'use client';

import Container from '@/components/shared/Container';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';

const slogans = [
	"Students Who Tutor With Us Pass at Dramatically Higher Rates.",
	"From Practice to Passed: The Exam Sets That Make the Difference.",
	"Boost Your Score. Build Your Confidence. Buy the Sets That Deliver.",
	"Join the Candidates Who Practiced Smart and Passed Fast.",
];

const Hero = () => {
	const [currentSloganIndex, setCurrentSloganIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSloganIndex((prev) => (prev + 1) % slogans.length);
		}, 4000); // Change slogan every 4 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<section className="bg-primaryColor py-20 sm:py-20 md:py-24 lg:py-28 xl:py-32 relative overflow-hidden">
			{/* Subtle background pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute inset-0" style={{
					backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
					backgroundSize: '40px 40px'
				}}></div>
			</div>

			<Container className="relative z-10">
				<div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
					{/* Left Side - Text Content with Rotating Slogans */}
					<motion.div 
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
						className="flex-1 text-center lg:text-left w-full"
					>
						{/* Rotating Slogan - Fixed height container to prevent jumping */}
						<div className="relative h-[140px] sm:h-[160px] md:h-[200px] lg:h-[220px] xl:h-[240px] flex items-center justify-center lg:justify-start mb-6 sm:mb-8">
							<AnimatePresence mode="wait">
								<motion.h1
									key={currentSloganIndex}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.5, ease: "easeInOut" }}
									className="absolute inset-0 flex items-center justify-center lg:justify-start text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight text-white px-0"
									style={{ fontFamily: 'var(--font-primary)' }}
								>
									{slogans[currentSloganIndex]}
								</motion.h1>
							</AnimatePresence>
						</div>

						{/* Slogan Indicators */}
						<div className="flex justify-center lg:justify-start gap-2 mb-8 sm:mb-10">
							{slogans.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentSloganIndex(index)}
									className={`h-2 rounded-full transition-all duration-300 ${
										index === currentSloganIndex
											? 'w-8 bg-secColor'
											: 'w-2 bg-white/40 hover:bg-white/60'
									}`}
									aria-label={`Go to slogan ${index + 1}`}
								/>
							))}
						</div>

						{/* Key Benefits */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							className="mb-8 sm:mb-10 space-y-3 sm:space-y-4"
						>
							{[
								"Updated to 2025/2026 Exam Format",
								"Comprehensive Practice Sets",
								"Detailed Answer Explanations"
							].map((benefit, index) => (
								<div key={index} className="flex items-center justify-center lg:justify-start gap-3">
									<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-secColor flex-shrink-0" />
									<span className="text-white/90 text-base sm:text-lg md:text-xl font-medium">
										{benefit}
									</span>
								</div>
							))}
						</motion.div>
						
						{/* CTA Button */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
						>
							<Link
								href="/practice"
								className="inline-flex items-center justify-center gap-2 bg-secColor text-primaryText font-bold py-4 px-8 sm:py-5 sm:px-10 rounded-lg hover:shadow-lg hover:shadow-secColor/30 hover:scale-105 active:scale-95 transition-all duration-200 text-base sm:text-lg md:text-xl group"
							>
								<BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
								<span>View Practice Exams</span>
								<ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
							</Link>
						</motion.div>
					</motion.div>

					{/* Right Side - Hero Image */}
					<motion.div 
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
						className="flex-1 relative w-full max-w-md md:max-w-xl lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl flex justify-center lg:justify-end"
					>
						<div className="relative w-full max-w-[450px] md:max-w-[500px] lg:max-w-[480px] xl:max-w-[500px] 2xl:max-w-[600px] aspect-square">
							{/* Decorative gradient circles */}
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-secColor/20 via-secColor/10 to-transparent blur-3xl"></div>
							
							{/* Image with rounded corners and shadow */}
							<motion.div 
								initial={{ scale: 0.9, rotate: -2 }}
								animate={{ scale: 1, rotate: 0 }}
								transition={{ duration: 1, type: "spring", stiffness: 80 }}
								className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-secColor/20"
							>
								<Image
									src="/heroImgFinal.jpg"
									alt="Bar Exam Preparation"
									fill
									className="object-cover"
									priority
									sizes="(max-width: 768px) 100vw, (max-width: 1024px) 500px, (max-width: 1280px) 480px, (max-width: 1536px) 500px, 600px"
								/>
							</motion.div>

							{/* Floating decoration */}
							<motion.div
								animate={{
									y: [0, -10, 0],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut"
								}}
								className="absolute -top-4 -right-4 w-20 h-20 bg-secColor/20 rounded-full blur-xl"
							/>
						</div>
					</motion.div>
				</div>
			</Container>
		</section>
	);
};

export default Hero;
