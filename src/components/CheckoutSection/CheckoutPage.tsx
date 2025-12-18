"use client";

import React from "react";
import { Layout } from "../Layout";
import Container from "../shared/Container";
import OrderSummary from "./OrderSummary";
import CheckoutForm from "./CheckoutForm";

const CheckoutPage = () => {
  return (
    <Layout>
      <section className="py-24  lg:py-24 bg-primaryBg">
        <Container>
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primaryText mb-6 sm:mb-8">
              Checkout
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Billing Details & Payment */}
              <div className="lg:col-span-2 space-y-6">
                <CheckoutForm />
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default CheckoutPage;
