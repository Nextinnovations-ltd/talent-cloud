import HeroSection from "@/components/landingPages/JobPortal/HeroSection";
import ReasonToChoose from "@/components/landingPages/JobPortal/ReasonToChoose";
import SeeMore from "@/components/landingPages/JobPortal/SeeMore";

import './index.css';
import EorSection from "@/components/landingPages/JobPortal/EorSection";
import SuccessStory from "@/components/landingPages/JobPortal/SuccessStory";
import FAQ from "@/components/landingPages/JobPortal/FAQ";
const JobSeekerLandingPage = () => {
  
  return (
    <div className="bg-[#fff] overflow-x-hidden">
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
