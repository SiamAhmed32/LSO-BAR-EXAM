"use client";

import React from "react";
import Container from "../shared/Container";
import AccountSidebar from "./AccountSidebar";
import AccountDetails from "./AccountDetails";

type Props = {};

const UserAccPage = (props: Props) => {
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
          </div>
        </div>
      </Container>
    </section>
  );
};

export default UserAccPage;