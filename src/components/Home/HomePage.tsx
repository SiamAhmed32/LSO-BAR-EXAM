import React from "react";
import { Hero } from "./Hero";
import { Layout } from "../Layout";
import WhoPage from "./WhoWeAre/WhoPage";
import BarExamTutoringPage from "./BarExamTutoring/BarExamTutoringPage";
import FreePractice from "./FreePractices/FreePractice";
import PaidPage from "./PaidPractices/PaidPage";
import HowItWorks from "../HowItWorks/HowItWorks";
import FaqPreview from "./FaqPreview/FaqPreview";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <>
      <Hero />
      <PaidPage />
      <BarExamTutoringPage />
      <FreePractice />
      <WhoPage />
      <HowItWorks isFullPage={false} />
      <FaqPreview />
    </>
  );
};

export default HomePage;
