import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

interface ExamCardProps {
	title: string;
	features: string[];
	buttonText: string;
	href: string;
	onButtonClick?: () => void;
	disabled?: boolean;
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
	price,
	duration,
}) => {
	return (
		<div className="bg-primaryColor/3 rounded-lg border border-borderBg shadow-sm p-6 sm:p-8 flex flex-col h-full">
			{/* Title */}
			<h3 className="text-xl sm:text-2xl font-bold text-primaryText">
				{title}
			</h3>

			{/* Price & Duration */}
			{typeof price === 'number' && (
				<p className="mt-2 text-2xl sm:text-3xl font-extrabold text-secColor tracking-tight">
					${price.toFixed(2)} <span className="text-sm font-semibold text-primaryText/80">USD</span>
				</p>
			)}
			{duration && (
				<p className="mt-1 text-xs sm:text-sm text-primaryText/80 font-medium">
					Duration: {duration}
				</p>
			)}

			{/* Features List */}
			<ul className="space-y-3 sm:space-y-4 flex-1 mt-4 mb-6">
				{features.map((feature, index) => (
					<li key={index} className="flex items-start gap-3">
						<Check className="w-5 h-5 text-primaryColor flex-shrink-0 mt-0.5" />
						<span className="text-sm sm:text-base text-primaryText">
							{feature}
						</span>
					</li>
				))}
			</ul>

			{/* CTA Button */}
			{onButtonClick ? (
				<button
					type="button"
					onClick={onButtonClick}
					disabled={disabled}
					className={`w-full bg-primaryColor text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity text-center text-sm sm:text-base ${
						disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
					}`}
				>
					{buttonText}
				</button>
			) : (
				<Link
					href={href}
					className="w-full bg-primaryColor text-white font-bold py-3 px-6 rounded-md hover:opacity-90 transition-opacity text-center text-sm sm:text-base"
				>
					{buttonText}
				</Link>
			)}
		</div>
	);
};

export default ExamCard;

