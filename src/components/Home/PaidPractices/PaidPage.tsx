"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Container from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared";
import ExamCard from "@/components/shared/ExamCard";
import type { RootState } from "@/store";
import { addToCart, type CartItem } from "@/store/slices/cartSlice";
import { useUser } from "@/components/context";
import { examApi } from "@/lib/api/examApi";

type Props = {};

const PAID_EXAMS = [
  {
    id: "barrister-set-a",
    title: "Barrister Exam Set A",
    examType: "barrister" as const,
    pricingKey: "set-a" as const,
    baseFeatures: [
      "160 Barrister Questions",
      "Two(2) attempts ONLY",
      "Updated to 2025/2026",
      "Answers with Explanations",
    ],
  },
  {
    id: "solicitor-set-a",
    title: "Solicitor Exam Set A",
    examType: "solicitor" as const,
    pricingKey: "set-a" as const,
    baseFeatures: [
      "160 Solicitor Questions",
      "Two(2) attempts ONLY",
      "Updated to 2025/2026",
      "Answers with Explanations",
    ],
  },
  {
    id: "barrister-set-b",
    title: "Barrister Exam Set B",
    examType: "barrister" as const,
    pricingKey: "set-b" as const,
    baseFeatures: [
      "160 Barrister Questions",
      "Two(2) attempts ONLY",
      "Updated to 2025/2026",
      "Answers with Explanations",
    ],
  },
  {
    id: "solicitor-set-b",
    title: "Solicitor Exam Set B",
    examType: "solicitor" as const,
    pricingKey: "set-b" as const,
    baseFeatures: [
      "160 Solicitor Questions",
      "Two(2) attempts ONLY",
      "Updated to 2025/2026",
      "Answers with Explanations",
    ],
  },
] as const;

const PaidPage = (props: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const [examMeta, setExamMeta] = useState<
    Record<
      string,
      {
        price: number;
        examTime: string;
      }
    >
  >({});
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);

  // Load dynamic price & duration for each paid exam from public endpoint
  useEffect(() => {
    let isMounted = true;

    const loadMeta = async () => {
      setIsLoadingMeta(true);
      try {
        // Fetch all exam metadata in one call (public endpoint, no auth required)
        const metadata = await examApi.getExamMetadata();

        if (!isMounted) return;
        setExamMeta(metadata);
      } catch (error) {
        console.error("Failed to load paid exam metadata:", error);
        // Fallback: set default values for all exams
        if (!isMounted) return;
        const fallback: Record<string, { price: number; examTime: string }> = {};
        PAID_EXAMS.forEach((exam) => {
          fallback[exam.id] = {
            price: 0,
            examTime: "Duration not set",
          };
        });
        setExamMeta(fallback);
      } finally {
        if (isMounted) {
          setIsLoadingMeta(false);
        }
      }
    };

    void loadMeta();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = (examId: string, title: string, price: number) => {
    // Require login before adding paid exams to cart
    if (!isAuthenticated) {
      toast.info("Please login to add paid exams to your account.");
      router.push("/login");
      return;
    }

    dispatch(
      addToCart({
        item: {
          id: examId,
          _id: examId,
          name: title,
          price,
          vat: 0,
        },
        qty: 1,
      })
    );
  };

  return (
    <section className="py-12">
      <Container>
        <SectionHeading className="text-center  mb-10 sm:mb-12 md:mb-16 text-primaryText">
          {"Paid Practice Exam Timed"}
        </SectionHeading>

        {isLoadingMeta ? (
          // Section Loader - shows while fetching price/duration metadata
          <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-24">
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-primaryColor/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primaryColor border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-base sm:text-lg text-primaryText/70 font-medium">
              Loading exam information...
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-primaryColor rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primaryColor rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primaryColor rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-[75%] mx-auto">
            {PAID_EXAMS.map((exam) => {
              // Only consider cart contents when the user is authenticated
              const isInCart =
                isAuthenticated && cartItems.some((item: CartItem) => item.id === exam.id);

              const meta = examMeta[exam.id] || {
                price: 0,
                examTime: "Duration not set",
              };

              const beginHref =
                exam.id === "barrister-set-a"
                  ? "/barrister-exam/set-a/start"
                  : exam.id === "barrister-set-b"
                  ? "/barrister-exam/set-b/start"
                  : exam.id === "solicitor-set-a"
                  ? "/solicitor-exam/set-a/start"
                  : "/solicitor-exam/set-b/start";

              return (
                <ExamCard
                  key={exam.id}
                  title={exam.title}
                  features={[
                    ...(exam.baseFeatures || []),
                    // keep feature list focused on content; price/duration shown separately
                  ]}
                  price={meta.price}
                  duration={meta.examTime}
                  buttonText={isInCart ? "Begin Exam" : "Add To Cart"}
                  href={isInCart ? beginHref : "#"}
                  onButtonClick={
                    isInCart
                      ? undefined
                      : () => handleAddToCart(exam.id, exam.title, meta.price)
                  }
                />
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
};

export default PaidPage;
