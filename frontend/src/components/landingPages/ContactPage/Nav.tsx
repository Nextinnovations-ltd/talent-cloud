 import { useState,useEffect } from "react";
import TalentCloudLogoImg from "@/assets/JobPortal/Vector (3).svg";
import { Link } from "react-router-dom";

import { HashLink } from 'react-router-hash-link';

import CommonButton from "../commonBtn/button";
import { Button } from "@/components/ui/button";
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { motion,AnimatePresence} from "framer-motion";
const Nav = () => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
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




  const location = useLocation();

  const linkClass = (hash: string) =>
    `transition-colors duration-300 hover:text-[#0389FF] ${
      location.hash === hash ? "text-[#0389FF]" : ""
    }`;
   const queryParams = new URLSearchParams(location.search);
  const path = queryParams.get("path");

  
  return (
          <div>
      
      {path === "jp" ? (
       
      <AnimatePresence>
        {showNavbar && (
          <motion.div
             initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.6, ease: "linear" }}
            className="fixed top-0 left-0 right-0 m-auto z-[10000] max-w-[1240px] mx-auto md:rounded-[25px] mt-0 md:mt-[22px] bg-white shadow-[0_1px_3px_0_#A6AFC366]"
       >
            <nav className="max-w-[1240px] mx-auto flex justify-between items-center relative z-10 md:px-5 md:py-6 py-[15px] px-[27px]">
              {/* Logo */}
              <motion.img
                src={TalentCloudLogoImg}
                alt="Talent Cloud Logo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-[185px] md:w-[214px] h-[40px] md:h-[60px] object-cover"
              />

              {/* Nav Links + Buttons */}
              <motion.ul
                className="hidden md:flex items-center gap-[48px]"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
                  },
                }}
              >
                {/* Nav Links */}
                {[
                  { to: "/tc/lp#why-us", label: "Why us" },
                  { to: "/tc/lp#about-us", label: "About us" },
                  { to: "/tc/lp#faq", label: "FAQ" },
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                    }}
                  >
                    <HashLink smooth to={item.to} className={linkClass(item.to)}>
                      {item.label}
                    </HashLink>
                  </motion.li>
                ))}

                {/* Sign Up Button */}
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                  }}
                >
                  <a
                    href="/auth/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center relative border-2 border-[#0481EF] text-[#0481EF] rounded-[30px] p-[10px] w-[141px] h-[64px] hover:bg-[#0481EF] hover:text-white transition-all duration-300"
                  >
                    <span className="text-[16px] font-[500] leading-[28px]">Sign up</span>
                  </a>
                </motion.li>

                {/* Contact Us Button */}
                <motion.li
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                  }}
                >
                  <CommonButton title="Contact us" url="/contact-us" path="jp" />
                </motion.li>
              </motion.ul>

              {/* Mobile Toggle */}
              <div
                className="flex md:hidden flex-col gap-[3px] justify-center items-center cursor-pointer w-[25px] h-[25px]"
                onClick={() => setNavIsOpen(!navIsOpen)}
              >
                <div
                  className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${
                    navIsOpen ? "rotate-45 translate-y-[4px]" : ""
                  }`}
                ></div>
                <div
                  className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${
                    navIsOpen ? "opacity-0" : ""
                  }`}
                ></div>
                <div
                  className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${
                    navIsOpen ? "-rotate-45 -translate-y-[8px]" : ""
                  }`}
                ></div>
              </div>
                </nav>
            <div className={`flex md:hidden flex-col items-center shadow-[0_1px_3px_0_#A6AFC366] bg-white rounded-bl-[20px] fixed z-[100] w-[60%] right-0 top-0 py-[24px] gap-6 overflow-hidden
                                transition-all duration-500 
                                ${navIsOpen ? "max-h-screen mt-[70px] animate-bouncy-drop " : "max-h-0 mt-0 animate-bouncy-close "}
                              `}>


              <ul className="flex flex-col gap-[24px] transition-opacity duration-300 delay-200">
                <li >  <HashLink smooth to="/tc/lp#why-us" className={linkClass("#why-us")}>Why us</HashLink></li>
                <li>  <HashLink smooth to="/tc/lp#about-us" className={linkClass("#about-us")}>About us</HashLink></li>
                <li><HashLink smooth to="/tc/lp#faq" className={linkClass("#faq")}>FAQ</HashLink></li>
              </ul>

              <Button onClick={() => navigate('/auth/login')}   className="relative bg-[#fff] text-[#0481EF] rounded-[30px] p-[10px] w-[120px] h-[45px] border-2 border-[#0481EF] overflow-hidden group hover:bg-[#0481EF] hover:text-white transition-all duration-300">
                <span className="">
                  Sign up
                </span>
         
              </Button>
              <Button onClick={() => navigate('/contact-us?path=jp')}   className="relative bg-[#0481EF] text-white rounded-[30px] p-[10px] w-[120px] h-[45px] border-2 border-[#0481EF] overflow-hidden group">
              <span className="block text-[16px] text-white font-[400] leading-[18px] relative z-10 translate-y-0 group-hover:-translate-y-[38px] transition-transform duration-300">
              Contact us
              </span>
              <span className="block text-[16px] text-[#fff] font-[400] leading-[18px] absolute top-full left-0 w-full z-0 group-hover:-translate-y-[32px] transition-transform duration-300">
                Contact us
              </span>
              </Button>
          
            </div>
          </motion.div>
        )}
      </AnimatePresence>

       
      ) : (
   
    

      <AnimatePresence>
        {showNavbar && (
          <motion.div
             initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.6, ease: "linear" }}
            className="fixed top-0 left-0 right-0 m-auto z-[10000] bg-white shadow-[0_1px_3px_0_#A6AFC366] max-w-[1240px] mx-auto md:rounded-[25px] mt-0 md:mt-[22px]"
          >
            <nav className="max-w-[1240px] mx-auto flex justify-between items-center relative z-10 md:px-5 md:py-6 py-[15px] px-[27px]">
              {/* Logo */}
              <motion.img
                src={TalentCloudLogoImg}
                alt=""
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-[185px] md:w-[214px] h-[40px] md:h-[60px] object-cover"
              />

              {/* Desktop Links + Buttons with stagger animation */}
              <motion.ul
                className="hidden md:flex items-center gap-[48px]"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
                }}
              >
                {/* Nav Links */}
                <motion.li
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                  className="list-none"
                >
                  <HashLink smooth to="/emp/lp#why-us" className="hover:text-[#0389FF] transition-colors duration-300">Why us</HashLink>
                </motion.li>
                <motion.li
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                  className="list-none"
                >
                  <HashLink smooth to="/emp/lp#what-you-get" className="hover:text-[#0389FF] transition-colors duration-300">What You Get</HashLink>
                </motion.li>
                <motion.li
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                  className="list-none"
                >
                  <HashLink smooth to="/emp/lp#find-jobs" className="hover:text-[#0389FF] transition-colors duration-300">Find Jobs</HashLink>
                </motion.li>

                {/* For Employee link */}
                <motion.li
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                  className="list-none"
                >
                  <Link target="_blank" to={'/emp/lp'} className="text-[#6e6e6e90] md:flex">For Employee</Link>
                </motion.li>

                {/* Contact button */}
                <motion.li
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                  className="list-none"
                >
                  <CommonButton title="Contact us" url='/contact-us'/>
                </motion.li>
              </motion.ul>

              {/* Mobile Hamburger */}
              <div
                className="flex md:hidden flex-col gap-[3px] justify-center items-center cursor-pointer w-[25px] h-[25px]"
                onClick={() => setNavIsOpen(!navIsOpen)}
              >
                <div className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${navIsOpen ? "rotate-45 translate-y-[4px]" : ""}`}></div>
                <div className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${navIsOpen ? "opacity-0" : ""}`}></div>
                <div className={`w-[25px] h-[3px] rounded-[2px] bg-black transition-all duration-300 ${navIsOpen ? "-rotate-45 -translate-y-[8px]" : ""}`}></div>
              </div>
                  </nav>
            <div className={`flex md:hidden flex-col items-center bg-[#fff] shadow-[0_1px_3px_0_#A6AFC366]  rounded-bl-[20px] fixed z-[100] w-[60%] right-0 top-0 py-[24px] gap-6 overflow-hidden
                                      transition-all duration-500 
                                      ${navIsOpen ? "max-h-screen mt-[70px] animate-bouncy-drop " : "max-h-0 mt-0 animate-bouncy-close "}
                                    `}>


                                    <ul className="flex flex-col gap-[24px] transition-opacity duration-300 delay-200">
                                      <li><HashLink smooth to="/emp/lp#why-us"  className="hover:text-[#0389FF] transition-colors duration-300">Why us</HashLink></li>
                                      <li> <HashLink smooth to="/emp/lp#what-you-get"  className="hover:text-[#0389FF] transition-colors duration-300">What You Get</HashLink></li>
                                      <li><HashLink smooth to="/emp/lp#find-jobs"  className="hover:text-[#0389FF] transition-colors duration-300">Find Jobs</HashLink></li>
                                      <li><Link target="_blank"  to={'/emp/lp'}  className="text-[#6e6e6e90] ">For Employee</Link></li>
                                    </ul>
            <Link to='/contact-us?path=emp' >
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
          </motion.div>
        )}
      </AnimatePresence>


      
      )}
          

      

          
        </div>
  )
}

export default Nav