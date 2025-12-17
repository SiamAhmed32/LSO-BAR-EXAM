"use client";

import React from "react";
import Container from "../shared/Container";
import AccountSidebar from "./AccountSidebar";
import AccountDetails from "./AccountDetails";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import Link from "next/link";

type Props = {};

const UserAccPage = (props: Props) => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  return (
    <section className="min-h-screen bg-primaryBg py-16 sm:py-20 md:py-24 lg:py-28">
      <Container>
        <div className="flex flex-col lg:flex-row gap-0">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0 relative">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:pl-8 pt-8 lg:pt-0 pb-12">
            <div className="mb-6">
              <nav className="text-sm text-gray-500 mb-4">
                <span>Home</span>
                <span className="mx-2">/</span>
                <span>Account</span>
                <span className="mx-2">/</span>
                <span className="text-primaryText font-semibold">
                  Account Details
                </span>
              </nav>
              <h1 className="text-3xl font-bold text-primaryText">
                Account Details
              </h1>
            </div>

            <AccountDetails />

            {/* Exams Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-primaryText mb-4">
                Your Exams
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-primaryText/80 text-sm sm:text-base">
                  You have not added any paid exams yet. Go to{" "}
                  <Link href="/practice-questions" className="text-primaryColor underline">
                    Practice Questions
                  </Link>{" "}
                  to add an exam.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.uniqueId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-borderBg rounded-lg bg-primaryCard p-4"
                    >
                      {(() => {
                        const examId = item.id;
                        const beginHref =
                          examId === "barrister-set-a"
                            ? "/barrister-exam/set-a/start"
                            : examId === "barrister-set-b"
                            ? "/barrister-exam/set-b/start"
                            : examId === "solicitor-set-a"
                            ? "/solicitor-exam/set-a/start"
                            : examId === "solicitor-set-b"
                            ? "/solicitor-exam/set-b/start"
                            : "#";

                        return (
                          <>
                            <div>
                              <p className="text-primaryText font-semibold text-sm sm:text-base">
                                {item.name}
                              </p>
                              <p className="text-xs text-primaryText/70 mt-1">
                                Status: <span className="font-medium">Ready to begin</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Link
                                href={beginHref}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primaryColor text-white text-sm font-semibold hover:opacity-90 transition"
                              >
                                Begin Exam
                              </Link>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UserAccPage;