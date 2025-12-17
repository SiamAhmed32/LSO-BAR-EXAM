"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Container from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared";
import ExamCard from "@/components/shared/ExamCard";
import type { RootState } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { useUser } from "@/components/context";

type Props = {};

const PAID_EXAMS = [
  {
    id: "barrister-set-a",
    title: "Barrister Exam Set A",
    price: 0,
    features: [
      "160 Barrister Questions",
      "Two(2) attempts ONLY",
      "4:30 Hour",
      "Updated to 2025/2026",
      "Answers with Explanations",
    ],
  },
  {
    id: "solicitor-set-a",
    title: "Solicitor Exam Set A",
    price: 0,
    features: [
      "160 Solicitor Questions",
      "Two(2) attempts ONLY",
      "4:30 Hour",
      "Updated to 2025/2026",
      "Answers with Explanations",
    ],
  },
  {
    id: "barrister-set-b",
    title: "Barrister Exam Set B",
    price: 0,
    features: [
      "160 Barrister Questions",
      "Two(2) attempts ONLY",
      "4:30 Hour",
      "Updated to 2025/2026",
      "Answers with Explanations",
    ],
  },
  {
    id: "solicitor-set-b",
    title: "Solicitor Exam Set B",
    price: 0,
    features: [
      "160 Solicitor Questions",
      "Two(2) attempts ONLY",
      "4:30 Hour",
      "Updated to 2025/2026",
      "Answers with Explanations",
    ],
  },
];

const PaidPage = (props: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated } = useUser();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-[75%] mx-auto">
          {PAID_EXAMS.map((exam) => {
            // Only consider cart contents when the user is authenticated
            const isInCart =
              isAuthenticated && cartItems.some((item) => item.id === exam.id);

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
                features={exam.features}
                buttonText={isInCart ? "Begin Exam" : "Add To Cart"}
                href={isInCart ? beginHref : "#"}
                onButtonClick={
                  isInCart ? undefined : () => handleAddToCart(exam.id, exam.title, exam.price)
                }
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default PaidPage;
