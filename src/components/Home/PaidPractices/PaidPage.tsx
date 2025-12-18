"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Container from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared";
import ExamCard from "@/components/shared/ExamCard";
import type { RootState, AppDispatch } from "@/store";
import { addToCart, addExamToCartBackend, checkExamInCart, resetCart, type CartItem } from "@/store/slices/cartSlice";
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
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const isLoadingCart = useSelector((state: RootState) => state.cart.isLoading);
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});

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
  const [backendCartStatus, setBackendCartStatus] = useState<
    Record<string, boolean>
  >({});

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

  // Clear cart when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setBackendCartStatus({});
      // Clear local cart when logged out
      dispatch(resetCart());
    }
  }, [isAuthenticated, dispatch]);

  const handleAddToCart = async (
    examId: string,
    title: string,
    price: number,
    examType: "barrister" | "solicitor",
    examSet: "set-a" | "set-b"
  ) => {
    // Require login before adding paid exams to cart
    if (!isAuthenticated) {
      toast.info("Please login to add paid exams to your account.");
      router.push("/login");
      return;
    }

    // Set loading state for this specific exam
    setAddingToCart((prev) => ({ ...prev, [examId]: true }));

    try {
      // Add to backend cart
      await dispatch(
        addExamToCartBackend({
          examType,
          examSet,
        })
      ).unwrap();

      // Also add to local Redux state for immediate UI update
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

      // Update backend cart status
      setBackendCartStatus((prev) => ({ ...prev, [examId]: true }));

      toast.success("Exam added to cart successfully!");
    } catch (error: any) {
      console.error("Failed to add exam to cart:", error);
      toast.error(error || "Failed to add exam to cart. Please try again.");
    } finally {
      // Clear loading state
      setAddingToCart((prev) => ({ ...prev, [examId]: false }));
    }
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
              // Only check cart status when authenticated
              // Use local Redux state as primary source since backend cart API
              // finds cart by userId only, not by specific examId
              const isInLocalCart = isAuthenticated && cartItems.some((item: CartItem) => {
                // Match by exact exam ID - be very precise
                // Check both id and _id fields, and ensure exact match
                const itemId = item.id || item._id;
                return itemId === exam.id;
              });
              
              // Only show "Begin Exam" if exam is in local cart
              // Don't rely on backend status check since it's not exam-specific
              const isInCart = isAuthenticated && isInLocalCart;

              const meta = examMeta[exam.id] || {
                price: 0,
                examTime: "Duration not set",
              };

              const beginHref =
                exam.id === "barrister-set-a"
                  ? "/barrister-exam/set-a"
                  : exam.id === "barrister-set-b"
                  ? "/barrister-exam/set-b"
                  : exam.id === "solicitor-set-a"
                  ? "/solicitor-exam/set-a"
                  : "/solicitor-exam/set-b";

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
                  isLoading={addingToCart[exam.id] || false}
                  onButtonClick={
                    isInCart
                      ? undefined
                      : () =>
                          handleAddToCart(
                            exam.id,
                            exam.title,
                            meta.price,
                            exam.examType,
                            exam.pricingKey
                          )
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
