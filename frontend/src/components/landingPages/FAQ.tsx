
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import circle from "@/assets/JobPortal/Ellipse 1088.svg";
import plusBtn from "@/assets/JobPortal/plus.svg";

const faqData = [
  {
    question: "What are the advantages of using our EOR services in Myanmar?",
    answers: [
      "Rapid hiring without establishing a local entity.",
      "Full compliance with local labor laws and regulations.",
      "Cost-effective access to skilled local talent.",
      "Mitigation of legal and operational risks.",
    ],
    subTitles: "Benefits include:",
  },
  {
    question: " How do we manage Myanmar's electricity challenges? ",
    answers: ["Talent Cloud provides necessary support for electricity if needed."],
    subTitles: "",
  },
  {
    question: "How does Talent Cloud handle employee onboarding and management?",
    answers: [
      "Conducting background checks and verifying qualifications.",
      "Facilitating smooth onboarding processes.",
      "Managing payroll, benefits, and compliance documentation.",
      "Providing ongoing HR support and performance evaluations.",
    ],
    subTitles: "Our comprehensive approach includes:",
  },
  {
    question: " What support is available for employees regarding workplace challenges?",
    answers: [
      "Regular check-ins and feedback sessions.",
      "Assistance with conflict resolution and workplace issues.",
      "Guidance on career development opportunities.",
    ],
    subTitles: "We offer:",
  },
  {
    question: "What HR services does Talent Cloud provide?",
    answers: [
      "Employee onboarding & offboarding.",
      "Contract generation (in line with Myanmar labor law).",
      "Leave management and attendance tracking.",
      "Performance monitoring and conflict resolution.",
      "Employee engagement and welfare coordination.",
    ],
    subTitles: "We handle end-to-end HR management, including:",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="w-full bg-[#F9FAFB]">
      <div className="max-w-[1240px] mx-auto gap-[30px] md:gap-[100px] flex flex-col md:flex-row items-start pt-[30px] pb-[100px] md:pt-[130px] md:pb-[200px] pr-5 pl-5">
        
        {/* Left Title Section */}
        <motion.div
          className="max-w-[394px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <p className="text-[#575757] text-[12px] md:text-[20px] font-[500] leading-[31px]">
            All Questions
          </p>
          <h1 className="mt-4 mb-3 md:mb-[20px] text-[#000] text-[24px] md:text-[40px] font-[500] leading-[37px] md:leading-[51px]">
            FREQUENTLY <br />
            ASKED QUESTIONS
          </h1>
          <p className=" text-[#575757] text-[12px] md:text-[16px] font-[500] leading-[24px] md:leading-[28px]">
            Here are some common questions along with their answers to help clear up any confusion.
          </p>
        </motion.div>

        {/* FAQ Section */}
        <div className="max-w-[822px] flex flex-col gap-[7px] md:gap-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                className="flex flex-col justify-center border-b border-black pt-2 md:pt-[14px] pb-2 md:pb-[14px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-between items-start gap-[33px]">
                  <h1
                    onClick={() => toggleIndex(index)}
                    className="cursor-pointer duration-200 transition-all text-[#000] text-[12px] md:text-[20px] font-[600] leading-[20px] md:leading-[48px]"
                  >
                    {faq.question}
                  </h1>
                  <img
                    src={plusBtn}
                    alt=""
                    onClick={() => toggleIndex(index)}
                    className={`cursor-pointer w-[18px] h-[18px] md:w-[32px] md:h-[32px] transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                  />
                </div>

                {/* Answers with AnimatePresence */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden mt-2 md:mt-[13px]"
                    >
                      <p className="text-[#484747] text-[12px] md:text-[16px] font-[500] leading-[20px] md:leading-[48px]">
                        {faq.subTitles}
                      </p>
                      {faq.answers.map((ans, i) => (
                        <div className="flex gap-3 items-start md:items-center" key={i}>
                          <img
                            src={circle}
                            alt=""
                            className="mt-[4px] md:mt-0 w-[7px] h-[7px] md:w-[16px] md:h-[16px]"
                          />
                          <p className="text-[#484747] text-[12px] md:text-[16px] font-[500] leading-[20px] md:leading-[48px]">
                            {ans}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;