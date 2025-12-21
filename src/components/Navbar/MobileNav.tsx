'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, User, ShoppingBag } from 'lucide-react';
import { navDataLeft } from '../data/navConfig';
import CartSidebar from '../shared/CartSidebar';
import { useUser } from '../context';

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, role } = useUser();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/user-account');
    }
  };


  return (
    <>
      {/* Icons and Hamburger - Always visible on tablet/mobile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Login, Orders, and Cart Icons with primary color background */}
        <button
          onClick={handleAccountClick}
          className="p-2 rounded-full bg-primaryColor text-white hover:opacity-80 transition-opacity"
          aria-label={isAuthenticated ? 'My Account' : 'Login'}
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        {/* {isAuthenticated && role !== 'ADMIN' && (
          <Link
            href="/user-account/orders"
            className="p-2 rounded-full bg-primaryColor text-white hover:opacity-80 transition-opacity"
            aria-label="My Orders"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        )} */}
        <CartSidebar iconSize="w-4 h-4 sm:w-5 sm:h-5" />
        
        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-primaryText" />
          ) : (
            <Menu className="w-6 h-6 text-primaryText" />
          )}
        </button>
      </div>

      {/* Mobile Menu Content - Slides in from right, full width on mobile/tablet */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-primaryText" />
            </button>
          </div>

          {/* Left Navigation Items */}
          <ul className="space-y-2">
            {navDataLeft.map((navData) => (
              <li key={navData.status}>
                <button
                  onClick={toggleMenu}
                  className="w-full text-left text-primaryColor font-bold text-base px-4 py-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Link href={navData.href}>
                  {navData.title}
                  </Link>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default MobileNav;
