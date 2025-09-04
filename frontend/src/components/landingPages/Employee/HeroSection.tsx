import { useState,useEffect} from "react";
import TalentCloudLogoImg from "@/assets/JobPortal/Vector (3).svg";
import { Link } from "react-router-dom";
import HeroImg from "@/assets/Employee/Frame 36555.png";
import bgImage from "@/assets/Employee/Frame 1618873013.png";
import { HashLink } from 'react-router-hash-link';
import { motion } from "framer-motion";

import './HeroSection.css'
import CommonButton from "../commonBtn/button";
import { Button } from "@/components/ui/button";
import { useLocation } from 'react-router-dom';

const HeroSection = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const location = useLocation();

  const linkClass = (hash: string) =>
    `transition-colors duration-300 hover:text-[#0389FF] ${
      location.hash === hash ? "text-[#0389FF]" : ""
    }`;
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // scrolling down → hide
        setShowNavbar(false);
      } else {
        // scrolling up → show
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
  return (
    <div onClick={() => setNavIsOpen(!navIsOpen)}>
        <div
          className={`fixed top-0 left-0 right-0 m-auto z-[10000] bg-white shadow-[0_1px_3px_0_#A6AFC366] max-w-[1240px] mx-auto md:rounded-[25px] mt-0 md:mt-[22px]
          transition-transform duration-500 ${showNavbar ? "translate-y-0" : "-translate-y-[120%]"}`}
        >
        <nav className="max-w-[1240px] mx-auto flex justify-between items-center  relative z-10 md:px-5 md:py-6 py-[15px] px-[27px]">
          {/* logo SVG here */}
          <img
            src={TalentCloudLogoImg}
            alt=""
            className="w-[185px] md:w-[214px] h-[40px] md:h-[60px] object-cover"
          />

           <ul className="gap-[48px] hidden md:flex">
          <li>
            <HashLink smooth to="#why-us" className={linkClass("#why-us")}>
              Why us
            </HashLink>
          </li>
          <li>
            <HashLink smooth to="#what-you-get" className={linkClass("#what-you-get")}>
              What You Get
            </HashLink>
          </li>
          <li>
            <HashLink smooth to="#find-jobs" className={linkClass("#find-jobs")}>
              Find Jobs
            </HashLink>
            </li>
            </ul>
          <Link target="_blank" to={'/emp/lp'} className="text-[#6e6e6e90] hidden md:flex ">For Employee</Link>
          <div className=" hidden md:flex">
          <CommonButton title="Contact us" url='/contact-us'/>
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


          <div className={`flex md:hidden flex-col items-center bg-[#fff] shadow-[0_1px_3px_0_#A6AFC366]  rounded-bl-[20px] fixed z-[100] w-[60%] right-0 top-0 py-[24px] gap-6 overflow-hidden
                          transition-all duration-500 
                          ${navIsOpen ? "max-h-screen mt-[70px] animate-bouncy-drop " : "max-h-0 mt-0 animate-bouncy-close "}
                        `}>


                        <ul className="flex flex-col gap-[24px] transition-opacity duration-300 delay-200">
                          <li><HashLink smooth to="#why-us" className={linkClass("#why-us")}>Why us</HashLink></li>
                          <li> <HashLink smooth to="#what-you-get"  className={linkClass("#what-you-get")}>What You Get</HashLink></li>
                          <li><HashLink smooth to="#find-jobs" className={linkClass("#find-jobs")}>Find Jobs</HashLink></li>
                          <li><Link target="_blank"  to={'/emp/lp'}  className="text-[#6e6e6e90] ">For Employee</Link></li>
                        </ul>
<Link to='/contact-us' target="_blank">
                        <Button className="relative bg-[#0481EF] text-white rounded-[30px] p-[10px] w-[120px] h-[45px] border-2 border-[#0481EF] overflow-hidden group">
                          <span className="block text-[16px] text-white font-[400] leading-[18px] relative z-10 translate-y-0 group-hover:-translate-y-[38px] transition-transform duration-300">
                           Contact us
                          </span>
                          <span className="block text-[16px] text-[#fff] font-[400] leading-[18px] absolute top-full left-0 w-full z-0 group-hover:-translate-y-[30px] transition-transform duration-300">
                           Contact us
                          </span>
              </Button>
              </Link>
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
         <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-center gap-[48px] pl-6 pr-6">
      
          {/* Left side - text */}
          <motion.div
            className="max-w-[641px] flex flex-col justify-center items-start gap-6 md:gap-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-[24px] md:text-[46px] font-[600] leading-[34.8px] md:leading-[66.7px] uppercase text-black">
              Your Next Big <br /> Opportunity{" "}
              <Link to="/auth/login" >
                <span className="text-[#0481EF]"> Starts Here</span>
              </Link>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="md:max-w-[532px] text-[#575757] text-[12px] md:text-[16px] font-[500] leading-[22.8px] md:leading-[30.4px]"
            >
              Build your career with top international tech teams. We connect
              talented professionals like you with real jobs, fair pay, and full
              support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <CommonButton title="Explore Jobs" url="/auth/login" />
            </motion.div>
          </motion.div>

          {/* Right side - image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className=""
          >
            <img src={HeroImg} alt="" className="w-full max-w-[485px]" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[50px] md:gap-8 max-w-[1240px] mx-auto pt-[50px] pb-[48px] md:pt-[200px] md:pb-[145px] pl-[45px] pr-[24px]">
           <motion.div
            className="flex flex-col gap-2 front-line max-w-full md:max-w-[330px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h1 className="text-[16px] md:text-[24px] font-[600] leading-[25px] md:leading-[28px]">
              Talent Cloud, powered by Next Innovations Ltd.
            </h1>
            <p className="text-[#484747] text-[12px] md:text-[16px] font-[500] leading-[19px] md:leading-[15x]">
              Your gateway to international tech careers—no visa or overseas legal
              hassles, all from Myanmar.
            </p>
          </motion.div>
           <motion.div
            className="flex flex-col gap-2 front-line max-w-full md:max-w-[330px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h1 className="text-[16px] md:text-[24px] font-[600] leading-[25px] md:leading-[28px]">
              Built for Myanmar Professionals
            </h1>
            <p className="text-[#484747] text-[12px] md:text-[16px] font-[500] leading-[19px] md:leading-[15x]">
              We help career development for talented developers and designers like
              you access real global projects with full local support.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col gap-2 front-line max-w-full md:max-w-[330px]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-[16px] md:text-[24px] font-[600] leading-[25px] md:leading-[28px]">
              Work Globally, Supported Locally
            </h1>
            <p className="text-[#484747] text-[12px] md:text-[16px] font-[500] leading-[19px] md:leading-[15x]">
              We support local, payroll up to 2,500,000MMK, project management and
              language while you work with confidence.
            </p>
          </motion.div>
        </div>
      </div>

 
    </div>
  );
};

export default HeroSection;
