"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Layout } from "@/components";
import Container from "@/components/shared/Container";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { resetCart } from "@/store/slices/cartSlice";
import { cartApi } from "@/lib/api/cartApi";

const CheckoutSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const dispatch = useDispatch();

  // Clear cart from localStorage and backend when order is successful
  useEffect(() => {
    // 1. Clear client-side state (Redux + localStorage)
    dispatch(resetCart());

    // 2. Clear backend cart (redundancy for when webhook is delayed/fails)
    // This ensures that when the user refreshes or navigates, the backend cart is empty
    const clearBackendCart = async () => {
      try {
        await cartApi.clearCart();
      } catch (error) {
        console.error("Failed to clear backend cart", error);
      }
    };

    clearBackendCart();
  }, [dispatch]);

  return (
    <Layout>
      <section className="py-24 lg:py-24 bg-primaryBg">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm p-8 sm:p-12">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-primaryText mb-4">
                Payment Successful!
              </h1>

              <p className="text-lg text-primaryText/70 mb-6">
                Thank you for your purchase. Your order has been processed
                successfully.
              </p>

              {orderId && (
                <div className="bg-gray-50 border border-borderBg rounded-lg p-4 mb-6">
                  <p className="text-sm text-primaryText/70">Order ID:</p>
                  <p className="text-lg font-semibold text-primaryText">
                    {orderId}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <p className="text-primaryText/70">
                  You will receive a confirmation email shortly with your order
                  details.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Link
                    href="/practice"
                    className="px-6 py-3 bg-primaryColor text-white font-bold rounded-md hover:opacity-90 transition-opacity"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/user-account/orders"
                    className="px-6 py-3 bg-gray-200 text-primaryText font-bold rounded-md hover:bg-gray-300 transition-colors"
                  >
                    View Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default CheckoutSuccessPage;
