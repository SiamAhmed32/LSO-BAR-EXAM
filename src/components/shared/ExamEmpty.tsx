"use client";

import React from "react";
import { FileQuestion } from "lucide-react";
import Container from "./Container";
import Link from "next/link";

interface ExamEmptyProps {
  examType?: "Barrister" | "Solicitor";
}

const ExamEmpty: React.FC<ExamEmptyProps> = ({ examType = "Exam" }) => {
  return (
    <section className="min-h-screen bg-primaryBg py-16 sm:py-20 md:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          {/* Empty Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
              <FileQuestion className="w-10 h-10 text-gray-400" />
            </div>
          </div>

          {/* Empty Text */}
          <div className="text-center space-y-4 max-w-md">
            <h2 className="text-2xl sm:text-3xl font-bold text-primaryText">
              No Questions Available
            </h2>
            <p className="text-base sm:text-lg text-primaryText/70 leading-relaxed">
              There are currently no {examType} questions available. Please check back later or contact support for more information.
            </p>
            
            {/* Action Button */}
            <div className="pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primaryColor text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
              >
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ExamEmpty;

