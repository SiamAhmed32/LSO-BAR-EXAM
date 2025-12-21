"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "@/components";
import FreeExamRunner from "@/components/ExamRunner/FreeExamRunner";
import ExamLoader from "@/components/shared/ExamLoader";
import ExamError from "@/components/shared/ExamError";
import ExamEmpty from "@/components/shared/ExamEmpty";
import PaidExamAccessCheck from "@/components/shared/PaidExamAccessCheck";
import { examApi } from "@/lib/api/examApi";
import { transformApiQuestionsToFreeQuestions } from "@/lib/utils/examTransform";
import type { FreeQuestion } from "@/components/data/freeExamQuestions";

const BarristerSetAStartPageClient = () => {
  const [questions, setQuestions] = useState<FreeQuestion[]>([]);
  const [duration, setDuration] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await examApi.getQuestions("barrister", "set-a", 1, 200);
        const transformed = transformApiQuestionsToFreeQuestions(response.questions);

        if (!isMounted) return;
        setQuestions(transformed);
        // Set duration from exam metadata
        if (response.exam?.examTime) {
          setDuration(response.exam.examTime);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Barrister Set A - Failed to load questions:", err);
        // Handle 403 Forbidden (not purchased or no attempts)
        if (err?.message?.includes("purchase") || err?.message?.includes("attempts")) {
          setError("ACCESS_DENIED");
        } else {
          setError(err?.message || "Failed to load exam questions.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadQuestions();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <ExamLoader examType="Barrister" />
      </Layout>
    );
  }

  if (error) {
    // If error is access denied, PaidExamAccessCheck will handle it
    if (error === "ACCESS_DENIED") {
      return null; // Let PaidExamAccessCheck handle the display
    }
    return (
      <Layout>
        <ExamError examType="Barrister" />
      </Layout>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Layout>
        <ExamEmpty examType="Barrister" />
      </Layout>
    );
  }

  return (
    <PaidExamAccessCheck examId="barrister-set-a" examName="Barrister Exam Set A">
      <Layout>
        <FreeExamRunner
          title="Barrister Exam Set A"
          questions={questions}
          duration={duration}
          examType="barrister"
          examSet="set-a"
        />
      </Layout>
    </PaidExamAccessCheck>
  );
};

export default BarristerSetAStartPageClient;
