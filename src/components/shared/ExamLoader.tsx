"use client";

import React from "react";
import { BookOpen } from "lucide-react";
import Container from "./Container";

interface ExamLoaderProps {
  examType?: "Barrister" | "Solicitor";
}

const ExamLoader: React.FC<ExamLoaderProps> = ({ examType = "Exam" }) => {
  return (
    <section className="min-h-screen bg-primaryBg py-16 sm:py-20 md:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          {/* Spinner */}
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-primaryColor/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-primaryColor border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <BookOpen className="w-8 h-8 text-primaryColor" />
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-primaryText">
              Loading {examType} Questions
            </h2>
            <p className="text-base sm:text-lg text-primaryText/70 leading-relaxed">
              We're preparing your exam questions. This may take a few moments...
            </p>
            
            {/* Loading Dots Animation */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <div className="w-2 h-2 bg-primaryColor rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primaryColor rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primaryColor rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExamLoader;

