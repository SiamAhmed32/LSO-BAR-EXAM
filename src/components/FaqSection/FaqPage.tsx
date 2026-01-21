'use client';

import React from 'react';
import Container from '@/components/shared/Container';
import SectionHeading from '@/components/shared/SectionHeading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type Props = {};

const FaqPage = (props: Props) => {
  return (
    <section className="py-24  lg:py-32 bg-primaryBg">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Page Heading */}
          <div className="text-center mb-8 sm:mb-12">
            <SectionHeading className="text-3xl sm:text-4xl md:text-5xl mb-4">
              Frequently Asked Questions
            </SectionHeading>
            <p className="text-primaryText text-base sm:text-lg opacity-80">
              Find answers to common questions about our bar exam preparation materials
            </p>
          </div>

          {/* Refunds, Extensions and Coupons Section */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-6">
              Refunds, Extensions and Coupons
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="refund-1" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  Are refunds available for purchased exams?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      We offer refunds within 7 days of purchase if you haven&apos;t started the exam. 
                      Once you begin an exam, refunds are not available as the content becomes accessible.
                    </p>
                    <p>
                      To request a refund, please contact us through our contact page with your order number 
                      and reason for the refund request.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refund-2" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  Is there a coupon code currently available?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      We periodically offer coupon codes and promotional discounts. 
                      To stay updated on current offers, please subscribe to our newsletter or follow us on social media.
                    </p>
                    <p>
                      Special discounts are often available for students, early bird registrations, 
                      and bundle purchases. Check our website regularly for the latest promotions.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* General Inquiries Section */}
          <div className="mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-6">
              General Inquiries
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="general-2" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  What is the difference between free and paid exams?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Our free mini exams provide a sample of our question format and quality, allowing you to 
                      practice with unlimited attempts. These are perfect for getting familiar with our platform 
                      and question style.
                    </p>
                    <p>
                      The paid full exams (Barrister Set A/B, Solicitor Set A/B) contain 160 comprehensive questions 
                      each, completely different from the free exams. They include timed exam conditions (4.5 hours), 
                      limited attempts (2 per purchase), and detailed explanations - providing a realistic exam simulation 
                      aligned with 2025-2026 LSO materials.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-4" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  Are my exam answers saved as I complete the exam?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Yes, your answers are automatically saved as you progress through the exam. 
                      You can pause and resume the exam at any time, and your progress will be preserved.
                    </p>
                    <p>
                      However, once you submit the exam, you cannot change your answers. 
                      Make sure to review all questions before final submission.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-5" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  Can I review my answers after completing an exam?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Absolutely! After completing an exam, you can review all your answers, 
                      see which questions you got correct or incorrect, and read detailed explanations for each question.
                    </p>
                    <p>
                      This review feature allows you to study and learn from your mistakes.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-6" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  Do the purchased exams contain questions that are different from the free mini exams?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Yes! The purchased full exams (160 questions each) contain completely different questions 
                      from the free mini exams. This ensures you get maximum value and comprehensive practice.
                    </p>
                    <p>
                      The free mini exams serve as a sample to help you understand our question format and quality, 
                      while the full exams provide extensive practice material aligned with the 2025-2026 LSO materials.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-7" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                 How do your practice questions compare to the real exam?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Our exams are modelled on the current Ontario bar exam format (length, style, difficulty and subject distribution), and include detailed answer explanations to help build competence and confidence.
                    </p>
                    <p>
                      We recommend practicing all three Professional Responsibility question sets regardless of 
                      which exam you&apos;re taking, as they cover different aspects of professional ethics 
                      that may appear on either exam.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-8" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  Are there multiple versions of each exam?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Each exam set (Barrister Exam Set A, Set B, Solicitor Exam Set A, Set B) 
                      is a unique set of 160 questions. Set A and Set B for each exam type contain different questions.
                    </p>
                    <p>
                      This allows you to practice with multiple full-length exams, giving you comprehensive 
                      coverage of the material and more realistic exam simulation.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-10" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  How long do I have access to purchased exams?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Once you purchase an exam, you have permanent access to it through your account. You can 
                      access your purchased exams at any time, from any device, as long as you have an active account.
                    </p>
                    <p>
                      However, each purchased exam has a limit of 2 attempts. After completing both attempts, 
                      you can review your results and answers, but cannot take the exam again unless you make 
                      another purchase.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-11" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  Do you need to secure articling before writing the exams?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      No — you can sit the licensing exams before you have secured articles. Passing the exams is one of the requirements for licensing, but you don&apos;t need articles completed first.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center bg-primaryCard border border-borderBg rounded-lg p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-primaryText mb-3">
              Still have questions?
            </h3>
            <p className="text-primaryText opacity-80 mb-4">
              Can&apos;t find the answer you&apos;re looking for? Please reach out to our friendly support team.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-primaryColor text-white font-semibold rounded-md hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FaqPage;