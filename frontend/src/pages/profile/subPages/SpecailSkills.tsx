import { ProfileTitle } from "@/components/common/ProfileTitle";
import { SpecialSkillYupSchema } from "@/lib/SpecialSkillSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { SelectField } from "@/components/common/form/fields/select-field";
import InputField from "@/components/common/form/fields/input-field";


type SpecialSkillType = {
  skill_id:number;
  year_of_experience:number;
};

const SpecailSkills = () => {
  
  const form = useForm<SpecialSkillType>({
    resolver:yupResolver(SpecialSkillYupSchema),
    defaultValues:{
      skill_id:0,
      year_of_experience:0
    }
  });

  const onSubmit = async()=>{

  }

  

  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Professional Skill" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex  items-center justify-between  gap-3 max-w-[672px]">
            <SelectField name={`skill_id`}
            placeholder="Figma"
            labelName="Skill Set"
            error={!!form.formState.errors?.skill_id}
            isRequired
            showRequiredLabel
            width="w-[50%]  m-0 p-0"
            />
            <InputField
              fieldName="year_of_experience"
              languageName="professionalSkill"
              isError={!!form.formState.errors?.year_of_experience}
              fieldWidth="w-[50%] mt-0" 
              required={true}
              type="number"
            />
          </div>
          <div className="max-w-[672px]  flex items-center justify-end">
            <button
              type="submit"
              className="mt-4  h-[48px] rounded-[26px] bg-blue-500  text-white px-4 py-2 "
              disabled={false}
            >
              Add Professional Skill
            </button>
          </div>
        </form>
      </Form>
      
      </div>
  )
}

export default SpecailSkills;
