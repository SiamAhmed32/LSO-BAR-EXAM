"use client";

import React from "react";
import Container from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared";

const CookiePolicyPage = () => {
  return (
    <section className="py-24 bg-primaryBg">
      <Container>
        <div className="max-w-4xl mx-auto">
          <SectionHeading className="text-center mb-8 sm:mb-10 md:mb-12">
            Cookie Policy
          </SectionHeading>

          <div className="bg-primaryCard border border-borderBg rounded-lg shadow-sm p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
            <div className="text-sm text-primaryText/70 mb-6">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>

            <div className="space-y-6">
              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  1. What Are Cookies?
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners. Cookies allow a website to recognize your device and store some information about your preferences or past actions.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  2. How We Use Cookies
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed mb-3">
                  LSO Bar Exam uses cookies for the following purposes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-primaryText/80 ml-4">
                  <li>To enable essential website functionality</li>
                  <li>To remember your login status and preferences</li>
                  <li>To maintain your shopping cart contents</li>
                  <li>To analyze website traffic and usage patterns</li>
                  <li>To improve our website's performance and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  3. Types of Cookies We Use
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      3.1 Essential Cookies
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies as they are essential for the website to work.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      3.2 Functional Cookies
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      These cookies allow the website to remember choices you make (such as your username, language, or region) and provide enhanced, personalized features. They may also be used to provide services you have requested.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      3.3 Analytics Cookies
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the way our website works.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      3.4 Session Cookies
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      These cookies are temporary and are deleted when you close your browser. They are used to maintain your session while you navigate through our website.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      3.5 Persistent Cookies
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      These cookies remain on your device for a set period or until you delete them. They are used to remember your preferences and actions across multiple visits to our website.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  4. Third-Party Cookies
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver advertisements, and provide other services. These third parties may use cookies to collect information about your online activities across different websites.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  5. Managing Cookies
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      5.1 Browser Settings
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed mb-2">
                      Most web browsers allow you to control cookies through their settings preferences. You can set your browser to refuse cookies or delete certain cookies. However, if you choose to disable cookies, some features of our website may not function properly.
                    </p>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      Instructions for managing cookies in popular browsers:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-primaryText/80 ml-4 mt-2">
                      <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                      <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                      <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                      <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primaryText mb-2">
                      5.2 Opt-Out Options
                    </h3>
                    <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                      You can opt out of certain third-party cookies by visiting the Network Advertising Initiative opt-out page or the Digital Advertising Alliance opt-out page. However, this will not prevent cookies from being set; it will only prevent targeted advertising.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  6. Impact of Disabling Cookies
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed mb-3">
                  If you choose to disable cookies, some features of our website may not be available or may not function correctly. This may include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-primaryText/80 ml-4">
                  <li>Inability to stay logged into your account</li>
                  <li>Loss of shopping cart contents</li>
                  <li>Need to re-enter preferences on each visit</li>
                  <li>Reduced website functionality and personalization</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  7. Updates to This Cookie Policy
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl sm:text-2xl font-bold text-primaryText mb-4">
                  8. Contact Us
                </h2>
                <p className="text-sm sm:text-base text-primaryText/80 leading-relaxed">
                  If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
                </p>
                <div className="mt-4 space-y-2 text-sm sm:text-base text-primaryText/80">
                  <p>Email: <a href="mailto:lsobarexamteam@gmail.com" className="text-primaryColor hover:underline">lsobarexamteam@gmail.com</a></p>
                  <p>Phone: <a href="tel:+14169919912" className="text-primaryColor hover:underline">(416) 991-9912</a></p>
                  <p>Location: Ontario, Canada</p>
                  </div>
              </section>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CookiePolicyPage;

