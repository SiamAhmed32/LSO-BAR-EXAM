"use client";

import { ShoppingCart, X, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { RootState } from "@/store";
import { deleteSingleItemFromCart, type CartItem } from "@/store/slices/cartSlice";
import Link from "next/link";

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

  const handleRemove = (uniqueId: string) => {
    dispatch(deleteSingleItemFromCart(uniqueId));
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className={`relative p-2 rounded-full bg-primaryColor text-white hover:opacity-80 transition ${className}`}
          aria-label="Cart"
        >
          <ShoppingCart className={iconSize} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[420px] max-w-[90vw] p-0 flex flex-col">
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
          {cartItems.length === 0 ? (
            <div className="flex flex-1 items-center justify-center px-6 py-10">
              <p className="text-sm text-primaryText">
                Your cart is currently empty.
              </p>
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
                            ${item.price.toFixed(2)} USD
                          </p>
                          {item.qty > 1 && (
                            <p className="text-xs text-primaryText/70 mt-1">
                              Quantity: {item.qty}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(item.uniqueId)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
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
                      ${total.toFixed(2)} USD
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

