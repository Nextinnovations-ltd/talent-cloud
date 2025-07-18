import React from 'react'
import { useState } from 'react'
import closeBtn from '@/assets/JobPortal/ic_round-add.svg'
import circle from '@/assets/JobPortal/Ellipse 1088.svg'
import plusBtn from '@/assets/JobPortal/plus.svg'


const faqData = [
    {
      question: "What are the advantages of using our EOR services in Myanmar?",
      answers: [
        "Rapid hiring without establishing a local entity.",
        "Full compliance with local labor laws and regulations.",
        "Cost-effective access to skilled local talent.",
        "Mitigation of legal and operational risks."
      ]
    },
    {
      question: "How long does it take to onboard employees?",
      answers: ["Usually within 1-2 weeks after receiving necessary documents."]
    },
    {
      question: "What industries do you support?",
      answers: ["We support IT, manufacturing, finance, and more."]
    },
    {
      question: "Can we transfer employees to our entity later?",
      answers: ["Yes, we support smooth transition planning."]
    }
  ];
  
const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleIndex = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  return (
      <div className='max-w-[1240px] mx-auto gap-[62px] flex items-start pt-[130px]'>
          <div className="">
          <p className='text-[#575757] text-[20px] font-[500] leading-[31px]'>All Questions</p>
              <h1 className='mt-4 mb-[20px] text-[#000] text-[40px] font-[500] leading-[51px]'>FREQUENTLY <br></br>
                  ASKED QUESTIONS</h1>
              <p className='max-w-[370px] text-[#575757] text-[16px] font-[500] leading-[28px]'>Here are some common questions along with their answer to help clear up any confusion.</p>
          </div>
          <div className="max-w-[822px] flex flex-col gap-4">
          {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center border-b border-black pt-[14px] pb-[14px] transition-all duration-500 ease-in-out"
                >
                  <div className="flex justify-between gap-[33px]">
                    <h1 className="text-[#000] text-[20px] font-[600] leading-[48px]">
                      {faq.question}
                    </h1>
                    <img
                      src={plusBtn}
                      alt=""
                      onClick={() => toggleIndex(index)}
                      className={`cursor-pointer transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                    />

                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-[1000px] opacity-100 mt-[13px]' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-[#484747] font-[500] leading-[48px]">
                      Benefits include:
                    </p>
                    {faq.answers.map((ans, i) => (
                      <div className="flex gap-3" key={i}>
                        <img src={circle} alt="" />
                        <p className="text-[#484747] font-[500] leading-8">{ans}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

        </div>
    </div>
  )
}

export default FAQ