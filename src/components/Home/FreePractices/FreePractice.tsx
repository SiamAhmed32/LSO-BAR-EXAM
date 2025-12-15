"use client";

import React from "react";
import Container from "@/components/shared/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import ExamCard from "@/components/shared/ExamCard";

type Props = {};

const FreePractice = (props: Props) => {
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
            buttonText="Begin 50 Barrister Questions"
            href="/barrister-free-exam"
          />
          <ExamCard
            title="50 Solicitor Questions"
            features={[
              "No Timer",
              "Updated to 2025/2026",
              "Answers wit Explanations",
            ]}
            buttonText="Begin 50 Solicitor Questions"
            href="/solicitor-free-exam"
          />
        </div>
      </Container>
    </section>
  );
};

export default FreePractice;
