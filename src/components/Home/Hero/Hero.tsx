'use client';

import Container from '@/components/shared/Container';
import ButtonPrimary from '@/components/shared/ButtonPrimary';
import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
	return (
		<section className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-12 sm:py-16 md:py-20 lg:py-24">
			<Container>
				<div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
					{/* Left Side - Text Content */}
					<div className="flex-1 text-center lg:text-left">
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primaryText mb-4 sm:mb-6 leading-tight">
							Quality, Accessible Bar Exam Prep Materials
						</h1>
						<p className="text-lg sm:text-xl md:text-2xl text-primaryText opacity-80 mb-6 sm:mb-8 lg:mb-10">
							Prepare for the Ontario Bar Exams
						</p>
						
						{/* Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
							<ButtonPrimary
								href="/"
								icon={<ArrowRight className="w-5 h-5" />}
								iconPosition="right"
								className="bg-primaryColor text-white border-primaryColor hover:bg-button-dark hover:border-button-dark px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-md"
							>
								Try Free Mini Exams
							</ButtonPrimary>
							<ButtonPrimary
								href="/"
								className="bg-white text-primaryColor border-2 border-primaryColor hover:bg-primaryColor hover:text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-md"
							>
								Buy Questions
							</ButtonPrimary>
						</div>
					</div>

					{/* Right Side - Hero Image with Circular Cutout Animation */}
					<div className="flex-1 relative w-full max-w-md lg:max-w-lg xl:max-w-xl flex justify-center lg:justify-end">
						<div className="relative w-full max-w-[400px] aspect-square">
							{/* Circular background with gradient */}
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-primaryColor/10 via-rose-200/20 to-pink-100/30"></div>
							
							{/* Image with circular mask and animation */}
							<div className="relative w-full h-full rounded-full overflow-hidden animate-float">
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
