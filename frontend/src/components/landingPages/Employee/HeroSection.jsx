import React from "react";
import { useState } from "react";
import TalentCloudLogoImg from "@/assets/JobPortal/Vector (3).svg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeroImg from "@/assets/Employee/Frame 36555.png";
import bgImage from "@/assets/Employee/Frame 1618873013.png";
import CommonButton from "../commonBtn/button";
import { useNavigate } from "react-router-dom";

import './HeroSection.css'
const HeroSection = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <div className="fixed  top-0 left-0 right-0  m-auto z-[10000] bg-white shadow-[0_1px_3px_0_#A6AFC366] max-w-[1240px] mx-auto md:rounded-[25px] mt-0 md:mt-[22px]">
        <nav className="max-w-[1240px] mx-auto flex justify-between items-center pt-[20px] pb-[20px] relative z-10 pr-5 pl-5 ">
          {/* logo SVG here */}
          <img
            src={TalentCloudLogoImg}
            alt=""
            className="w-[118px] md:w-[198px]"
          />
          <ul className=" gap-[48px] hidden md:flex">
            <li>
              <Link to="">Why us</Link>
            </li>
            <li>
              <Link to="">What You Get</Link>
            </li>
            <li>
              <Link to="">Find Jobs</Link>
            </li>
          </ul>
          <Link to={'/emp/lp'} className="text-[#0481EF] hidden md:flex">For Employee</Link>
          <div className=" hidden md:flex">
          <CommonButton title="Get Started" smallIcon="16" />
          </div>
         
          {/* responsive toggle */}
          <div
            className="flex md:hidden flex-col gap-[3px] justify-center items-center cursor-pointer w-[25px] h-[25px]"
            onClick={() => setNavIsOpen(!navIsOpen)}
          >
            {/* Top bar */}
            <div
              className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${
                navIsOpen ? "rotate-45 translate-y-[4px]" : ""
              }`}
            ></div>

            {/* Middle bar */}
            <div
              className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${
                navIsOpen ? "opacity-0" : ""
              }`}
            ></div>

            {/* Bottom bar */}
            <div
              className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${
                navIsOpen ? "-rotate-45 -translate-y-[8px]" : ""
              }`}
            ></div>
          </div>
        </nav>
      </div>

      <div
        className="w-full pt-[107px] md:pt-[220px]"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        
        }}
      >
        <div className=" max-w-[1240px]  mx-auto flex flex-col md:flex-row justify-between items-center gap-[48px] pl-6 pr-6">
          <div className="max-w-[641px] flex flex-col justify-center items-start gap-6 md:gap-8">
            <h1 className="text-[24px] md:text-[46px] font-[600] leading-[34.8px ] md:leading-[66.7px] uppercase text-black">
              Your Next Big <br></br> Opportunity
              <span className="text-[#0481EF]"> Starts Here</span>
            </h1>
            <p className="md:max-w-[532px] text-[#575757] text-[12px] md:text-[16px] font-[500] leading-[22.8px] md:leading-[30.4px]">
              Build your career with top international tech teams. We connect
              talented professionals like you with real jobs, fair pay, and full
              support.
            </p>
            <CommonButton />
          </div>
          <div className="">
            <img src={HeroImg} alt="" className="w-full max-w-[485px]"/>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1240px] mx-auto pt-[50px] pb-[48px] md:pt-[200px] md:pb-[145px] pl-[45px] pr-[24px]">
          <div className="flex flex-col gap-2 front-line  max-w-full md:max-w-[330px]">
            <h1 className="text-[24px] font-[600] leading-[38.4px ]">
              Talent Cloud, powered by Next Innovations. Ltd,
            </h1>
            <p className="text-[#484747] text-[16px] font-[500] leading-[25.6px ]">
              Your gateway to international tech careers—no visa or overseas legal
              hassles, all from Myanmar.
            </p>
          </div>
          <div className="flex flex-col gap-2 front-line  max-w-full md:max-w-[330px]">
            <h1 className="text-[24px] font-[600] leading-[38.4px ]">
            Built for Myanmar Professionals
            </h1>
            <p className="text-[#484747] text-[16px] font-[500] leading-[25.6px ]">
            We help career development for talented developers and designers like you access real global projects with full local support.
            </p>
          </div>
          <div className="flex flex-col gap-2 front-line  max-w-full md:max-w-[330px]">
            <h1 className="text-[24px] font-[600] leading-[38.4px ]">
            Work Globally, Supported Locally
            </h1>
            <p className="text-[#484747] text-[16px] font-[500] leading-[25.6px ]">
            We support local , payroll up to 2,500,000MMK , project management and language while you work with confidence.
            </p>
          </div>
        </div>
      </div>

 
    </div>
  );
};

export default HeroSection;
