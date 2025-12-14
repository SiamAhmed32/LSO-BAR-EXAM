'use client';

import Container from '@/components/shared/Container';
import React from 'react';
import Image from 'next/image';

const Hero = () => {
	return (
		// <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-12 sm:py-16 md:py-20 lg:py-24">
		<section className="bg-primaryColor py-12 sm:py-16 md:py-20 lg:py-24">
			<Container>
				<div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
					{/* Left Side - Text Content */}
					<div className="flex-1 text-center lg:text-left">
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight flex items-center flex-wrap gap-2">
							<span className='text-secColor'>LSO</span>
							<span className='relative inline-block'>
								{/* Decorative black bar with white dots inside above BAR EXAM */}
								<div className="absolute -top-3 sm:-top-4 md:-top-5 lg:-top-6 xl:-top-7 left-0 w-full flex items-center justify-start">
									<div className="relative bg-black h-3 sm:h-4 md:h-5 lg:h-6 xl:h-7 w-[110%] sm:w-[115%] md:w-[120%] overflow-visible">
										{/* White dots evenly spaced inside the black bar along the top edge */}
										<div className="absolute top-0 left-0 right-0 flex justify-evenly items-start py-1 sm:py-2 md:py-1.5 lg:py-2 px-0 sm:px-0 md:px-0 lg:px-1">
											{[...Array(15)].map((_, i) => (
												<div 
													key={i} 
													className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 lg:w-2.5 lg:h-2.5 xl:w-3 xl:h-3 bg-white rounded-full flex-shrink-0"
												/>
											))}
										</div>
									</div>
								</div>
								<span className='text-black relative z-10'>BAR EXAM</span>
							</span>
						</h1>
						<p className="relative top-[-15px] lg:top-[-30px] text-lg sm:text-xl md:text-2xl text-black opacity-90 font-semibold">
							LAW SOCIETY OF ONTARIO BAR EXAM
						</p>
					</div>

					{/* Right Side - Hero Image with Circular Cutout Animation */}
					<div className="flex-1 relative w-full max-w-md lg:max-w-lg xl:max-w-xl flex justify-center lg:justify-end">
						<div className="relative w-full max-w-[400px] aspect-square">
							{/* Circular background with gradient */}
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primaryColor/10 via-rose-200/20 to-pink-100/30"></div>
							
							{/* Image with circular mask and animation */}
							<div className="relative w-full h-full rounded-full overflow-hidden">
								<Image
									src="/heroImg.jpg"
									alt="Bar Exam Preparation"
									fill
									className="object-cover"
									priority
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
								/>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default Hero;
