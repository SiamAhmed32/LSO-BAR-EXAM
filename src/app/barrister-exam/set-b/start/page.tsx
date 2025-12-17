"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "@/components";
import FreeExamRunner from "@/components/ExamRunner/FreeExamRunner";
import ExamLoader from "@/components/shared/ExamLoader";
import ExamError from "@/components/shared/ExamError";
import ExamEmpty from "@/components/shared/ExamEmpty";
import { examApi } from "@/lib/api/examApi";
import { transformApiQuestionsToFreeQuestions } from "@/lib/utils/examTransform";
import type { FreeQuestion } from "@/components/data/freeExamQuestions";

const BarristerSetBStartPage = () => {
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

        const response = await examApi.getQuestions("barrister", "set-b", 1, 200);
        const transformed = transformApiQuestionsToFreeQuestions(response.questions);

        if (!isMounted) return;
        setQuestions(transformed);
        // Set duration from exam metadata
        if (response.exam?.examTime) {
          setDuration(response.exam.examTime);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Barrister Set B - Failed to load questions:", err);
        setError(err?.message || "Failed to load exam questions.");
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
    <Layout>
      <FreeExamRunner
        title="Barrister Exam Set B"
        questions={questions}
        duration={duration}
        examType="barrister"
        examSet="set-b"
      />
    </Layout>
  );
};
export default BarristerSetBStartPage;