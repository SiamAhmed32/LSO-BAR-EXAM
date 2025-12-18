"use client";

import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { navDataLeft } from "../data/navConfig";
import { User } from "lucide-react";
import Container from "../shared/Container";
import { useUser } from "../context";
import CartSidebar from "../shared/CartSidebar";
import { useDispatch } from "react-redux";
import { resetCart } from "@/store/slices/cartSlice";

const Navbar = () => {
  const { isAuthenticated, role } = useUser();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Clear cart on logout
      dispatch(resetCart());
    } catch {
      // ignore error; still redirect
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-[9999] bg-white">
      <Container>
        <div className="flex items-center px-2 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-8 lg:py-4 gap-4 sm:gap-8 md:gap-12">
          {/* Logo - Always visible */}
          <Link href="/">
            <Logo />
          </Link>

          {/* Desktop: Center - Left Navigation Items (hidden on tablet/mobile, visible from lg/1024px+) */}
          <div className="hidden lg:flex flex-1 justify-center items-center">
            <ul className="flex gap-2 sm:gap-3 md:gap-3 lg:gap-2 xl:gap-4">
              {navDataLeft.map((navData) => (
                <li key={navData.status}>
                  <Link
                    href={navData.href}
                    className="text-primaryText font-bold text-xs sm:text-sm md:text-base lg:text-md xl:text-xl px-2 sm:px-3 md:px-3 lg:px-2 xl:px-4 py-1 sm:py-2 whitespace-nowrap duration-300 hover:text-primaryColor cursor-pointer"
                  >
                    {navData.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop: Right - Login + Cart icon (hidden on tablet/mobile, visible from lg/1024px+) */}
          <div className="hidden lg:flex justify-center items-center gap-3">
            {!isAuthenticated ? (
              <Link
                href="/login"
                className="bg-primaryColor text-white inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm md:text-base hover:opacity-80 transition"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            ) : (
              <Link
                type="button"
                href={role === "ADMIN" ? "/admin/dashboard" : "/user-account"}
                className="bg-primaryColor text-white inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm md:text-base hover:opacity-80 transition whitespace-nowrap "
              >
                <User className="w-4 h-4" />
                <span>My Account</span>
              </Link>
            )}

            <CartSidebar />
          </div>

          {/* Tablet/Mobile: Icons and Hamburger Menu (visible from tablet and below, hidden from lg/1024px+) */}
          <div className="lg:hidden flex-1 flex justify-end">
            <MobileNav />
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
