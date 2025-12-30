'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/shared/Container';
import SectionHeading from '@/components/shared/SectionHeading';
import { HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Top 3 FAQs for homepage - Most important questions for new users
// Only includes features that are currently implemented in the project
const topFaqs = [
  {
    id: 'faq-1',
    question: 'How do I access the exams after I purchase them?',
    answer: `Log in to your account and navigate to "My Account". All purchased exams will be available in your dashboard immediately after purchase. You can access them from any device.`,
    icon: CheckCircle2,
    bgGradient: 'from-secColor/5 to-primaryCard',
    iconBg: 'bg-secColor/20',
  },
  {
    id: 'faq-2',
    question: 'How many attempts do I have for the purchased exams?',
    answer: `Each purchased exam allows for two (2) attempts only. This simulates the real exam environment. Free mini exams have unlimited attempts for practice.`,
    icon: CheckCircle2,
    bgGradient: 'from-primaryColor/5 to-primaryCard',
    iconBg: 'bg-primaryColor/20',
  },
  {
    id: 'faq-3',
    question: 'What features does the LSO Bar Exam testing platform have?',
    answer: `Our platform includes timed exams (4.5 hours), automatic answer saving, detailed explanations, and comprehensive answer review. You can pause and resume exams, and track your progress.`,
    icon: CheckCircle2,
    bgGradient: 'from-secColor/8 to-primaryCard',
    iconBg: 'bg-secColor/25',
  },
];

const FaqPreview = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-primaryBg">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <SectionHeading className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6">
              Frequently Asked Questions
            </SectionHeading>
            <p className="text-base sm:text-lg md:text-xl text-primaryText/80 max-w-3xl mx-auto leading-relaxed">
              Find quick answers to common questions about our bar exam preparation platform
            </p>
          </motion.div>

          {/* FAQ Grid: 2 columns on tablet/desktop, 1 column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* First 3 FAQ Items - All Expanded */}
            {topFaqs.map((faq, index) => {
              const Icon = faq.icon;
              return (
                <motion.div
                  key={`faq-preview-${faq.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.15,
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  className={`bg-gradient-to-br ${faq.bgGradient} border border-borderBg rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8 relative overflow-hidden`}
                >
                  {/* Decorative accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 ${faq.iconBg} rounded-full -mr-16 -mt-16 opacity-50`}></div>
                  
                  {/* Question Header */}
                  <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${faq.iconBg} rounded-full flex items-center justify-center flex-shrink-0 border-2 border-secColor/30`}>
                      <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primaryColor" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-primaryText flex-1 leading-tight">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Answer - Always Visible */}
                  <div className="pl-0 sm:pl-14 sm:pl-16 relative z-10">
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-secColor flex-shrink-0 mt-0.5" />
                      <p className="text-primaryText/80 text-sm sm:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* 4th Card - View All FAQs Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.45,
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-secColor/10 via-secColor/5 to-primaryCard border-2 border-secColor/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-secColor/15 rounded-full -ml-20 -mt-20"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-primaryColor/10 rounded-full -mr-16 -mb-16"></div>
              
              <Link
                href="/faq"
                className="flex flex-col items-center justify-center h-full p-6 sm:p-8 min-h-[200px] sm:min-h-[220px] group relative z-10"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-secColor/25 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-secColor/35 transition-colors border-2 border-secColor/40">
                  <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-primaryColor" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-primaryText mb-3 sm:mb-4 text-center">
                  View All FAQs
                </h3>
                <div className="inline-flex items-center gap-2 text-primaryColor font-semibold group-hover:gap-3 transition-all">
                  <span>Explore More</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FaqPreview;
