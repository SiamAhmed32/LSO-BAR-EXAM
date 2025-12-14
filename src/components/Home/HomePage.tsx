import React from "react";
import { Hero } from "./Hero";
import { Layout } from "../Layout";
import WhoPage from "./WhoWeAre/WhoPage";
import BarExamTutoringPage from "./BarExamTutoring/BarExamTutoringPage";
import FreePractice from "./FreePractices/FreePractice";

type Props = {};

const HomePage = (props: Props) => {
  return (
    <>
      <Hero />
      <WhoPage />
      <BarExamTutoringPage />
      <FreePractice/>
    </>
  );
};

export default HomePage;
