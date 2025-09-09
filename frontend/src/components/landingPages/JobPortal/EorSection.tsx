/* eslint-disable @typescript-eslint/ban-ts-comment */
import  { useState, useEffect,useRef } from 'react';
import previousBtn from '@/assets/JobPortal/eva_arrow-ios-front-fill.svg';
import nextBtn from '@/assets/JobPortal/eva_arrow-ios-back-fill.svg';
import img1 from '@/assets/JobPortal/freepik__retouch__57107.png';
import img2 from '@/assets/JobPortal/job-interview.png';
import img3 from '@/assets/JobPortal/412655443_789a66da-83c1-4a1d-abba-e957ba626cfa.png';
import img4 from '@/assets/JobPortal/flat-lay-payroll-concept-with-document.png';
import img5 from '@/assets/JobPortal/it-developers-discussing-with-point-website-coding-system-infobahn.png';
import img6 from '@/assets/JobPortal/business-people-shaking-hands-together.png';
import { motion } from "framer-motion";

const slides = [
  {
    id: 0,
    title: "EOR Services",
    text: "We hire employees on your behalf and take full responsibility as the legal employer—managing compliance, contracts, and employment obligations in accordance with local regulations.",
    image: img1,
  },
  {
    id: 1,
    title: "HR & Admin Support",
    text: "We provide comprehensive support in time-off management, employee relations, and cultural integration to ensure a smooth and engaging experience for your remote team.",
    image: img2,
  },
  {
    id: 2,
    title: "Workplace & Assets",
    text: "From laptops to Internet, we ensure fully equipped with the tools, that employee need to perform effectively from day one.",
    image: img3,
  },
  {
    id: 3,
    title: "Payroll & Tax Compliance",
    text: "Ensure timely salary disbursement, full compliance with local tax regulations, and accurate handling of all statutory contributions for your employees.",
    image: img4,
  },
  {
    id: 4,
    title: "Talent Sourcing",
    text: "Gain access to a pre-vetted pool of skilled IT professionals who are fully equipped and ready to contribute to global teams from day one.",
    image: img5,
  },
  {
    id: 5,
    title: "Ongoing Management",
    text: "We act as your dedicated partner on the ground in Myanmar—offering responsive communication, professional support, and proactive solutions every step of the way.",
    image: img6,
  },
];

const SLIDE_DURATION = 8000; // 4 seconds


const EorSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(performance.now()); // <-- Reference to track/reset start time
  const rafIdRef = useRef<null>(null); // <-- Track animation frame ID
  useEffect(() => {
    const updateProgress = (now: number) => {
      const elapsed = now - startRef.current;
      const percent = (elapsed / SLIDE_DURATION) * 100;

      if (percent >= 100) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        setProgress(0);
        startRef.current = performance.now(); // Restart time
      } else {
        setProgress(Math.min(percent, 100));
      }

      rafIdRef.current = requestAnimationFrame(updateProgress) as unknown as null;
    };

    rafIdRef.current = requestAnimationFrame(updateProgress) as unknown as null;

     //@ts-ignore
    return () => cancelAnimationFrame(rafIdRef.current);
  }, []);

  const resetProgress = () => {
    setProgress(0);
    startRef.current = performance.now(); // <-- Reset animation start
  };

  const scrollPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    resetProgress();
  };

  const scrollNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    resetProgress();
  };



  return (

  <div className="bg-white">
    <motion.div
      className="max-w-[1271px] mx-auto pt-[38px] pb-[30px] md:pb-[71px] p-4"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Heading */}
      <motion.h1
        className="text-[16px] md:text-[32px] font-[600] leading-[14px] md:leading-[56px] text-right md:mb-[30px] mb-[38px]"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        WHAT WE OFFER?
      </motion.h1>

      {/* Progress Timeline */}
      <motion.div
        className="w-[548px] h-2 bg-[#D9D9D9] rounded-full overflow-hidden mb-[30px] hidden md:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        style={{ originX: 0 }}
      >
        <motion.div
          className="h-full bg-[#0481EF] rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        ></motion.div>
      </motion.div>

      {/* Slides */}
      <div className="flex justify-center gap-[110px]">
        <div className="w-full max-w-full relative">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            
            >
              <div className="flex gap-4 md:gap-[110px] lg:flex-row flex-col">
                {/* Text */}
                <div
                  className="max-w-[714px] flex flex-col gap-2"
                 
                >
                  <h1 className="text-[#0481EF] text-[14px] md:text-[36px] font-[600] leading-[14px] md:leading-[34px]">
                    {slide.title}
                  </h1>
                  <p className="text-[#575757] text-[12px] md:text-[20px] font-[500] leading-[26px] md:leading-[43px] h-[110px]">
                    {slide.text}
                  </p>
                </div>

                {/* Image */}
                <motion.div
                  className="flex justify-end"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  <img
                    src={slide.image}
                    className="w-[129px] h-[92px] md:w-[447px] md:h-[375px] object-cover rounded-[12px]"
                  />
                </motion.div>
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <motion.div
            className="flex gap-8 mt-[208px] md:mt-[80vh] lg:mt-[313px] relative z-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={scrollPrev}
              className="w-[32px] md:w-[62px] h-[32px] md:h-[62px] flex justify-center items-center rounded-full border border-solid hover:bg-[#F7F7F7] transition border-[#F7F7F7]"
            >
              <img
                src={previousBtn}
                alt="Previous"
                className="w-[19px] h-[19px] md:w-[30px] md:h-[30px]"
              />
            </button>
            <button
              onClick={scrollNext}
              className="w-[32px] md:w-[62px] h-[32px] md:h-[62px] flex justify-center items-center rounded-full border hover:bg-[#F7F7F7] transition border-[#F7F7F7]"
            >
              <img
                src={nextBtn}
                alt="Next"
                className="w-[19px] h-[19px] md:w-[30px] md:h-[30px]"
              />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  </div>




  );
};

export default EorSection;
