"use client";

import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CartSidebarProps {
  className?: string;
  iconSize?: string;
}

export default function CartSidebar({ 
  className = "", 
  iconSize = "w-5 h-5" 
}: CartSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={`p-2 rounded-full bg-primaryColor text-white hover:opacity-80 transition ${className}`}
          aria-label="Cart"
        >
          <ShoppingCart className={iconSize} />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[420px] max-w-[90vw] p-0">
        <div className="flex h-full flex-col">
          <div className="bg-primaryColor px-5 py-4 text-white">
            <SheetHeader>
              <SheetTitle className="text-white text-xl font-bold">
                Shopping Cart
              </SheetTitle>
            </SheetHeader>
          </div>
          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <p className="text-sm text-primaryText">
              Your cart is currently empty.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

