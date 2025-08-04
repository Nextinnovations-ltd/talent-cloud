import { Form } from "@/components/ui/form";
import InputField from "@/components/common/form/fields/input-field";
import { SelectField } from "@/components/common/form/fields/select-field";
import { useFormattedSpecialization } from "@/lib/dropData.tsx/ReturnSpecialization";
import { useFormattedRolesBySpecializationList } from "@/lib/dropData.tsx/ReturnRoleOptionsBySpecialization";
import { JOB_TYPE_DATA, WORK_TYPE_DATA } from "@/constants/workTypeConstants";
import TextAreaField from "@/components/common/form/fields/text-area-field";
import { UseFormReturn } from "react-hook-form";
import { useEffect, useRef } from 'react';
import { StepOneFormType } from "../CreateNewJob";



type StepOneFormProps = {
  formMethods: UseFormReturn<StepOneFormType>;
};

const StepOneForm = ({ formMethods }: StepOneFormProps) => {
  const selectedSpecializationId = formMethods.watch("specialization");
  const selectedRole = formMethods.watch("role");

  const firstRender = useRef(true);

  const { data: SPECIALIZATIONDATA = [], isLoading: isSpecializationLoading } =
    useFormattedSpecialization();

  const {
    data: ROLEDATA = [],
    isLoading: isRoleFetching
  } = useFormattedRolesBySpecializationList(selectedSpecializationId);

  useEffect(() => {
    // Skip on first render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
  
    if (selectedSpecializationId) {
      const isValidRole = ROLEDATA.some(role => role.value?.toString() === selectedRole);
      if (!isValidRole) {
        formMethods.setValue('role', '');
      }
    } else {
      formMethods.setValue('role', '');
    }
  }, [selectedSpecializationId, ROLEDATA, selectedRole, formMethods]);

  return (
    <div className="max-w-[700px]">
      <Form {...formMethods}>
        <form>
          <InputField
            fieldName='title'
            languageName=""
            fieldWidth="w-full"
            labelSize="text-[20px] mb-3 font-[500]"
            fieldHeight="border-[#6B6B6B] rounded-[12px]"
            isError={!!formMethods.formState.errors?.title}
            lableName="Job Title"
            required
            placeholder="e.g UI/UX designer"
          />

          <div className="mt-[25px] gap-[72px] flex items-center w-full">
            <SelectField
              name={"specialization"}
              labelName={"Specializations"}
              labelStyle="text-[20px] font-[500]"
              error={!!formMethods.formState.errors.specialization}
              isRequired={true}
              height="border-[#6B6B6B] rounded-[12px] mt-3 h-12"
              showRequiredLabel={true}
              placeholder={isSpecializationLoading ? "Loading..." : "e.g Design"}
              data={SPECIALIZATIONDATA}
              width="w-[50%] mt-[24px]"
            />
            <SelectField
              name={"role"}
              labelName={"Role"}
              labelStyle="text-[20px] font-[500]"
              error={!!formMethods.formState.errors.role}
              isRequired={true}
              showRequiredLabel={true}
              height="border-[#6B6B6B] rounded-[12px] mt-3 h-12"
              placeholder={
                !selectedSpecializationId ? "Select specialization first" :
                isRoleFetching ? "Loading roles..." : "e.g Figma Designer"
              }
              data={ROLEDATA}
              width="w-[50%] mt-[24px]"
            />
          </div>

          <div className="mt-[20px] gap-[72px] flex items-center w-full">
            <SelectField
              name={"job_type"}
              labelName={"Job Type"}
              labelStyle="text-[20px] font-[500]"
              error={!!formMethods.formState.errors.job_type}
              isRequired={true}
              height="border-[#6B6B6B] rounded-[12px] mt-3 h-12"
              showRequiredLabel={true}
              placeholder={"Full Time"}
              data={JOB_TYPE_DATA}
              width="w-[50%] mt-[24px]"
            />
            <SelectField
              name={"work_type"}
              labelName={"Work Type"}
              labelStyle="text-[20px] font-[500]"
              error={!!formMethods.formState.errors.work_type}
              isRequired={true}
              showRequiredLabel={true}
              height="border-[#6B6B6B] rounded-[12px] mt-3 h-12"
              placeholder={"On Site"}
              data={WORK_TYPE_DATA}
              width="w-[50%] mt-[24px]"
            />
          </div>

          <InputField
            fieldName='location'
            languageName=""
            fieldWidth="w-full mt-[40px]"
            labelSize="text-[20px] mb-3 font-[500]"
            fieldHeight="border-[#6B6B6B] rounded-[12px]"
            isError={!!formMethods.formState.errors?.title}
            lableName="Location"
            required
            placeholder="e.g., City, State"
          />

          <TextAreaField
            disabled={false}
            fieldName={'description'}
            placeholder={'Describe the role, responsibilities and what make this opportunity exciting...'}
            isError={!!formMethods.formState.errors.description}
            required={true}
            labelSize="text-[20px] font-[500]"
            requiredLabel={true}
            languageName={"userProfile"}
            fieldHeight={"h-[128px] border-[#6B6B6B] rounded-[12px] mt-3"}
            fieldWidth="w-full mt-[50px]"
            showLetterCount={true}
            maxLength={500}
          />
        </form>
      </Form>
    </div>
  );
};

export default StepOneForm;