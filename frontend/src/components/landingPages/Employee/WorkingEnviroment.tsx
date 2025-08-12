import marqueeImg1 from '../../../assets/Employee/Rectangle 5668.png'
import marqueeImg2 from '../../../assets/Employee/Rectangle 5671.png'
import './WorkingEnviroment.css'
const WorkingEnviroment = () => {
  return (
    <div className="overflow-hidden bg-white py-10">
      <h1 className='text-black text-[18px] md:text-[40px] font-[600] text-center mb-[24px] md:mb-[32px] mt-0 md:mt-[67px]'>
        OUR LOVELY WORKING ENVIRONMENT
      </h1>

      <div className="marquee-container overflow-hidden whitespace-nowrap w-[90%] justify-self-end">
        <div className="marquee-content inline-flex animate-marquee gap-[23px]">
          {/* Repeat enough images to create a seamless loop */}
          <img src={marqueeImg1} alt="" className="w-[45%]" />
          <img src={marqueeImg2} alt="" className="w-[45%]" />
          <img src={marqueeImg1} alt="" className="w-[45%]" />
          <img src={marqueeImg2} alt="" className="w-[45%]" />
          <img src={marqueeImg1} alt="" className="w-[45%]" />
          <img src={marqueeImg2} alt="" className="w-[45%]" />
        </div>
      </div>
    </div>
  )
}

export default WorkingEnviroment
