"use client";
import React, { useEffect, useMemo, useState } from "react";
import Container from "@/components/shared/Container";
import { FreeQuestion } from "@/components/data/freeExamQuestions";
import { Bookmark, CheckCircle } from "lucide-react";

type FreeExamRunnerProps = {
  title: string;
  questions: FreeQuestion[];
};

const FreeExamRunner: React.FC<FreeExamRunnerProps> = ({
  title,
  questions,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | undefined>>(
    {}
  );
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());

  const storageKey = useMemo(
    () => `free-exam-${title.toLowerCase().replace(/\s+/g, "-")}`,
    [title]
  );

  const currentQuestion = questions[currentIndex];

  const answeredSet = useMemo(() => {
    return new Set(
      Object.entries(answers)
        .filter(([, val]) => Boolean(val))
        .map(([key]) => Number(key))
    );
  }, [answers]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        answers?: Record<number, string>;
        bookmarked?: number[];
        currentIndex?: number;
      };
      if (parsed.answers) setAnswers(parsed.answers);
      if (parsed.bookmarked)
        setBookmarked(new Set(parsed.bookmarked.filter((id) => Number.isFinite(id))));
      if (
        Number.isInteger(parsed.currentIndex) &&
        parsed.currentIndex! >= 0 &&
        parsed.currentIndex! < questions.length
      ) {
        setCurrentIndex(parsed.currentIndex!);
      }
    } catch (_e) {
      // fail silently
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, questions.length]);

  // Persist to localStorage when state changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({
          answers,
          bookmarked: Array.from(bookmarked),
          currentIndex,
        })
      );
    } catch (_e) {
      // fail silently
    }
  }, [answers, bookmarked, currentIndex, storageKey]);

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < questions.length) setCurrentIndex(idx);
  };

  const handleSelect = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const toggleBookmark = (questionId: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg min-h-screen">
      <Container>
        <div className="flex flex-col gap-8">
          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primaryText">
              {title}
            </h1>
            <p className="text-primaryText/80 text-sm sm:text-base">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>

          {/* Question navigation */}
          <div className="bg-primaryCard border border-borderBg rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-4 text-sm text-primaryText mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-primaryColor" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-3 w-3 rounded-full bg-secColor" />
                <span>Bookmarked</span>
              </div>
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = answeredSet.has(q.id);
                const isBookmarked = bookmarked.has(q.id);

                let bg = "bg-white";
                let text = "text-primaryText";
                if (isCurrent) {
                  bg = "bg-primaryColor text-white";
                  text = "text-white";
                } else if (isAnswered) {
                  bg = "bg-primaryColor/20";
                  text = "text-primaryText";
                }
                if (isBookmarked && !isCurrent) {
                  bg = "bg-secColor/30";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => goTo(idx)}
                    className={`h-9 rounded-md border border-borderBg text-sm font-semibold transition ${bg} ${text}`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question body */}
          <div className="bg-primaryCard border border-borderBg rounded-lg p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => toggleBookmark(currentQuestion.id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-borderBg text-primaryText hover:bg-primaryColor/10 transition"
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    bookmarked.has(currentQuestion.id)
                      ? "fill-primaryColor stroke-primaryColor"
                      : ""
                  }`}
                />
                <span className="text-sm font-medium">
                  {bookmarked.has(currentQuestion.id)
                    ? "Bookmarked"
                    : "Bookmark Question"}
                </span>
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-xs uppercase tracking-wide text-primaryText/70 font-semibold">
                Category: {currentQuestion.category}
              </p>
              <p className="text-base sm:text-lg text-primaryText leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const checked = answers[currentQuestion.id] === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 rounded-lg border border-borderBg p-3 sm:p-4 cursor-pointer transition hover:border-primaryColor ${
                      checked ? "bg-primaryColor/10 border-primaryColor" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      className="mt-1 h-4 w-4"
                      checked={checked}
                      onChange={() => handleSelect(currentQuestion.id, opt.id)}
                    />
                    <span className="text-sm sm:text-base text-primaryText">
                      {opt.text}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex justify-between gap-3">
              <button
                onClick={prevQuestion}
                disabled={currentIndex === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-secColor text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Back</span>
              </button>

              <button
                onClick={nextQuestion}
                disabled={currentIndex === questions.length - 1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primaryColor text-white font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <CheckCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FreeExamRunner;
