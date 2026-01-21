'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import Container from '@/components/shared/Container';
import SectionHeading from '@/components/shared/SectionHeading';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Dummy testimonials about exam questions
const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Barrister Candidate',
    rating: 4,
    text: 'The exam questions are incredibly well-structured and closely mirror the actual LSO Bar Exam format. The detailed explanations after each question helped me understand not just the correct answer, but why other options were incorrect. This platform was instrumental in my preparation.',
    examType: 'Barrister Exam Set A',
  },
  {
    id: 2,
    name: 'James Chen',
    role: 'Solicitor Candidate',
    rating: 5,
    text: 'I found the practice questions to be challenging yet fair. The variety of question types and the comprehensive coverage of different legal topics gave me confidence going into the actual exam. The timed practice sessions were particularly helpful.',
    examType: 'Solicitor Exam Set B',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Barrister Candidate',
    rating: 4,
    text: 'The quality of the questions exceeded my expectations. Each question tests your understanding of the law, not just memorization. The platform\'s interface is clean and easy to navigate, making study sessions productive and stress-free.',
    examType: 'Barrister Exam Set B',
  },
  {
    id: 4,
    name: 'Michael Thompson',
    role: 'Solicitor Candidate',
    rating: 5,
    text: 'What I appreciate most is how the questions are categorized by legal area. This allowed me to focus on my weaker subjects. The explanations are thorough and cite relevant case law, which is exactly what I needed for exam preparation.',
    examType: 'Solicitor Exam Set A',
  },
  {
    id: 5,
    name: 'Priya Patel',
    role: 'Barrister Candidate',
    rating: 5,
    text: 'The exam questions are realistic and the difficulty level matches the actual bar exam. I especially valued the ability to bookmark questions for review and the detailed performance tracking. This platform helped me identify and improve my weak areas.',
    examType: 'Barrister Exam Set A',
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'Solicitor Candidate',
    rating: 5,
    text: 'As someone who works full-time, the flexibility to pause and resume exams was crucial. The questions cover all the key areas I needed to review, and the explanations are clear and concise. Highly recommend for anyone preparing for the LSO Bar Exam.',
    examType: 'Solicitor Exam Set B',
  },
];

const Testimonials = () => {
  return (
    <section className="py-12 px-4 sm:px-2 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-primaryBg to-white">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Section Heading with Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16 md:mb-20 relative"
          >
            <div className="text-center">
              <SectionHeading className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6">
                What Our Students Say
              </SectionHeading>
              <p className="text-base sm:text-lg md:text-xl text-primaryText/80 max-w-3xl mx-auto leading-relaxed pr-0 sm:pr-24 md:pr-28">
                Real feedback from candidates who have used our exam preparation platform
              </p>
            </div>
            
            {/* Navigation Buttons - Centered below text on mobile, absolute top-right on larger screens */}
            <div className="flex items-center justify-center gap-2 mt-6 sm:mt-0 sm:absolute sm:top-10 md:top-20 sm:right-0">
              <button
                className="swiper-button-prev-custom w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-borderBg shadow-sm hover:shadow-md hover:bg-primaryColor hover:text-white hover:border-primaryColor transition-all duration-300 flex items-center justify-center text-primaryText group"
                aria-label="Previous testimonial"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className="swiper-button-next-custom w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border border-borderBg shadow-sm hover:shadow-md hover:bg-primaryColor hover:text-white hover:border-primaryColor transition-all duration-300 flex items-center justify-center text-primaryText group"
                aria-label="Next testimonial"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Swiper Slider */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                },
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              loop={true}
              style={{ height: 'auto' }}
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial.id} className="!h-auto">
                  <div className="bg-white border border-borderBg rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8 h-full flex flex-col relative overflow-hidden group">
                    {/* Decorative accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primaryColor/5 rounded-full -mr-16 -mt-16 opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    
                    {/* Quote icon */}
                    <div className="relative z-10 mb-4">
                      <div className="w-12 h-12 bg-primaryColor/10 rounded-full flex items-center justify-center mb-4">
                        <Quote className="w-6 h-6 text-primaryColor" />
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4 relative z-10">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-secColor text-secColor"
                        />
                      ))}
                    </div>

                    {/* Testimonial text */}
                    <p className="text-primaryText/80 text-sm sm:text-base leading-relaxed mb-6 flex-1 relative z-10">
                      "{testimonial.text}"
                    </p>

                    {/* Exam type badge */}
                    <div className="mb-4 relative z-10">
                      <span className="inline-block px-3 py-1 bg-primaryColor/10 text-primaryColor text-xs font-semibold rounded-full">
                        {testimonial.examType}
                      </span>
                    </div>

                    {/* Author info */}
                    <div className="relative z-10">
                      <h4 className="font-semibold text-primaryText text-base mb-1">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-primaryText/60">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </Container>

      <style jsx global>{`
        .swiper-wrapper {
          display: flex;
          align-items: stretch;
        }

        .swiper-slide {
          height: auto;
          display: flex;
        }

        .swiper-button-prev-custom.swiper-button-disabled,
        .swiper-button-next-custom.swiper-button-disabled {
          opacity: 0.35;
          cursor: not-allowed;
          pointer-events: auto;
        }

        @media (max-width: 640px) {
          .swiper-button-prev-custom,
          .swiper-button-next-custom {
            position: relative !important;
            margin-top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;

