"use client";

import React from "react";
import { Layout } from "@/components";
import Container from "@/components/shared/Container";
import { XCircle } from "lucide-react";
import Link from "next/link";

const CheckoutFailurePage = () => {
  return (
    <Layout>
      <section className="py-24 lg:py-24 bg-primaryBg">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm p-8 sm:p-12">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-primaryText mb-4">
                Payment Failed
              </h1>
              
              <p className="text-lg text-primaryText/70 mb-6">
                Unfortunately, your payment could not be processed. Please try again.
              </p>

              <div className="space-y-4">
                <p className="text-primaryText/70">
                  If you continue to experience issues, please contact our support team.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                  <Link
                    href="/checkout"
                    className="px-6 py-3 bg-primaryColor text-white font-bold rounded-md hover:opacity-90 transition-opacity"
                  >
                    Try Again
                  </Link>
                  <Link
                    href="/"
                    className="px-6 py-3 bg-gray-200 text-primaryText font-bold rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Return Home
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

export default CheckoutFailurePage;

