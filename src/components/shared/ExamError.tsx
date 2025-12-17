"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Container from "./Container";
import Link from "next/link";

interface ExamErrorProps {
  examType?: "Barrister" | "Solicitor";
  onRetry?: () => void;
}

const ExamError: React.FC<ExamErrorProps> = ({ examType = "Exam", onRetry }) => {
  return (
    <section className="min-h-screen bg-primaryBg py-16 sm:py-20 md:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>

          {/* Error Text */}
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-primaryText">
              Unable to Load {examType} Questions
            </h2>
            <p className="text-base sm:text-lg text-primaryText/70 leading-relaxed">
              We encountered an error while loading your exam questions. Please try again or contact support if the problem persists.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              {onRetry ? (
                <button
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primaryColor text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </button>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primaryColor text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Reload Page</span>
                </button>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-secColor text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExamError;

