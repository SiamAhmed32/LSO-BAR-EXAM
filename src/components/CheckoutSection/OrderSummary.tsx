"use client";

import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { CartItem } from "@/store/slices/cartSlice";

const OrderSummary = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const subTotal = useSelector((state: RootState) => state.cart.subTotal);
  const total = useSelector((state: RootState) => state.cart.total);
  const vat = useSelector((state: RootState) => state.cart.vat);

  // Final total is just the subtotal (no HST)
  const finalTotal = subTotal;

  return (
    <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm sticky top-4">
      <div className="p-4 sm:p-6 border-b border-borderBg">
        <h2 className="text-xl sm:text-2xl font-bold text-primaryText">
          Your order
        </h2>
      </div>
      <div className="p-4 sm:p-6">
        {/* Order Items */}
        <div className="space-y-4 mb-6">
          {cartItems.length === 0 ? (
            <p className="text-sm text-primaryText/70 text-center py-4">
              Your cart is empty
            </p>
          ) : (
            cartItems.map((item: CartItem) => (
              <div
                key={item.uniqueId}
                className="flex justify-between items-start pb-4 border-b border-borderBg last:border-0"
              >
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-medium text-primaryText">
                    {item.name} <span className="text-primaryText/70">x {item.qty}</span>
                  </p>
                </div>
                <p className="text-sm sm:text-base font-semibold text-primaryText ml-4">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Order Totals */}
        <div className="space-y-3 pt-4 border-t border-borderBg">
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-primaryText/70">Subtotal:</span>
            <span className="text-primaryText font-semibold">
              ${subTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-lg sm:text-xl font-bold pt-2 border-t border-borderBg">
            <span className="text-primaryText">Total:</span>
            <span className="text-primaryColor">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

