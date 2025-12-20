"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ExamCard from "@/components/shared/ExamCard";

type Props = {};

const FreePractice = (props: Props) => {
  const [isBarristerInProgress, setIsBarristerInProgress] = useState(false);
  const [isSolicitorInProgress, setIsSolicitorInProgress] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkExamProgress = (storageKeys: string[]): boolean => {
      for (const key of storageKeys) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            // Only consider it "in progress" if there's valid exam progress data
            const hasValidProgress = parsed && (
              (parsed.answers && Object.keys(parsed.answers).length > 0) ||
              (parsed.bookmarked && parsed.bookmarked.length > 0) ||
              (typeof parsed.currentIndex === 'number' && parsed.currentIndex >= 0)
            );
            if (hasValidProgress) {
              return true;
            }
          } catch (error) {
            // Invalid JSON, ignore
          }
        }
      }
      return false;
    };

    // Check if Barrister exam is in progress
    const barristerStorageKeys = [
      "free-exam-barrister-sample-exam",
      "free-exam-barrister-free-exam"
    ];
    setIsBarristerInProgress(checkExamProgress(barristerStorageKeys));

    // Check if Solicitor exam is in progress
    const solicitorStorageKeys = [
      "free-exam-solicitor-sample-exam",
      "free-exam-solicitor-free-exam"
    ];
    setIsSolicitorInProgress(checkExamProgress(solicitorStorageKeys));
  }, []);

  return (
    // <section className="py-12 sm:py-16 md:py-12 lg:py-12 ">
    <section className="py-12">
      <Container>
        <SectionHeading className="text-center mb-10 sm:mb-12 md:mb-16 text-primaryText">
          Free Exam Questions
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-[75%] mx-auto">
          <ExamCard
            title="50 Barrister Questions"
            features={[
              "No Timer",
              "Updated to 2025/2026",
              "Answers wit Explanations",
            ]}
            buttonText={isBarristerInProgress ? "Resume Exam" : "Begin 50 Barrister Questions"}
            href="/barrister-free-exam"
          />
          <ExamCard
            title="50 Solicitor Questions"
            features={[
              "No Timer",
              "Updated to 2025/2026",
              "Answers wit Explanations",
            ]}
            buttonText={isSolicitorInProgress ? "Resume Exam" : "Begin 50 Solicitor Questions"}
            href="/solicitor-free-exam"
          />
        </div>
      </Container>
    </section>
  );
};

export default FreePractice;
