import React from "react";
import Container from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared";
import ExamCard from "@/components/shared/ExamCard";
type Props = {};

const PaidPage = (props: Props) => {
  return (
    // <section className="py-12 sm:py-16 md:py-20 lg:py-24 ">
    <section className="py-12">
      <Container>
        <SectionHeading className="text-center  mb-10 sm:mb-12 md:mb-16 text-primaryText">
          {"Paid Practice Exam Timed"}
        </SectionHeading>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-[75%] mx-auto">
          <ExamCard
            title="Barrister Exam Set A"
            features={[
              "160 Barrister Questions",
              "Two(2) attempts ONLY",
              "4:30 Hour",
              "Updated to 2025/2026",
              "Answers wit Explanations",
            ]}
            buttonText="Add To Cart"
            href="/"
          />
          <ExamCard
            title="Solicitor Exam Set A"
            features={[
              "160 Barrister Questions",
              "Two(2) attempts ONLY",
              "4:30 Hour",
              "Updated to 2025/2026",
              "Answers wit Explanations",
            ]}
            buttonText="Add To Cart"
            href="/"
          />
          <ExamCard
            title="Barrister Exam Set B"
            features={[
              "160 Barrister Questions",
              "Two(2) attempts ONLY",
              "4:30 Hour",
              "Updated to 2025/2026",
              "Answers wit Explanations",
            ]}
            buttonText="Add To Cart"
            href="/"
          />
          <ExamCard
            title="Solicitor Exam Set B"
            features={[
              "160 Barrister Questions",
              "Two(2) attempts ONLY",
              "4:30 Hour",
              "Updated to 2025/2026",
              "Answers wit Explanations",
            ]}
            buttonText="Add To Cart"
            href="/"
          />
        </div>
      </Container>
    </section>
  );
};

export default PaidPage;
