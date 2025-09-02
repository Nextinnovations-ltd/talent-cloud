import gradientImg from '@/assets/Employee/Contact us.png'
import { Link } from 'react-router-dom'
const Privacy = () => {
  return (
 <div className='' style={{
    backgroundImage: `url(${gradientImg})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    width: '100%',
      }}>
          <div className="max-w-[1440px] mx-auto pt-[124px] md:pt-[321px] pb-[154px] md:pb-[208px] px-6">
             <div className="max-w-[1169px]">
                 <h1 className='text-black text-[20px] md:text-[64px] font-[600] leading-[29px] md:leading-[92px] uppercase '>Privacy policy</h1>
                  <p className='text-black text-[12px] md:text-[20px] font-[500] leading-[17px] md:leading-[29px] mt-[12px] md:mt-[15px]'>Last Updated 19, August, 2025 </p>
                  <p className='text-black text-[12px] md:text-[24px] font-[500] leading-[17px] md:leading-[34px] mt-[30px] md:mt-[54px]'>At Talent Cloud, protecting your privacy and ensuring the security of your personal information is our priority. This Privacy Policy explains how we collect, use, store, and protect your data when you use our services.</p>
              </div>
              <div className="flex flex-col gap-[48px] md:gap-[64px] mt-[45px] md:mt-[108px]">
                  <div className="max-w-[1080px]">
                      <h1 className='text-black text-[20px]  md:text-[40px] font-[600] leading-[29px] md:leading-[58px] mb-[16px]'>Information We Collect</h1>
                      <p className='text-[#484747] text-[12px] md:text-[24px] font-[500] leading-[17px] md:leading-[43px] '>  We may collect the following types of information:
                      </p>
                      <ul className="ml-[15px]">
                          <li className=' list-disc  text-[#484747] text-[12px] md:text-[24px] font-[500] leading-[22px] md:leading-[43px] '>
                             Personal Information: such as your name, email address, phone number, and other details you provide.
                       
                          </li>
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                             Professional Information: including your CV, education history, work experience, skills, and certifications.
                     
                          </li>
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                               Usage Data: information about how you interact with our platform (such as login times and feature usage).
                          </li>
                      </ul>
                  </div>
                  <div className="max-w-[934px]">
                      <h1 className='text-black text-[20px] md:text-[40px] font-[600] leading-[29px] md:leading-[58px] mb-[16px]'>How We Use Your Information</h1>
                      <p className='text-[#484747] text-[12px] md:text-[24px] font-[500] leading-[17px] md:leading-[43px] '> 
                        We process your information to:
                      
                      </p>
                      <ul className="ml-[15px]">
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                              Create and manage your Talent Cloud profile.
                           
                       
                          </li>
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                             Match you with relevant job opportunities and employers.
                           
                     
                          </li>
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                             Send updates, application status notifications, and job recommendations.
                           
                          </li>
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                             
                            Maintain and improve the performance of our platform.
                          
                          </li>
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                      
                            Ensure compliance with applicable laws and regulations.
                          </li>
                      </ul>
                  </div>
                  <div className="max-w-[903px]">
                      <h1 className='text-black text-[20px] md:text-[40px] font-[600] leading-[29px] md:leading-[58px] mb-[16px]'>Sharing of Information</h1>
                      <p className='text-[#484747] text-[12px] md:text-[24px] font-[500] leading-[17px] md:leading-[43px] '> 
                        Your data may be shared in the following ways:
                      
                      </p>
                    
                      <ul className="ml-[15px]">
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                              With Employers/Organizations: when you apply for a job or choose to share your profile.
                        
                       
                          </li>
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                            With Service Providers: who support our operations (e.g., hosting, analytics, communication tools).
                       
                     
                          </li>
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                             For Legal Purposes: if required by law or to protect the rights and safety of our users.
                          
                          </li>
                      </ul>
                      <p className='text-[#484747] text-[12px] md:text-[24px] font-[500] leading-[17px] md:leading-[43px] '> 
                          We do not sell or trade your personal information to third parties.
                      </p>
                  </div>
                  <div className="max-w-[1070px]">
                      <h1 className='text-black text-[20px] md:text-[40px] font-[600] leading-[29px] md:leading-[58px] mb-[16px]'>Data Protection & Retention</h1>
                      <p className='text-[#484747] text-[12px] md:text-[24px] font-[500] leading-[17px] md:leading-[43px] '> 
                        We apply industry-standard technical and organizational measures to protect your data. Your information will be stored only for as long as necessary to provide our services or as required by law.
                      </p>
                      
                  </div>
                  <div className="">
                      <h1 className='text-black text-[20px] md:text-[40px] font-[600] leading-[29px] md:leading-[58px] mb-[16px]'>
                        Your Rights
                      </h1>
                      <p className='text-[#484747] text-[12px] md:text-[24px] font-[500] leading-[17px] md:leading-[43px] '> 
                        You have the right to:
                    
                      </p>
                     
                      <ul className="ml-[15px]">
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                            Access and update your personal data.
                            
                       
                          </li>
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                            Request deletion of your account and associated data.
                           
                     
                          </li>
                          <li className=' list-disc text-[#484747] text-[12px] md:text-[24px] font-[500]  leading-[22px] md:leading-[43px] '>
                             Manage your communication and notification preferences.
                          
                          </li>
                      </ul>
                     <p className='text-[#484747] text-[12px] md:text-[24px] font-[500] leading-[17px] md:leading-[43px] '> 
                          If you wish to exercise these rights, please contact us at  <Link to='' target='_blank' className='text-[#0481EF] underline'>talentcloud@next-innovations.ltd </Link>
                    
                      </p>
                  </div>
              </div>
         </div>
          </div>
  )
}

export default Privacy