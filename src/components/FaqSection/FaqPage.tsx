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
    <section className="py-24  lg:py-24 bg-primaryBg">
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
                  Can I have access to the exams for more than 90 days?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Standard access to purchased exams is 90 days from the date of purchase. 
                      If you need extended access, we offer extension packages.
                    </p>
                    <p>
                      Contact us through our contact page to discuss extension options and pricing. 
                      We understand that exam preparation timelines can vary, and we&apos;re here to help.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refund-3" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
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
              <AccordionItem value="general-1" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  How do I access the exams after I purchase them?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      After completing your purchase, you&apos;ll receive an email confirmation with access instructions. 
                      Log in to your account and navigate to the &quot;My Exams&quot; section.
                    </p>
                    <p>
                      All purchased exams will be available in your dashboard immediately after purchase. 
                      You can access them from any device with internet connectivity.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-2" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  How long do I have access to the exams after I purchase them?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Standard access is 90 days from the date of purchase. During this period, 
                      you can take the exams, review answers, and access explanations as many times as needed.
                    </p>
                    <p>
                      The 90-day period gives you ample time to prepare, practice, and review the material 
                      thoroughly before your actual bar exam.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-3" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  How many attempts do I have for the purchased exams?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Each purchased exam (Barrister Exam Set A, Set B, Solicitor Exam Set A, Set B) 
                      allows for two (2) attempts only. This simulates the real exam environment and helps 
                      you practice under realistic conditions.
                    </p>
                    <p>
                      The free mini exams have unlimited attempts, allowing you to practice as much as needed 
                      before purchasing the full exam sets.
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
                      This review feature is available for the duration of your 90-day access period, 
                      allowing you to study and learn from your mistakes.
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
                  Which Professional Responsibility set is more applicable to the Barrister or Solicitor exam?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Professional Responsibility questions are relevant to both Barrister and Solicitor exams, 
                      as ethical conduct is fundamental to both practice areas.
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

              <AccordionItem value="general-9" className="border border-borderBg rounded-lg mb-3 bg-primaryCard">
                <AccordionTrigger className="px-4 sm:px-6 py-4 text-left font-semibold text-primaryText hover:text-primaryColor bg-secColor/10 hover:bg-secColor/20 transition-colors">
                  What features does the LSO Bar Exam testing platform have?
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-6 pb-4 text-primaryText">
                  <div className="flex flex-col gap-3">
                    <p>
                      Our platform includes timed exams (4.5 hours for full exams), automatic answer saving, 
                      detailed explanations for each question, and comprehensive answer review after completion.
                    </p>
                    <p>
                      Additional features include progress tracking, the ability to pause and resume exams, 
                      and access to all questions aligned with the 2025-2026 LSO Barrister and Solicitor indexing materials.
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