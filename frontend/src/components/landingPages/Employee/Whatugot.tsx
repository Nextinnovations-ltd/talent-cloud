/* eslint-disable @typescript-eslint/ban-ts-comment */
import  { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import cardImg1 from '../../../assets/Employee/Frame 36408.png'
import cardImg2 from '../../../assets/Employee/Frame 36408 (1).png'
import cardImg3 from '../../../assets/Employee/Frame 36408 (2).png'
import cardImg4 from '../../../assets/Employee/Frame 36408 (3).png'
gsap.registerPlugin(ScrollTrigger)

const Whatugot = () => {
  const cardsRef = useRef([])

  const cardData = [
    {
      title: 'Work Globally, Communicate Clearly',
      content:
        'Our Myanmar-speaking CEO bridges cultures, ensuring seamless collaboration with Japanese partners.',
      quote:
        '"I\'m proud to lead a team dedicated to delivering exceptional results."',
      img:cardImg1
    },
    {
      title: 'Reliable Communication & Operations',
      content:
        'Our management team ensures seamless operations by handling office management, legalization, documentation, SOP, HR and admin needs, supported by English, Japanese and Burmese language, so you can focus  on your work.',
      quote:
        '',
        img:cardImg2
    },
    {
      title: 'Supportive Project Management',
      content:
        'Enjoy clear goals, efficient workflows, and full Japanese language support by our experienced Project Managers—ensuring smooth, successful project delivery every time.',
      quote:
        '',
        img:cardImg3
    },
    {
      title: 'Strong Teamwork & Collaboration',
      content:
        'Join a culture where collaboration, support, and shared learning drive growth. Together, we celebrate wins and continuously upskill through regular knowledge-sharing.',
      quote:
        '',
        img:cardImg4
    },
  ]

  useEffect(() => {
    cardsRef.current.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
  }, [])

  return (
    <div id='what-you-get' className="max-w-[1240px] mx-auto px-4 pt-[48px] pb-0 md:py-20">
     
      <h1 className="text-black text-[20px] md:text-[40px] font-[600] text-center mb-[24px] md:mb-[100px]">
        WHAT YOU GET
      </h1>

      <div className="space-y-[100px]">
        {cardData.map((card, index) => (
          <div
            key={index}
            //@ts-ignore
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-[#FAFAFA] rounded-[25px]   flex flex-col-reverse md:flex-row  justify-end md:justify-center items-center gap-[24px] md:gap-[50px] sticky  md:h-[414px] h-[680px] top-[15%] py-[40px] md:py-6 shadow-[0_1px_3px_0_#A6AFC366] "
          >           

            <div className="max-w-[345px] md:max-w-[506px]">
              <h2 className="mb-4 text-[#000] text-[20px] md:text-[32px] font-[600] leading-[31px] md:leading-[50px]">
                {card.title}
              </h2>
              <p className="mb-3 md:mb-6 text-[#484747] text-[16px] md:text-[20px] font-[500] leading-[25.12px] md:leading-[31px]">
                {card.content}
              </p>
              <p className="text-[#000] text-[16px] md:text-[20px] font-[500] leading-[29.76px ] md:leading-[34px]">
                {card.quote}
                {card.img === cardImg1 && <p className="text-[#0481EF]">
                <span className='text-[#000]'>—</span>   Mr. Yuta Mukai, CEO of Next Innovations Ltd.
                </p>}
              </p>
            </div>
            <div>
              <img src={card.img} alt="CEO" className="w-full max-w-[345px] md:max-w-[300px]" />
            </div>
          </div>
        ))} 
      </div>
  
    </div>
  )
}

export default Whatugot
