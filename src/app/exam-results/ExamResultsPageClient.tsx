"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Layout } from "@/components";
import ExamResults from "@/components/ExamRunner/ExamResults";

const ExamResultsPageClient = () => {
  const searchParams = useSearchParams();

  const examType = searchParams.get("examType") || "barrister";
  const examSet = searchParams.get("examSet") || "set-a";
  const totalQuestions = parseInt(searchParams.get("total") || "0", 10);
  const answeredCount = parseInt(searchParams.get("answered") || "0", 10);
  const title = searchParams.get("title") || "Exam";

  return (
    <Layout>
      <ExamResults
        examType={examType}
        examSet={examSet}
        totalQuestions={totalQuestions}
        answeredCount={answeredCount}
        title={title}
      />
    </Layout>
  );
};

export default ExamResultsPageClient;

