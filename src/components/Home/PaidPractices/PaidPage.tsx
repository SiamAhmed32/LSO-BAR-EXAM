"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Container from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared";
import ExamCard from "@/components/shared/ExamCard";
import type { RootState } from "@/store";
import { addToCart, addExamToCartBackend, checkExamInCart, resetCart, deleteSingleItemFromCart, type CartItem } from "@/store/slices/cartSlice";
import { cartApi } from "@/lib/api/cartApi";
import { useUser } from "@/components/context";
import { examApi } from "@/lib/api/examApi";
import { getExamStorageKeys, hasValidExamProgress } from "@/lib/utils/examStorage";

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
  // Use any here to avoid TS complaining about thunk return type being unknown
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { isAuthenticated, user } = useUser();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const isLoadingCart = useSelector((state: RootState) => state.cart.isLoading);
  const [addingToCart, setAddingToCart] = useState<Record<string, boolean>>({});
  const [removingFromCart, setRemovingFromCart] = useState<Record<string, boolean>>({});

  const [examMeta, setExamMeta] = useState<
    Record<
      string,
      {
        price: number;
        examTime: string;
        questionCount: number;
        attemptCount: number | null;
      }
    >
  >({});
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);
  const [purchasedExams, setPurchasedExams] = useState<Set<string>>(new Set());
  const [isLoadingPurchased, setIsLoadingPurchased] = useState(false);
  const [examProgressStatus, setExamProgressStatus] = useState<
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
        const fallback: Record<string, { price: number; examTime: string; questionCount: number; attemptCount: number | null }> = {};
        PAID_EXAMS.forEach((exam) => {
          fallback[exam.id] = {
            price: 0,
            examTime: "Duration not set",
            questionCount: 0,
            attemptCount: null,
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

  // Fetch purchased exams when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setPurchasedExams(new Set());
      return;
    }

    let isMounted = true;

    const loadPurchasedExams = async () => {
      setIsLoadingPurchased(true);
      try {
        const purchased = await examApi.getPurchasedExams();
        if (!isMounted) return;
        setPurchasedExams(new Set(purchased));
      } catch (error) {
        console.error("Failed to load purchased exams:", error);
        if (!isMounted) return;
        setPurchasedExams(new Set());
      } finally {
        if (isMounted) {
          setIsLoadingPurchased(false);
        }
      }
    };

    void loadPurchasedExams();

    // Refresh purchased exams when page comes into focus (e.g., after payment success)
    const handleFocus = () => {
      if (isAuthenticated) {
        void loadPurchasedExams();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated]);

  // Check exam progress status for all paid exams (user-specific)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const userId = user?.id || null;

    const checkProgress = () => {
      const status: Record<string, boolean> = {};
      PAID_EXAMS.forEach((exam) => {
        const storageKeys = getExamStorageKeys(exam.title, userId);
        status[exam.id] = hasValidExamProgress(storageKeys);
      });
      setExamProgressStatus(status);
    };

    // Check initially
    checkProgress();

    // Listen for storage changes (when exam starts/finishes)
    const userPrefix = userId ? userId : "guest";
    const prefix = `exam-progress-${userPrefix}-`;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith(prefix)) {
        checkProgress();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically in case localStorage is changed in same tab
    const interval = setInterval(checkProgress, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [user?.id]);

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

      toast.success("Exam added to cart successfully!");
    } catch (error: any) {
      console.error("Failed to add exam to cart:", error);
      toast.error(error || "Failed to add exam to cart. Please try again.");
    } finally {
      // Clear loading state
      setAddingToCart((prev) => ({ ...prev, [examId]: false }));
    }
  };

  const handleRemoveFromCart = async (
    examId: string,
    examType: "barrister" | "solicitor",
    examSet: "set-a" | "set-b"
  ) => {
    if (!isAuthenticated) {
      toast.info("Please login to manage your cart.");
      return;
    }

    // Set loading state for this specific exam
    setRemovingFromCart((prev) => ({ ...prev, [examId]: true }));

    try {
      // Find the cart item to get its uniqueId
      const cartItem = cartItems.find((item: CartItem) => {
        const itemId = item.id || item._id;
        return itemId === examId;
      });

      if (cartItem) {
        // Remove from local Redux state first for immediate UI update
        dispatch(deleteSingleItemFromCart(cartItem.uniqueId));
      }

      // Remove from backend cart
      await cartApi.removeExamFromCart(examType, examSet);

      toast.success("Exam removed from cart successfully!");
    } catch (error: any) {
      console.error("Failed to remove exam from cart:", error);
      toast.error(error?.message || "Failed to remove exam from cart. Please try again.");
    } finally {
      // Clear loading state
      setRemovingFromCart((prev) => ({ ...prev, [examId]: false }));
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
              // Check if exam is purchased (user has completed payment)
              const isPurchased = purchasedExams.has(exam.id);

              // Check if exam is in cart (but not purchased)
              const isInCart = isAuthenticated && cartItems.some((item: CartItem) => {
                const itemId = item.id || item._id;
                return itemId === exam.id;
              });

              // Check if exam is in progress (localStorage has progress)
              const isExamInProgress = examProgressStatus[exam.id] || false;

              const meta = examMeta[exam.id] || {
                price: 0,
                examTime: "Duration not set",
                questionCount: 0,
                attemptCount: null,
              };

              const beginHref =
                exam.id === "barrister-set-a"
                  ? "/barrister-exam/set-a"
                  : exam.id === "barrister-set-b"
                  ? "/barrister-exam/set-b"
                  : exam.id === "solicitor-set-a"
                  ? "/solicitor-exam/set-a"
                  : "/solicitor-exam/set-b";

              // Determine button text and behavior
              // Priority: Purchased > In Cart > Not in Cart
              let buttonText: string;
              if (isPurchased) {
                // After payment: show "Begin Exam" or "Resume Exam"
                if (isExamInProgress) {
                  buttonText = "Resume Exam";
                } else {
                  buttonText = "Begin Exam";
                }
              } else if (isInCart) {
                // In cart but not purchased: show "Remove from Cart"
                buttonText = "Remove from Cart";
              } else {
                // Not in cart: show "Add To Cart"
                buttonText = "Add To Cart";
              }

              // Build dynamic features
              const dynamicFeatures = [
                    meta.questionCount > 0 
                      ? `${meta.questionCount} ${exam.examType === "barrister" ? "Barrister" : "Solicitor"} Questions`
                      : exam.baseFeatures[0] || "Questions",
                    meta.attemptCount !== null && meta.attemptCount > 0
                      ? `${meta.attemptCount === 1 ? "One" : meta.attemptCount === 2 ? "Two" : meta.attemptCount} attempt${meta.attemptCount > 1 ? "s" : ""} ONLY`
                      : exam.baseFeatures[1] || "Two(2) attempts ONLY",
                    ...exam.baseFeatures.slice(2), // Keep "Updated to 2025/2026" and "Answers with Explanations"
                  ];

              return (
                <ExamCard
                  key={exam.id}
                  title={exam.title}
                  features={dynamicFeatures}
                  price={meta.price}
                  duration={meta.examTime}
                  buttonText={buttonText}
                  href={isPurchased ? beginHref : "#"}
                  isLoading={addingToCart[exam.id] || removingFromCart[exam.id] || false}
                  onButtonClick={
                    isPurchased
                      ? undefined
                      : isInCart
                      ? () =>
                          handleRemoveFromCart(
                            exam.id,
                            exam.examType,
                            exam.pricingKey
                          )
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
