import React from 'react'
import gradientImg from '@/assets/Employee/Contact us.png'
import contactImg from '@/assets/Employee/Frame 1618873031.png'
import mail from '@/assets/Employee/mail.svg';
import map from '@/assets/Employee/map.svg';
import phone from '@/assets/Employee/phone.svg';

const Form = () => {
  return (
    <div className='h-screen pt-[233px]' style={{
        backgroundImage: `url(${gradientImg})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '100%',
      }}>
      <h1 className='text-black text-center text-[40px] font-[500] leading-[64px]'>Contact us</h1>
      <p className='text-center text-[#484747] text-[24px] font-[500] leading-[38px] mt-[22px]'>Do you have a question? Send us a message and we’ll get back to you soon.</p>
      <div className="flex justify-center items-center mt-[50px]">
        <button className='w-[167px] h-[65px] rounded-[24px] bg-[#0481EF] p-[10px] text-white leading-[32px] text-[16px] font-[500]'>Inquiry Detail</button>
      <div className="mx-[10px] border border-[3] border-dashed border-[#575757] w-[170px] h-[1px]"></div> 
        <button className='w-[167px] h-[65px] rounded-[24px]  border-[2px] border-[#575757] p-[10px] text-[#575757] leading-[32px] text-[16px] font-[500]'>Confirmation</button>
      <div className=" mx-[10px] border border-[3] border-dashed border-[#575757] w-[170px] h-[1px]"></div> 
    <button className='w-[167px] h-[65px] rounded-[24px]  border-[2px] border-[#575757] p-[10px] text-[#575757] leading-[32px] text-[16px] font-[500]'>Delivering</button>

      </div>
      
      <div className="max-w-[1440px] h-[734px] mx-auto mt-[60px] py-[70px] px-[54px] border rounded-[18px] bg-white shadow-[0_4px_12px_0_#0D0A2C0F]">
        <div className="p-[40px] max-w-[425px]" style={{
            backgroundImage: `url(${contactImg})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          width: '100%',
            height: '100%',
          }}>
          <h1 className='text-white text-[24px] font-[500] leading-[38px] text-center'>Contact us</h1>
          <p className='text-white text-[16px] font-[500] leading-[26px] text-center mt-[20px]'>Do you have a question? Send us a message and we’ll get back to you soon.</p>
          <div className="flex flex-col gap-[32px] mt-[64px]">
            <div className="flex gap-[10px]  ">
              <img src={mail} alt="" className='w-[24px] h-[24px]'/>
              <p className='text-white text-[16px] font-[500] '>talentcloud@next-innovations.ltd</p>
           </div>
            <div className="flex gap-[10px]  ">
              <img src={phone} alt="" className='w-[24px] h-[24px]'/>
              <p className='text-white text-[16px] font-[500] '>+95 945 166 3606</p>
           </div>
            <div className="flex gap-[10px]  ">
              <img src={map} alt="" className='w-[24px] h-[24px]'/>
              <p className='text-white text-[16px] font-[500] '>Room No.(602), Gandamar Residence, Gandamar Road, Yangon</p>
           </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Form