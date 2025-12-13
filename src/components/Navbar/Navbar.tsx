'use client';

import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { navDataLeft, navDataRight } from "../data/navConfig";
import { User, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="relative">
      <div className="flex items-center px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-4 gap-4 sm:gap-8 md:gap-12">
        {/* Logo - Always visible */}
        <Logo />
        
        {/* Desktop: Center - Left Navigation Items (hidden on tablet/mobile, visible from lg/1024px+) */}
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <ul className="flex gap-2 sm:gap-3 md:gap-4">
            {navDataLeft.map((navData) => (
              <li
                key={navData.status}
                className="text-primaryText font-bold text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-3 md:px-4 py-1 sm:py-2 duration-300 hover:text-primaryColor cursor-pointer"
              >
                {navData.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop: Right - Right Navigation Items (hidden on tablet/mobile, visible from lg/1024px+) */}
        <div className="hidden lg:flex justify-center items-center">
          <ul className="flex gap-2 sm:gap-3 md:gap-4">
            {navDataRight.map((navData) => (
              <li key={navData.url}>
                <Link
                  href={navData.url}
                  className="text-primaryText font-bold text-xs sm:text-sm md:text-base lg:text-lg px-2 sm:px-3 md:px-4 py-1 sm:py-2 duration-300 hover:text-primaryColor cursor-pointer"
                >
                  {navData.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Tablet/Mobile: Icons and Hamburger Menu (visible from tablet and below, hidden from lg/1024px+) */}
        <div className="lg:hidden flex-1 flex justify-end">
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
