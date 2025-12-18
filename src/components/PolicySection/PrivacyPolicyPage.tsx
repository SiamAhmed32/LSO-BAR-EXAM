"use client";

import React from "react";
import Container from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared";

const PrivacyPolicyPage = () => {
  return (
    <section className="py-24 bg-primaryBg">
      <Container>
        <div className="max-w-4xl mx-auto">
          <SectionHeading className="text-center mb-8 sm:mb-10 md:mb-12">
            Privacy Policy
          </SectionHeading>

          <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
            <div className="text-sm text-primaryText/70 mb-6">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  1. Introduction
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  LSO Bar Exam ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  2. Information We Collect
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      2.1 Personal Information
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      We may collect personal information that you voluntarily provide to us when you:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-2 text-sm sm:text-base text-primaryText/80 ml-4">
                      <li>Register for an account</li>
                      <li>Purchase exam materials or services</li>
                      <li>Contact us for support</li>
                      <li>Subscribe to our newsletter</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      2.2 Automatically Collected Information
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      We automatically collect certain information when you visit our website, including your IP address, browser type, device information, and usage patterns through cookies and similar technologies.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-primaryText/80 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send administrative information and updates</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze usage patterns</li>
                  <li>Detect, prevent, and address technical issues</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  4. Information Sharing and Disclosure
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed mb-3">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-primaryText/80 ml-4">
                  <li>With service providers who assist us in operating our website</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or merger</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  5. Data Security
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  6. Your Rights
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-primaryText/80 ml-4">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Rectify inaccurate or incomplete information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing</li>
                  <li>Data portability</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  7. Cookies
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. For more information, please see our{" "}
                  <a href="/cookie-policy" className="text-primaryColor hover:underline">
                    Cookie Policy
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  8. Children's Privacy
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  9. Changes to This Privacy Policy
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  10. Contact Us
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <div className="mt-4 space-y-2 text-sm sm:text-base text-primaryText/80">
                  <p>Email: <a href="mailto:support@lsbarexam.com" className="text-primaryColor hover:underline">support@lsbarexam.com</a></p>
                  <p>Phone: <a href="tel:+15551234567" className="text-primaryColor hover:underline">+1 (555) 123-4567</a></p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PrivacyPolicyPage;

