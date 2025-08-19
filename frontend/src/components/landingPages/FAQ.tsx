/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
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
    ],
    subTitles:'Benefits include:'
    },
    {
      question: " How do we manage Myanmar's electricity challenges? ",
      answers: ["Talent Cloud provides necessary support for electricity if needed."],
       subTitles:''
    },
    {
      question: "How does Talent Cloud handle employee onboarding and management?",
      answers: [
        'Conducting background checks and verifying qualifications.',
        'Facilitating smooth onboarding processes.',
       ' Managing payroll, benefits, and compliance documentation.',
        '     Providing ongoing HR support and performance evaluations.'],
subTitles:'Our comprehensive approach includes:'
    },
    {
      question: " What support is available for employees regarding workplace challenges?",
      answers: ['  Regular check-ins and feedback sessions.'
    ,' Assistance with conflict resolution and workplace issues.',
     'Guidance on career development opportunities.'],
      subTitles:'We offer:'
  },
  {
    question: "What HR services does Talent Cloud provide?",
  answers:  [' Employee onboarding & offboarding.',
      'Contract generation (in line with Myanmar labor law).',
      ' Leave management and attendance tracking.',
      ' Performance monitoring and conflict resolution.',
     '  Employee engagement and welfare coordination.'],
     subTitles:' We handle end-to-end HR management, including:'
    
    }
  
]
const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleIndex = (index:any) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  return (
    <div id='faq' className="w-full bg-[#F9FAFB]">
     <div className='max-w-[1240px] mx-auto gap-[30px] md:gap-[100px] flex flex-col md:flex-row items-start pt-[30px] pb-[100px] md:pt-[130px] md:pb-[200px] pr-5 pl-5'>
          <div className="max-w-[394px]">
          <p className='text-[#575757] text-[12px] md:text-[20px] font-[500] leading-[31px]'>All Questions</p>
              <h1 className='mt-4 mb-3 md:mb-[20px] text-[#000] text-[24px] md:text-[40px] font-[500] leading-[37px] md:leading-[51px]'>FREQUENTLY <br></br>
                  ASKED QUESTIONS</h1>
              <p className=' text-[#575757] text-[12px] md:text-[16px] font-[500] leading-[24px] md:leading-[28px]'>Here are some common questions along with their answers to help clear up any confusion.</p>
          </div>
          <div className="max-w-[822px] flex flex-col gap-[7px] md:gap-4">
          {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="flex flex-col justify-center border-b border-black pt-2 md:pt-[14px] pb-2 md:pb-[14px] transition-all duration-500 ease-in-out"
                >
                  <div className="flex justify-between items-start gap-[33px]">
                    <h1 onClick={() => toggleIndex(index)} className="cursor-pointer duration-300 transition-all  text-[#000] text-[12px] md:text-[20px] font-[600] leading-[20px] md:leading-[48px]">
                      {faq.question}
                    </h1>
                    <img
                      src={plusBtn}
                      alt=""
                      onClick={() => toggleIndex(index)}
                      className={`cursor-pointer w-[18px] h-[18px] md:w-[32px] md:h-[32px] transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                    />

                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? 'max-h-[1000px] opacity-100 mt-0 md:mt-[13px]' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-[#484747] text-[12px] md:text-[16px] font-[500] leading-[20px] md:leading-[48px]">
                      {faq.subTitles}
                    </p>
                    {faq.answers.map((ans, i) => (
                      <div className="flex gap-3 items-center" key={i}>
                        <img src={circle} alt=""  className='w-[7px] h-[7px] md:w-[16px] md:h-[16px]'/>
                        <p className="text-[#484747] text-[12px] md:text-[16px] font-[500] leading-[20px] md:leading-[48px]">{ans}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

        </div>
    </div>
   </div>
  )
}

export default FAQ