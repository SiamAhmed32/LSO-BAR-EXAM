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
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
							<span className='text-secColor'>LSO</span>
							 <span className='text-black'>BAR EXAM</span>
						</h1>
						<p className="text-lg sm:text-xl md:text-2xl text-white opacity-90">
							LAW SOCIETY OF ONTARIO BAR EXAM
						</p>
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
