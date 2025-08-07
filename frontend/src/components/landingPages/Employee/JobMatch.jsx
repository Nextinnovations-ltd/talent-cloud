import React from 'react'
import arrowRight from '../../../assets/Employee/arrow-right.svg'
import GoogleIcon from '../../../assets/Employee/Google_Logo.svg'
import Linkedin from '../../../assets/Employee/Linkedin_logo.svg'
import Netflix from '../../../assets/Employee/Netflix.svg'
import NewTag from '../../../assets/Employee/New.svg'
import BookMark from '../../../assets/Employee/Bookmark Tooltip.svg'
import BookMarkActive from '../../../assets/Employee/Bookmark Active.svg'
import dollarSign from '../../../assets/Employee/dollar_16026501 1.svg'
import userSign from '../../../assets/Employee/users_7263413 1.svg'
import fragSign from '../../../assets/Employee/users_7263413 2.svg'
const JobMatch = () => {
  return (
      <div className='w-full bg-[#EEF4FF] pt-[74px] pb-[74px] flex flex-col gap-[69px]'>
          <h1 className='text-black text-[40px] font-[600] text-center mb-[48px]'>
          FIND YOUR JOB MATCH
          </h1>
        
          <div className="max-w-[1240px] mx-auto grid grid-cols-3 gap-6 ">
              <div className="p-[30px] bg-white rounded-[17px]  border-[2px] border-[#CBD5E1B3] max-w-[395px] relative">
                  <img src={NewTag} alt="" className='absolute top-[-16px] left-0'/>
                  <div className="flex justify-between items-start">
                      <img src={GoogleIcon} alt="" />
                      <img src={BookMarkActive} alt="" />
                  </div>
                  <div className="mt-6">
                      <h1 className='text-[#05060F] text-[22px] font-[600] leading-[29px] mb-1'>Senior UI UX Designer</h1>
                      <p className='text-[#6B6B6B] text-[18px] font-[400] leading-[24px]'>Molax Co, Ltd.</p>
                      <div className="mt-[22px] flex flex-col gap-[14px]">
                          <div className="flex gap-3 justify-start items-center">
                              <img src={dollarSign} alt="" />
                              <p className='text-[#05060F] text-[18px] font-[600] leading-[24px]'>50,000-1,000,000 <span className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'> MMK/month</span> </p>
                          </div>
                          <div className="flex gap-3 justify-start items-center">
                              <img src={userSign} alt="" />
                              <p className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'> Full Time</p>
                          </div>
                          <div className="flex gap-3 justify-start items-center">
                              <img src={fragSign} alt="" />
                              <div className="flex gap-[6px] ">
                                  <p className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>Figma</p>
                                  <p  className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>Photoshop</p>
                                  <p  className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>Illustrator</p>
                                  <p  className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>...</p>
                             </div>
                          </div>
                      </div>
                      <p className='text-[#6B6B6B] text-[14px] font-[400] leading-[18px] mt-[33px]'>Help LearnWith.AI differentiate itself from the rest of the pack by generating engaging and ...</p>
                      <div className="w-full bg-[#CBD5E1B3] h-[1px] mt-[24px] mb-[24px]"></div>
                      <div className="flex gap-2  items-center">
                          <p  className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'>an hour ago</p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                          <circle cx="2" cy="2.5" r="2" fill="#6B6B6B"/>
                        </svg>
                          <p  className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'>20 Applicants</p>
                      </div>
                  </div>
              </div>
              <div className="p-[30px] bg-white rounded-[17px]  border-[2px] border-[#CBD5E1B3] max-w-[395px] relative">
                  <img src={NewTag} alt="" className='absolute top-[-16px] left-0'/>
                  <div className="flex justify-between items-start">
                      <img src={Linkedin} alt="" />
                      <img src={BookMark} alt="" />
                  </div>
                  <div className="mt-6">
                      <h1 className='text-[#05060F] text-[22px] font-[600] leading-[29px] mb-1'>Senior UI UX Designer</h1>
                      <p className='text-[#6B6B6B] text-[18px] font-[400] leading-[24px]'>Molax Co, Ltd.</p>
                      <div className="mt-[22px] flex flex-col gap-[14px]">
                          <div className="flex gap-3 justify-start items-center">
                              <img src={dollarSign} alt="" />
                              <p className='text-[#05060F] text-[18px] font-[600] leading-[24px]'>50,000-1,000,000 <span className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'> MMK/month</span> </p>
                          </div>
                          <div className="flex gap-3 justify-start items-center">
                              <img src={userSign} alt="" />
                              <p className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'> Full Time</p>
                          </div>
                          <div className="flex gap-3 justify-start items-center">
                              <img src={fragSign} alt="" />
                              <div className="flex gap-[6px] ">
                                  <p className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>Figma</p>
                                  <p  className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>Photoshop</p>
                                  <p  className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>Illustrator</p>
                                  <p  className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>...</p>
                             </div>
                          </div>
                      </div>
                      <p className='text-[#6B6B6B] text-[14px] font-[400] leading-[18px] mt-[33px]'>Help LearnWith.AI differentiate itself from the rest of the pack by generating engaging and ...</p>
                      <div className="w-full bg-[#CBD5E1B3] h-[1px] mt-[24px] mb-[24px]"></div>
                      <div className="flex gap-2  items-center">
                          <p  className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'>an hour ago</p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                          <circle cx="2" cy="2.5" r="2" fill="#6B6B6B"/>
                        </svg>
                          <p  className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'>20 Applicants</p>
                      </div>
                  </div>
              </div>
              <div className="p-[30px] bg-white rounded-[17px]  border-[2px] border-[#CBD5E1B3] max-w-[395px] relative">
                  <img src={NewTag} alt="" className='absolute top-[-16px] left-0'/>
                  <div className="flex justify-between items-start">
                      <img src={Netflix} alt="" />
                      <img src={BookMarkActive} alt="" />
                  </div>
                  <div className="mt-6">
                      <h1 className='text-[#05060F] text-[22px] font-[600] leading-[29px] mb-1'>Senior UI UX Designer</h1>
                      <p className='text-[#6B6B6B] text-[18px] font-[400] leading-[24px]'>Molax Co, Ltd.</p>
                      <div className="mt-[22px] flex flex-col gap-[14px]">
                          <div className="flex gap-3 justify-start items-center">
                              <img src={dollarSign} alt="" />
                              <p className='text-[#05060F] text-[18px] font-[600] leading-[24px]'>50,000-1,000,000 <span className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'> MMK/month</span> </p>
                          </div>
                          <div className="flex gap-3 justify-start items-center">
                              <img src={userSign} alt="" />
                              <p className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'> Full Time</p>
                          </div>
                          <div className="flex gap-3 justify-start items-center">
                              <img src={fragSign} alt="" />
                              <div className="flex gap-[6px] ">
                                  <p className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>Figma</p>
                                  <p  className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>Photoshop</p>
                                  <p  className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>Illustrator</p>
                                  <p  className='text-[#05060F] text-[14px] font-[400] leading-normal px-[10px] py-[4px] bg-[#F2F2F2] rounded-[8px]'>...</p>
                             </div>
                          </div>
                      </div>
                      <p className='text-[#6B6B6B] text-[14px] font-[400] leading-[18px] mt-[33px]'>Help LearnWith.AI differentiate itself from the rest of the pack by generating engaging and ...</p>
                      <div className="w-full bg-[#CBD5E1B3] h-[1px] mt-[24px] mb-[24px]"></div>
                      <div className="flex gap-2  items-center">
                          <p  className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'>an hour ago</p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="4" height="5" viewBox="0 0 4 5" fill="none">
                          <circle cx="2" cy="2.5" r="2" fill="#6B6B6B"/>
                        </svg>
                          <p  className='text-[#6B6B6B] text-[14px] font-[400] leading-[24px]'>20 Applicants</p>
                      </div>
                  </div>
              </div>
          </div>
        
        
          <div className="flex gap-[17px] justify-center items-center w-[345px] h-[72px] rounded-[28px] border border-[#0A66C2] mx-auto">
          <a href="" className=''>See all jobs post</a>
          <img src={arrowRight} alt="" />
          </div>
      </div>
  )
}

export default JobMatch