"use client";

import React, { useState, useEffect } from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ExamCard from "@/components/shared/ExamCard";
import { useUser } from "@/components/context";
import { getExamStorageKeys, hasValidExamProgress } from "@/lib/utils/examStorage";

type Props = {};

const FreePractice = (props: Props) => {
  const { user } = useUser();
  const [isBarristerInProgress, setIsBarristerInProgress] = useState(false);
  const [isSolicitorInProgress, setIsSolicitorInProgress] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userId = user?.id || null;

    // Check if Barrister exam is in progress (user-specific)
    const barristerStorageKeys = getExamStorageKeys("Barrister Sample Exam", userId);
    setIsBarristerInProgress(hasValidExamProgress(barristerStorageKeys));

    // Check if Solicitor exam is in progress (user-specific)
    const solicitorStorageKeys = getExamStorageKeys("Solicitor Sample Exam", userId);
    setIsSolicitorInProgress(hasValidExamProgress(solicitorStorageKeys));
  }, [user?.id]);

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
              "Answers with Explanations",
            ]}
            buttonText={isBarristerInProgress ? "Resume Exam" : "Begin 50 Barrister Questions"}
            href="/barrister-free-exam"
          />
          <ExamCard
            title="50 Solicitor Questions"
            features={[
              "No Timer",
              "Updated to 2025/2026",
              "Answers with Explanations",
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
