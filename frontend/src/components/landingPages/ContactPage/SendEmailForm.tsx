/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { SendEmailSchema } from './SendEmailSchema'
import { Form } from '@/components/ui/form'
import InputField from '@/components/common/form/fields/input-field'
import { Button } from '@/components/ui/button'
import TextAreaField from '@/components/common/form/fields/text-area-field'

const SendEmailForm = () => {

    const form = useForm({
        resolver: yupResolver(SendEmailSchema)
    });

    const handleSubmit = async (value: any) => {
        console.log(value)
    }

    return (
        <div className=' w-full'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} >
                    <div className="flex flex-col gap-[32px]">
                          <div className="flex w-full gap-[44px]">
                        <InputField
                            fieldName={'name'}
                            lableName='Your Name *'
                            placeholder='Name'
                            languageName={''}
                            required={false}
                            //styling here
                            fieldWidth='w-[270px]'
                        />
                         <InputField
                            fieldName={'name'}
                            lableName='Your Email *'
                            placeholder='Name'
                            languageName={''}
                            required={false}
                            //styling here
                            fieldWidth='w-[270px]'
                        /></div> 
                           <InputField
                            fieldName={'name'}
                            lableName='Your Name *'
                            placeholder='Name'
                            languageName={''}
                            required={false}
                            //styling here
                            fieldWidth='w-full'
                        />

                        <TextAreaField
                            fieldName={'description'}
                            lableName='Message'
                            placeholder='Description'
                            languageName={''}
                            required={false}
                           //styling here
                        fieldWidth='w-full '
                        />

                    </div>
                  

                    <Button className='bg-[#0481EF] mt-[38px] w-full text-white text-[18px] font-[500] leading-[20px] py-[25px]' type='submit'>Next</Button>
                </form>
            </Form>
        </div>
    )
}

export default SendEmailForm