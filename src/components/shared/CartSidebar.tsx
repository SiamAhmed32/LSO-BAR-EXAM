"use client";

import { ShoppingCart, X, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { RootState } from "@/store";
import {
  deleteSingleItemFromCart,
  type CartItem,
} from "@/store/slices/cartSlice";
import Link from "next/link";
import { useUser } from "@/components/context";
import { cartApi } from "@/lib/api/cartApi";
import { toast } from "react-toastify";
import Loader from "./Loader";

interface CartSidebarProps {
  className?: string;
  iconSize?: string;
}

export default function CartSidebar({
  className = "",
  iconSize = "w-5 h-5",
}: CartSidebarProps) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const subTotal = useSelector((state: RootState) => state.cart.subTotal);
  const total = useSelector((state: RootState) => state.cart.total);
  const isLoadingCart = useSelector((state: RootState) => state.cart.isLoading);
  const { isAuthenticated } = useUser();

  // Prevent hydration mismatch by only showing cart count after mount
  const [isMounted, setIsMounted] = useState(false);
  const [removingItems, setRemovingItems] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRemove = async (item: CartItem) => {
    // Set loading state for this item
    setRemovingItems((prev) => ({ ...prev, [item.uniqueId]: true }));

    // Remove from Redux/localStorage first for immediate UI update
    dispatch(deleteSingleItemFromCart(item.uniqueId));

    // Also delete from backend if user is authenticated
    if (isAuthenticated && item.id) {
      try {
        // Parse examId (format: "barrister-set-a" or "solicitor-set-b")
        // Split by "-set-" to get ["barrister", "a"] or ["solicitor", "b"]
        const examIdParts = item.id.split("-set-");
        if (examIdParts.length === 2) {
          const examType = examIdParts[0] as "barrister" | "solicitor";
          const examSetLetter = examIdParts[1]; // "a" or "b"
          const examSet = `set-${examSetLetter}` as "set-a" | "set-b";

          await cartApi.removeExamFromCart(examType, examSet);
        }
      } catch (error) {
        console.error("Failed to remove exam from backend cart:", error);
        // Don't show error to user since item is already removed from UI
      }
    }

    // Clear loading state
    setRemovingItems((prev) => ({ ...prev, [item.uniqueId]: false }));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={`relative p-2 rounded-full bg-primaryColor text-white hover:opacity-80 transition ${className}`}
          aria-label="Cart"
        >
          <ShoppingCart className={iconSize} />
          {isMounted && isAuthenticated && cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[420px] max-w-[90vw] p-0 flex flex-col"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="bg-primaryColor px-5 py-4 text-white">
            <SheetHeader>
              <SheetTitle className="text-white text-xl font-bold">
                Shopping Cart
              </SheetTitle>
            </SheetHeader>
          </div>

          {/* Cart Items */}
          {!isAuthenticated ? (
            <div className="flex flex-1 items-center justify-center px-6 py-10">
              <p className="text-sm text-primaryText">
                Please login to view your cart.
              </p>
            </div>
          ) : isLoadingCart ? (
            <div className="flex flex-1 items-center justify-center px-6 py-16 md:py-24">
              <div className="flex flex-col items-center gap-4">
                <Loader size="md" />
                <p className="text-sm text-primaryText/70">
                  Loading your cart...
                </p>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-6 py-16 md:py-24">
              <div className="max-w-md w-full text-center">
                {/* Optional: Subtle Illustration or Icon */}
                <div className="mb-8 relative">
                  <div className="mx-auto w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 md:w-20 md:h-20 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 010 4 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  {/* Subtle ring effect */}
                  {/* <div className="absolute inset-0 -z-10 animate-ping rounded-full bg-gray-200 opacity-20"></div> */}
                </div>

                {/* Heading */}
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                  Your cart is empty
                </h2>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed">
                  Looks like you haven't added anything to your cart yet.
                  Explore our collection and find something you'll love.
                </p>

                {/* Premium CTA Button */}
                <button className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primaryColor hover:bg-primaryColor/90 rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Link href="/practice" className="relative z-10">Continue Shopping</Link>

                  <svg
                    className="ml-3 w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-4">
                  {cartItems.map((item: CartItem) => (
                    <div
                      key={item.uniqueId}
                      className="bg-white border border-borderBg rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-primaryText mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                          <p className="text-lg font-bold text-primaryColor">
                            ${item.price.toFixed(2)} CAD
                          </p>
                          {item.qty > 1 && (
                            <p className="text-xs text-primaryText/70 mt-1">
                              Quantity: {item.qty}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item)}
                          disabled={removingItems[item.uniqueId]}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          aria-label="Remove item"
                        >
                          {removingItems[item.uniqueId] ? (
                            <Loader size="sm" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t border-borderBg bg-white px-4 py-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-primaryText/70">Subtotal:</span>
                    <span className="text-primaryText font-semibold">
                      ${subTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-primaryText">Total:</span>
                    <span className="text-primaryColor">
                      ${total.toFixed(2)} CAD
                    </span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full text-center px-4 py-3 bg-primaryColor text-white font-bold rounded-md hover:opacity-90 transition"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
