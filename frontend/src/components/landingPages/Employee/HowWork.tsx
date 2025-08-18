import createAccImg from '../../../assets/Employee/Create Account 4.png';
import hiringImg from '../../../assets/Employee/Hiring 3.png';
import getPromotionImg from '../../../assets/Employee/Get Job Promotion 4.png'
const HowWork = () => {
  return (
      <div className='max-w-[1240px] mx-auto py-[48px] md:py-[67px]'>
          <h1 className='text-black text-[20px] md:text-[40px] font-[600] text-center mb-[24px] md:mb-[58px] uppercase'>How its Work?</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 justify-between justify-items-center p-[10px] gap-[20px]">
              <div className=" max-w-[300px]">
                  <img src={createAccImg} alt="" />
                  <h1 className='text-black md:text-[24px] text-[20] font-[600] mt-[24px] leading-normal text-center'>Create Profile</h1>
                  <p  className='text-[#575757] text-[14px] md:text-[16px] font-[500] text-center'>Add your skills and experience get matched faster.</p>
              </div>
              <div className=" max-w-[300px]">
                  <img src={hiringImg} alt="" />
                  <h1 className='text-black md:text-[24px] text-[20] font-[600] mt-[24px] leading-normal text-center'>Get Matched </h1>
                  <p  className='text-[#575757] text-[14px] md:text-[16px] font-[500] text-center'>We’ll connect you with jobs that fit your skills and career goals.</p>
              </div>
              <div className=" max-w-[300px]">
                  <img src={getPromotionImg} alt="" />
                  <h1 className='text-black md:text-[24px] text-[20] font-[600] mt-[24px] leading-normal text-center'>Start Working</h1>
                  <p  className='text-[#575757] text-[14px] md:text-[16px] font-[500] text-center'>Begin your new role with confidence backed by our full support every step.</p>
              </div>
              
          </div>
          
    </div>
  )
}

export default HowWork