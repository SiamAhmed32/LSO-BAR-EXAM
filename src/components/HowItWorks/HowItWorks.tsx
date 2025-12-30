'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Container from '@/components/shared/Container';
import SectionHeading from '@/components/shared/SectionHeading';
import { FileText, Clock, Trophy, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface HowItWorksProps {
  isFullPage?: boolean;
}

const steps = [
  {
    title: 'Choose Your Exam',
    desc: 'Select from Barrister or Solicitor exams, with free sample exams or comprehensive paid practice sets.',
    icon: FileText,
    color: 'bg-primaryColor',
    delay: 0,
  },
  {
    title: 'Practice & Learn',
    desc: 'Answer questions at your own pace. Review detailed explanations and track your progress as you prepare.',
    icon: Clock,
    color: 'bg-secColor',
    delay: 0.2,
  },
  {
    title: 'Track Your Progress',
    desc: 'Monitor your performance, identify areas for improvement, and build confidence for the actual exam.',
    icon: Trophy,
    color: 'bg-primaryColor',
    delay: 0.4,
  },
];

const HowItWorks: React.FC<HowItWorksProps> = ({ isFullPage = false }) => {
  return (
    <section className={`${isFullPage ? 'py-24 lg:py-32' : 'py-12 sm:py-16 md:py-20 lg:py-24'} bg-primaryBg`}>
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
              How It Works
            </SectionHeading>
            <p className="text-base sm:text-lg md:text-xl text-primaryText/80 max-w-3xl mx-auto leading-relaxed">
              {isFullPage
                ? 'Get started with our comprehensive exam preparation platform in three simple steps'
                : 'Prepare for your LSO Bar Exam with our structured approach'}
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: step.delay,
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                  }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="p-6 sm:p-8 bg-primaryCard rounded-lg shadow-sm border border-borderBg hover:shadow-md transition-all duration-300"
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 ${step.color} text-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6`}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-semibold text-primaryText mb-3 sm:mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-primaryText/70 text-sm sm:text-base leading-relaxed text-center">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button */}
          {!isFullPage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-primaryColor text-white font-semibold rounded-md shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 text-base sm:text-lg md:text-xl"
              >
                View More
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          )}

          {/* Full Page Additional Content */}
          {isFullPage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-16 sm:mt-20 md:mt-24"
            >
              <div className="bg-primaryCard rounded-lg shadow-md p-8 sm:p-10 md:p-12 border border-borderBg">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primaryText mb-6 sm:mb-8 text-center">
                  Ready to Start Your Exam Preparation?
                </h3>
                <p className="text-primaryText/70 text-base sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto text-center leading-relaxed">
                  Begin your journey to passing the LSO Bar Exam today. Choose from our free sample exams or
                  comprehensive paid practice sets to get started.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/practice"
                    className="inline-flex items-center gap-2 px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-primaryColor text-white font-semibold rounded-md shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 text-base sm:text-lg"
                  >
                    Start Practicing
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/tutoring"
                    className="inline-flex items-center gap-2 px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-secColor text-primaryText font-semibold rounded-md shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-200 text-base sm:text-lg"
                  >
                    Learn About Tutoring
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default HowItWorks;

