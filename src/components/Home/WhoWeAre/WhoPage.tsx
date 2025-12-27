import React from 'react';
import Container from '@/components/shared/Container';
import Image from 'next/image';

type Props = {};

const WhoPage = (props: Props) => {
	return (
		<section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg">
			<Container>
				<div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
					{/* Left Side - Image */}
					<div className="flex-1 w-full flex justify-center lg:justify-start">
						<div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl aspect-square rounded-lg overflow-hidden bg-primaryBg/50">
							<Image
								src="/whoImgFinal.png"
								alt="Who We Are"
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
								priority
								quality={90}
								loading="eager"
							/>
						</div>
					</div>

					{/* Right Side - Text Content */}
					<div className="flex-1 text-left">
						<h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primaryText mb-6 sm:mb-8">
							Who We Are
						</h2>
						<div className="space-y-4 sm:space-y-5 md:space-y-6 text-primaryText text-sm sm:text-base md:text-lg leading-relaxed">
							<p>
								We started{' '}
								<a
									href="https://www.LSOBarExam.com"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primaryColor hover:underline font-semibold"
								>
									https://www.LSOBarExam.com
								</a>{' '}
								because we were sick of the same old story: overpriced bar prep that treats Ontario candidates like walking wallets instead of future lawyers. Most sites recycle the same tired questions year after year, slap a new date on them, and call it &quot;updated.&quot; Worse, half of them still have wrong answers floating around because nobody bothered to double-check against the actual 2025-2026 LSO materials. We&apos;ve seen it. We&apos;ve failed because of it. And we said never again.
							</p>
							<p>
								That&apos;s why everything here is built from the ground up for the current cycle—no recycled garbage, no &quot;close enough&quot; answers. Every single question is 100% aligned with the 2025-2026 Barrister and Solicitor indexing materials, cross-checked obsessively so you&apos;re never second-guessing whether the answer key is playing games with you.
							</p>
							<p>
								We offer a free exam question set to see how our questions are framed. The real way to challenge yourself is in the real exam-style question package - Barrister Exam Set A, Barrister Exam Set B, Solicitor Exam Set A and Solicitor Exam Set B. These paid exam sets are carefully created to test your Barrister and Solicitor core competency, which, according to LSO, you will be 100% tested. There are 160 questions just like the real exam to simulate the actual test day pressure.
							</p>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default WhoPage;