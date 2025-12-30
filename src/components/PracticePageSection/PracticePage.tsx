import React from "react";
import Container from "../shared/Container";
import FreePractice from "../Home/FreePractices/FreePractice";
import PaidPage from "../Home/PaidPractices/PaidPage";

type Props = {};

const PracticePage = (props: Props) => {
  return (
    <section className="py-16 lg:py-24 bg-primaryBg">
      <Container>
        {/* <h1 className="text-primaryColor  lg:ml-50 text-2xl md:text-5xl">
          Practise Questions
        </h1> */}
        {/* <div className="relative top-[-64px]">
        </div>
        <div className="relative top-[-64px]">

        </div> */}
        <PaidPage />
        <FreePractice />
      </Container>
    </section>
  );
};

export default PracticePage;
