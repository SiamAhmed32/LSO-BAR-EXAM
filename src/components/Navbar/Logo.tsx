import React from 'react';

const Logo = () => {
	return (
		<div className="flex flex-col">
			{/* Main Logo Text */}
			<div className="flex items-center gap-1 w-full whitespace-nowrap">
				{/* LSO in Pink */}
				<span className="text-2xl md:text-3xl lg:text-[30px] font-bold text-logoPink">LSO</span>
				{/* <span className="text-2xl font-bold text-logoPink">S</span>
				
				<span className="relative text-2xl font-bold text-logoPink">
					O
					<span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></span>
				</span> */}
				{/* BAR EXAM in Black */}
				<span className="text-2xl md:text-3xl lg:text-[29px] font-bold text-black ml-2">BAR EXAM</span>
			</div>
			{/* Subtitle */}
			<div className="w-full text-[10.5px] md:text-[12.8px] lg:text-[12.5px] whitespace-nowrap  text-black mt-0.5">
				LAW SOCIETY OF ONTARIO BAR EXAM
			</div>
		</div>
	);
};

export default Logo;

