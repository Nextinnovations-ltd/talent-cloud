/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { SendEmailSchema } from './SendEmailSchema'
import { Form } from '@/components/ui/form'
import InputField from '@/components/common/form/fields/input-field'
import { Button } from '@/components/ui/button'
import TextAreaField from '@/components/common/form/fields/text-area-field'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import emailjs from "emailjs-com";
const SendEmailForm = ({ step, setStep }) => {

  const [formData, setFormData] = useState<any>(null);

  const form = useForm({
    resolver: yupResolver(SendEmailSchema)
  });

  const handleSubmit = (values: any) => {
    // Save data and go to Step 2
    setFormData(values);
    setStep(2);
  };

  const handleFinalSubmit = () => {
    // Here you can integrate EmailJS or API call
    console.log("Final submitted:", formData);

      setStep(3);

    
     const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.description,
    };

 /*    emailjs.send(
      "service_uioedbr",   // Your Service ID
      "template_4ntnxm9",  // Your Template ID
      templateParams,
      "h2goBVoT1oRHu1ML8"  // Your Public Key
    )
    .then((response) => {
      console.log("SUCCESS!", response.status, response.text);
      setStep(3);
    })
    .catch((error) => {
      console.log("FAILED...", error);
    }); */
  };

  return (
    <div className='w-full pt-0 md:pt-[98px]'>
      <Form {...form}>
        {step === 1 && (
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col md:flex-row w-full gap-[32px] md:gap-[44px]">
                <InputField
                  fieldName={'name'}
                  lableName='Your Name *'
                  placeholder='Type Here'
                  fieldWidth='w-full lg:w-[50%] lg:w-[270px]'
                />
                <InputField
                  fieldName={'email'}
                  lableName='Your Email *'
                  placeholder='Email Address'
                  fieldWidth='w-full lg:w-[50%] lg:w-[270px]'
                />
              </div>
              <InputField
                fieldName={'subject'}
                lableName='Your Subject *'
                placeholder='Type Here'
                fieldWidth='w-full'
              />
              <TextAreaField
                fieldName={'description'}
                lableName='Message'
                placeholder='Type Here'
                fieldWidth='w-full'
                fieldHeight='h-[200px]'
              />
            </div>
            <Button
              className='bg-[#0481EF] mt-[48px] md:mt-[38px] w-full h-[71px] text-white text-[18px] font-[500]'
              type='submit'
            >
              Next
            </Button>
          </form>
        )}

        {step === 2 && formData && (
     
                

         <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-[32px]">
            
              <div className="flex flex-col md:flex-row w-full gap-[32px] md:gap-[44px]">
                <InputField
                  fieldName={'name'}
                  lableName='Your Name *'
                  placeholder={formData.name}
                  fieldWidth='w-full lg:w-[50%] lg:w-[270px]'
                />
                <InputField
                  fieldName={'email'}
                  lableName='Your Email *'
                  placeholder={formData.email}
                  fieldWidth='w-full lg:w-[50%] lg:w-[270px]'
                />
              </div>
              <InputField
                fieldName={'subject'}
                lableName='Your Subject *'
                placeholder={formData.subject}
                fieldWidth='w-full'
              />
              <TextAreaField
                fieldName={'description'}
                lableName='Message *'
                placeholder= {formData.description}
                fieldWidth='w-full'
                fieldHeight='h-[200px]'
              />
                      </div>
         
      
            <Button   onClick={handleFinalSubmit}
              className='bg-[#0481EF] mt-[48px] md:mt-[38px] w-full h-[71px] text-white text-[18px] font-[500]'
              type='submit'
            >
              Send Message
            </Button>
          </form>
              )}
              

              {step === 3 && (
                  

                  <div className='flex flex-col h-[100%] justify-end items-center gap-[72px] md:gap-[162px]'>
                      <div className="">
                        <svg className='mx-auto' xmlns="http://www.w3.org/2000/svg" width="68" height="67" viewBox="0 0 68 67" fill="none">
                          <path d="M61.9164 30.9317V33.5C61.9129 39.52 59.9636 45.3777 56.3591 50.1993C52.7546 55.0209 47.688 58.5482 41.915 60.2551C36.1421 61.962 29.972 61.757 24.3251 59.6707C18.6781 57.5845 13.8568 53.7287 10.5803 48.6785C7.30371 43.6283 5.74742 37.6542 6.14352 31.6472C6.53962 25.6403 8.86688 19.9223 12.7782 15.346C16.6895 10.7698 21.9754 7.58047 27.8474 6.25377C33.7194 4.92707 39.8629 5.53405 45.3618 7.9842" stroke="#22C55E" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                          <path d="M61.9167 11.1665L34 39.1111L25.625 30.7361" stroke="#22C55E" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          <p className='text-black text-[20px] md:text-[24px] font-[500] leading-[35px] md:leading-[42px] text-center mt-6'>Thanks for reaching out!</p>
                          <p className='text-[#484747] text-[14px] md:text-[24px] font-[500] leading-[25px] md:leading-[42px] text-center mt-3'>We’ve received your inquiry and will respond as soon as possible.</p>
                      </div>
                      
            <Link to='/emp/lp'
              className='bg-[#0481EF] w-full h-[71px] text-white text-[18px] font-[500] text-center rounded-[12px] flex justify-center items-center'
             
            >
              Back to Home
                      </Link>
            </div>
              )}
      </Form>
    </div>
  )
}
export default SendEmailForm