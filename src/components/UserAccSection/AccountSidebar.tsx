"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, ChevronRight, Home, ShoppingBag } from "lucide-react";
import { useUser } from "../context";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { resetCart } from "@/store/slices/cartSlice";
import { clearUserExamProgress } from "@/lib/utils/examStorage";

const AccountSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Clear exam progress for current user before logout
      if (user?.id) {
        clearUserExamProgress(user.id);
      }
      await fetch("/api/auth/logout", { method: "POST" });
      // Clear cart on logout
      dispatch(resetCart());
    } catch {
      // ignore error; still redirect
    } finally {
      router.push("/login");
      router.refresh();
    }
  };

  const menuItems = [
    {
      title: "Account Details",
      href: "/user-account",
      icon: User,
    },
    {
      title: "My Orders",
      href: "/user-account/orders",
      icon: ShoppingBag,
    },
  ];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full lg:w-64 bg-white lg:border-r border-b lg:border-b-0 border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primaryColor text-white flex items-center justify-center font-bold text-sm">
            {getInitials(user?.name)}
          </div>
          <div>
            <p className="font-semibold text-primaryText text-sm">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500">{user?.email || ""}</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Account
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primaryColor text-white"
                      : "text-primaryText hover:bg-gray-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 mt-auto space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-primaryText hover:bg-gray-100 transition-colors w-full cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-primaryText hover:bg-gray-100 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;

