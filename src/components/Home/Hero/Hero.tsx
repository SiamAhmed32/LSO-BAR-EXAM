'use client';

import Container from '@/components/shared/Container';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

const Hero = () => {
	return (
		// <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-12 sm:py-16 md:py-20 lg:py-24">
		<section className="bg-primaryColor py-30 sm:py-35 md:py-40 lg:py-45">
			<Container>
				<div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-9 xl:gap-16">
					{/* Left Side - Text Content */}
					<motion.div 
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
						className="flex-1 text-center lg:text-left"
					>
						<h1 className="text-4xl sm:text-4xl md:text-7xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight flex items-center flex-wrap gap-2">
							<span className='text-secColor text-5xl md:text-8xl lg:text-7xl xl:text-8xl'>LSO</span>
							<span className='relative inline-block'>
								{/* Decorative black bar with white dots inside above BAR EXAM */}
								<div className="absolute -top-1.5 sm:-top-4 md:-top-1 lg:-top-3  left-0 w-full flex items-center justify-start">
									<div className="relative bg-black h-3 sm:h-4 md:h-5 lg:h-6 xl:h-7 w-[110%] sm:w-[115%] md:w-[120%] overflow-visible">
										{/* White dots evenly spaced inside the black bar along the top edge */}
										<div className="absolute top-0 left-0 right-0 flex justify-evenly items-start py-1 sm:py-2 md:py-1.5 lg:py-2 px-0 sm:px-0 md:px-0 lg:px-1">
											{[...Array(20)].map((_, i) => (
												<div 
													key={i} 
													className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 bg-secColor rounded-full flex-shrink-0"
												/>
											))}
										</div>
									</div>
								</div>
								<span className='text-white relative z-10'>BAR EXAM</span>
							</span>
						</h1>
						<p className="relative top-[-24px] md:top-[-38px] lg:top-[-38px] xl:top-[-40px] text-[15.5px] sm:text-xl md:text-[30.5px] lg:text-[24.7px] xl:text-[30.6px] text-white opacity-90 font-semibold mb-6 sm:mb-8">
							LAW SOCIETY OF ONTARIO BAR EXAM
						</p>
						
						{/* CTA Button */}
						{/* <motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
						>
							<Link
								href="#paid-exams"
								className="inline-flex items-center gap-2 bg-secColor text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg hover:shadow-lg hover:shadow-secColor/30 hover:scale-105 active:scale-95 transition-all duration-200 text-base sm:text-lg group"
							>
								<BookOpen className="w-5 h-5" />
								<span>View Practice Exams</span>
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
						</motion.div> */}
					</motion.div>

					{/* Right Side - Hero Image with Circular Cutout Animation */}
					<motion.div 
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
						className="flex-1 relative w-full max-w-md lg:max-w-lg xl:max-w-xl flex justify-center lg:justify-end"
					>
						<div className="relative w-full max-w-[400px] aspect-square">
							{/* Circular background with gradient */}
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primaryColor/10 via-rose-200/20 to-pink-100/30"></div>
							
							{/* Image with circular mask and animation */}
							<motion.div 
								initial={{ scale: 0.9 }}
								animate={{ scale: 1 }}
								transition={{ duration: 1, type: "spring", stiffness: 80 }}
								className="relative w-full h-full rounded-full overflow-hidden"
							>
								<Image
									src="/heroImg.jpg"
									alt="Bar Exam Preparation"
									fill
									className="object-cover"
									priority
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
								/>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</Container>
		</section>
	);
};

export default Hero;
