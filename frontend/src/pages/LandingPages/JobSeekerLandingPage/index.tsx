import HeroSection from "@/components/landingPages/HeroSection";
import ReasonToChoose from "@/components/landingPages/ReasonToChoose";
import SeeMore from "@/components/landingPages/SeeMore";
import React from "react";

import './index.css';
import EorSection from "@/components/landingPages/EorSection";
import SuccessStory from "@/components/landingPages/SuccessStory";
import FAQ from "@/components/landingPages/FAQ";
const JobSeekerLandingPage = () => {
  
  return (
    <div className="bg-[#F7F7F7] overflow-x-hidden">
      <HeroSection/>
      <ReasonToChoose />
      <SeeMore />
      <EorSection />

      <SuccessStory />
      <FAQ/>
</div>
  );
};

export default JobSeekerLandingPage;
