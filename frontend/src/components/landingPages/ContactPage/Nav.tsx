import { useState,useEffect } from "react";
import TalentCloudLogoImg from "@/assets/JobPortal/Vector (3).svg";
import { Link } from "react-router-dom";

import { HashLink } from 'react-router-hash-link';

import CommonButton from "../commonBtn/button";
import { Button } from "@/components/ui/button";
const Nav = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
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
            <ul className=" gap-[48px] hidden md:flex">
              <li>
                <HashLink smooth to="#why-us"  className="hover:text-[#0389FF] transition-colors duration-300">Why us</HashLink>
              </li>
              <li>
                 <HashLink smooth to="#what-you-get"  className="hover:text-[#0389FF] transition-colors duration-300">What You Get</HashLink>
              </li>
              <li>
                 <HashLink smooth to="#find-jobs"  className="hover:text-[#0389FF] transition-colors duration-300">Find Jobs</HashLink>
              </li>
            </ul>
            <Link target="_blank" to={'/emp/lp'} className="text-[#0481EF] hidden md:flex">For Employee</Link>
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
                            <li><HashLink smooth to="#why-us"  className="hover:text-[#0389FF] transition-colors duration-300">Why us</HashLink></li>
                            <li> <HashLink smooth to="#what-you-get"  className="hover:text-[#0389FF] transition-colors duration-300">What You Get</HashLink></li>
                            <li><HashLink smooth to="#find-jobs"  className="hover:text-[#0389FF] transition-colors duration-300">Find Jobs</HashLink></li>
                            <li><Link target="_blank"  to={'/emp/lp'}  className="text-[#0389FF] ">For Employee</Link></li>
                          </ul>
  <Link to='/emp/lp' target="_blank">
                          <Button className="relative bg-[#0481EF] text-white rounded-[30px] p-[10px] w-[120px] h-[45px] border-2 border-[#0481EF] overflow-hidden group">
                            <span className="block text-[16px] text-white font-[400] leading-[18px] relative z-10 translate-y-0 group-hover:-translate-y-[38px] transition-transform duration-300">
                              Get Started
                            </span>
                            <span className="block text-[16px] text-[#fff] font-[400] leading-[18px] absolute top-full left-0 w-full z-0 group-hover:-translate-y-[30px] transition-transform duration-300">
                              Get Started
                            </span>
                </Button>
                </Link>
            </div>
          </nav>
        </div>
  )
}

export default Nav