"use client";

import React from "react";
import Container from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared";

const TermsAndConditionsPage = () => {
  return (
    <section className="py-24 bg-primaryBg">
      <Container>
        <div className="max-w-4xl mx-auto">
          <SectionHeading className="text-center mb-8 sm:mb-10 md:mb-12">
            Terms and Conditions
          </SectionHeading>

          <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
            <div className="text-sm text-primaryText/70 mb-6">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  By accessing and using LSO Bar Exam's website and services, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  2. Use of Services
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      2.1 Eligibility
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      You must be at least 18 years old and have the legal capacity to enter into these Terms. By using our services, you represent and warrant that you meet these requirements.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      2.2 Account Registration
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  3. Paid Products and Services
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      3.1 Access Duration
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      All paid products are accessible for 90 days from the date of purchase. After this period, access will expire and cannot be extended without a new purchase.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      3.2 Attempt Limits
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      Paid exam materials can be attempted a maximum of two (2) times. Once you have completed two attempts, you will no longer be able to access the exam questions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      3.3 Payment Terms
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      All fees are payable in advance. We reserve the right to change our pricing at any time, but price changes will not affect purchases already completed.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  4. Intellectual Property
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed mb-3">
                  All content on our website, including but not limited to text, graphics, logos, images, and software, is the property of LSO Bar Exam and is protected by copyright and other intellectual property laws. You may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-primaryText/80 ml-4">
                  <li>Reproduce, distribute, or create derivative works from our content</li>
                  <li>Share your account credentials with others</li>
                  <li>Copy or download exam questions for unauthorized distribution</li>
                  <li>Use our content for commercial purposes without permission</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  5. Prohibited Conduct
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed mb-3">
                  You agree not to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-primaryText/80 ml-4">
                  <li>Use our services for any illegal purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the operation of our website</li>
                  <li>Share or distribute exam questions or answers</li>
                  <li>Use automated systems to access our services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  6. Refund Policy
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  Due to the digital nature of our products, all sales are final. Refunds may be considered on a case-by-case basis for technical issues that prevent access to purchased materials. Please contact our support team for assistance.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  7. Disclaimer of Warranties
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, error-free, or completely secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  8. Limitation of Liability
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  To the maximum extent permitted by law, LSO Bar Exam shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  9. Termination
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  10. Changes to Terms
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our website. Your continued use of our services after such changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  11. Governing Law
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of Ontario, Canada, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  12. Contact Information
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us at:
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

export default TermsAndConditionsPage;

