/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import TextAreaFieldEditor from "@/components/common/form/fields/text-area-field-editor";

type StepTwoFormProps = {
  formMethods: UseFormReturn<any>;
};


const StepTwoForm = ({ formMethods }: StepTwoFormProps) => {
  return (
    <div className="max-w-[700px]">
      <Form {...formMethods}>

        <form>
          <TextAreaFieldEditor
            name="responsibilities"
            lableName="Describe responsibilities about this job"
            maxLength={800}
            isError={!!formMethods.formState.errors.responsibilities}
          />
          {/* <TextAreaField
            disabled={false}
            fieldName={'responsibilities'}
            lableName="Responsibilities"
            placeholder={'Outline the main tasks, day-to-day responsibilities, and team collaboration involved in this role.'}
            isError={!!formMethods.formState.errors.responsibilities}
            required={true}
            labelSize="text-[20px] font-[500]"
            requiredLabel={true}
            languageName={"userProfile"}
            fieldHeight={"h-[128px] border-[#6B6B6B] rounded-[12px] mt-3"}
            fieldWidth="w-full mt-[50px]"
            showLetterCount={true}
            maxLength={800}
          /> */}
          <TextAreaFieldEditor
            name="requirements"
            lableName="Describe requirements about this job"
            maxLength={800}
            isError={!!formMethods.formState.errors.requirements}
          />
          {/* <TextAreaField
            disabled={false}
            lableName="Requirements"
            fieldName={'requirements'}
            placeholder={'Include any must-have tools, certifications, or language proficiencies needed for this role.'}
            isError={!!formMethods.formState.errors.requirements}
            required={true}
            labelSize="text-[20px] font-[500]"
            requiredLabel={true}
            languageName={"userProfile"}
            fieldHeight={"h-[128px] border-[#6B6B6B] rounded-[12px] mt-3"}
            fieldWidth="w-full mt-[50px]"
            showLetterCount={true}
            maxLength={800}
          /> */}
           <TextAreaFieldEditor
            name="offered_benefits"
            lableName="Describe the matters that we offer about this job"
            maxLength={800}
            isError={!!formMethods.formState.errors.offered_benefits}
          />
          {/* <TextAreaField
            disabled={false}
            lableName="What we offer"
            fieldName={'offered_benefits'}
            placeholder={'Highlight the perks—salary, remote work, learning support, career growth, or other benefits.'}
            isError={!!formMethods.formState.errors.requirements}
            required={true}
            labelSize="text-[20px] font-[500]"
            requiredLabel={true}
            languageName={"userProfile"}
            fieldHeight={"h-[128px] border-[#6B6B6B] rounded-[12px] mt-3"}
            fieldWidth="w-full mt-[50px]"
            showLetterCount={true}
            maxLength={800}
          /> */}
        </form>

      </Form>
    </div>
  )
}


export default StepTwoForm;