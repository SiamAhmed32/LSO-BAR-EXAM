import React from 'react';
import { Layout } from '../Layout';
import { ContactForm } from './contact-form';
import SectionHeading from '../shared/SectionHeading';
import PrimarySubHeading from '../shared/PrimarySubHeading';
import Link from 'next/link';

const ContactPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 md:py-24 lg:py-32">
        <div className="max-w-2xl mx-auto">
          {/* Main Heading */}
          <div className="mb-6">
            <SectionHeading className="text-4xl md:text-5xl mb-4">
              Contact us
            </SectionHeading>
          </div>

          {/* Section Title in Primary Color */}
          {/* <div className="mb-4">
            <PrimarySubHeading className="text-primaryColor text-xl md:text-2xl font-semibold">
              Contact Us
            </PrimarySubHeading>
          </div> */}

          {/* Introductory Text */}
          <div className="mb-8">
            <p className="text-primaryText text-base md:text-lg leading-relaxed">
              Please let us know if you have any questions. Kindly note that our{' '}
              <Link 
                href="/faq" 
                className="text-primaryColor hover:underline"
              >
                FAQ page
              </Link>{' '}
              likely contains answers to many of your questions.
            </p>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;