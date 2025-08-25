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

    const handleSubmit = async (value) => {
        console.log(value)
    }

    return (
        <div className='border-2 w-full'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} >
                    <InputField
                        fieldName={'name'}
                        lableName='Name'
                        placeholder='Name'
                        languageName={''}
                        required={false}
                        //styling here
                        fieldWidth='w-[200px]'
                    />

                    <TextAreaField
                        fieldName={'description'}
                        lableName='Description'
                        placeholder='Description'
                        languageName={''}
                        required={false}
                         //styling here
                        fieldWidth='w-[200px]'
                    />

                    <Button className='bg-bg-primary mt-[50px]' type='submit'>Send email</Button>
                </form>
            </Form>
        </div>
    )
}

export default SendEmailForm