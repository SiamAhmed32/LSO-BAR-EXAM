'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ShoppingCart, Play } from 'lucide-react';
import Loader from './Loader';

interface ExamCardProps {
	title: string;
	features: string[];
	buttonText: string;
	href: string;
	onButtonClick?: () => void;
	disabled?: boolean;
	isLoading?: boolean;
	price?: number;
	duration?: string;
}

const ExamCard: React.FC<ExamCardProps> = ({
	title,
	features,
	buttonText,
	href,
	onButtonClick,
	disabled = false,
	isLoading = false,
	price,
	duration,
}) => {
	const isAddToCart = buttonText.toLowerCase().includes('add to cart') || buttonText.toLowerCase().includes('cart');
	const isBeginExam = buttonText.toLowerCase().includes('begin') || buttonText.toLowerCase().includes('resume');

	return (
		<>
			{/* 
			=== ORIGINAL LIGHT THEME (COMMENTED OUT) ===
			<div className="bg-gradient-to-br from-white to-primaryColor/5 rounded-lg border-2 border-borderBg shadow-lg hover:shadow-xl transition-all duration-300 p-6 sm:p-8 flex flex-col h-full relative overflow-hidden group">
				<div className="absolute top-0 right-0 w-32 h-32 bg-secColor/10 rounded-full -mr-16 -mt-16 group-hover:bg-secColor/20 transition-colors"></div>
				<h3 className="text-xl sm:text-2xl font-bold text-primaryText relative z-10">{title}</h3>
				{typeof price === 'number' && (
					<p className="mt-2 text-2xl sm:text-3xl font-extrabold text-secColor tracking-tight relative z-10">
						${price.toFixed(2)} <span className="text-sm font-semibold text-primaryText/80">CAD</span>
					</p>
				)}
				{duration && (
					<p className="mt-1 text-xs sm:text-sm text-primaryText/80 font-medium relative z-10">
						Duration: {duration}
					</p>
				)}
				<ul className="space-y-3 sm:space-y-4 flex-1 mt-4 mb-6 relative z-10">
					{features.map((feature, index) => (
						<li key={index} className="flex items-start gap-3">
							<Check className="w-5 h-5 text-primaryColor flex-shrink-0 mt-0.5" />
							<span className="text-sm sm:text-base text-primaryText">{feature}</span>
						</li>
					))}
				</ul>
				... buttons ...
			</div>
			=== END ORIGINAL LIGHT THEME ===
			*/}

			{/* DARK PREMIUM THEME */}
			<div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl border border-gray-700/50 shadow-2xl hover:shadow-secColor/20 transition-all duration-500 p-6 sm:p-8 flex flex-col h-full relative overflow-hidden group backdrop-blur-sm">
				{/* Decorative glow effects */}
				<div className="absolute top-0 right-0 w-40 h-40 bg-secColor/20 rounded-full -mr-20 -mt-20 blur-2xl group-hover:bg-secColor/30 transition-colors duration-500"></div>
				<div className="absolute bottom-0 left-0 w-32 h-32 bg-primaryColor/15 rounded-full -ml-16 -mb-16 blur-xl"></div>
				<div className="absolute inset-0 bg-gradient-to-t from-secColor/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
				
				{/* Title */}
				<h3 className="text-xl sm:text-2xl font-bold text-white relative z-10 tracking-tight">
					{title}
				</h3>

				{/* Price & Duration */}
				{typeof price === 'number' && (
					<p className="mt-2 text-2xl sm:text-3xl font-extrabold text-secColor tracking-tight relative z-10 drop-shadow-lg">
						${price.toFixed(2)} <span className="text-sm font-semibold text-gray-400">CAD</span>
					</p>
				)}
				{duration && (
					<p className="mt-1 text-xs sm:text-sm text-gray-400 font-medium relative z-10">
						Duration: {duration}
					</p>
				)}

				{/* Features List */}
				<ul className="space-y-3 sm:space-y-4 flex-1 mt-4 mb-6 relative z-10">
					{features.map((feature, index) => (
						<li key={index} className="flex items-start gap-3">
							<Check className="w-5 h-5 text-secColor flex-shrink-0 mt-0.5" />
							<span className="text-sm sm:text-base text-gray-200">
								{feature}
							</span>
						</li>
					))}
				</ul>

				{/* CTA Button - Enhanced with glow */}
				{onButtonClick ? (
					<button
						type="button"
						onClick={onButtonClick}
						disabled={disabled || isLoading}
						className={`w-full bg-gradient-to-r from-secColor via-secColor to-secColor/80 text-gray-900 font-bold py-4 px-6 rounded-lg hover:shadow-lg hover:shadow-secColor/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center text-sm sm:text-base flex items-center justify-center gap-2 relative z-10 ${
							disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
						}`}
					>
						{isLoading && <Loader size="sm" />}
						{!isLoading && isAddToCart && <ShoppingCart className="w-5 h-5" />}
						{!isLoading && isBeginExam && <Play className="w-5 h-5" />}
						{buttonText}
					</button>
				) : (
					<Link
						href={href}
						className="w-full bg-gradient-to-r from-secColor via-secColor to-secColor/80 text-gray-900 font-bold py-4 px-6 rounded-lg hover:shadow-lg hover:shadow-secColor/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center text-sm sm:text-base flex items-center justify-center gap-2 relative z-10"
					>
						{isBeginExam && <Play className="w-5 h-5" />}
						{buttonText}
					</Link>
				)}
			</div>
		</>
	);
};

export default ExamCard;

