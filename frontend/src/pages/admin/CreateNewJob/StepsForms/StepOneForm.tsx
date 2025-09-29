/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "@/components/ui/form";
import InputField from "@/components/common/form/fields/input-field";
import { SelectField } from "@/components/common/form/fields/select-field";
import { useFormattedSpecialization } from "@/lib/dropData.tsx/ReturnSpecialization";
import { useFormattedRolesBySpecializationList } from "@/lib/dropData.tsx/ReturnRoleOptionsBySpecialization";
import { JOB_TYPE_DATA, WORK_TYPE_DATA } from "@/constants/workTypeConstants";
import { UseFormReturn, useWatch } from "react-hook-form";

import { useEffect, useRef } from "react";
import TextAreaFieldEditor from "@/components/common/form/fields/text-area-field-editor";

type StepOneFormProps = {
  formMethods: UseFormReturn<any>;
};

const StepOneForm = ({ formMethods }: StepOneFormProps) => {
  const specialization = useWatch({
    control: formMethods.control,
    name: "specialization",
  });

  const {
    data: SPECIALIZATIONDATA = [],
    isLoading: isSpecializationLoading,
  } = useFormattedSpecialization();

  const {
    data: ROLEDATA = [],
    isLoading: isRoleFetching,
    isSuccess: isSuccessRole
  } = useFormattedRolesBySpecializationList(specialization);

  const selectedSpecializationId = formMethods.watch("specialization");
  const selectedRole = formMethods.watch("role");



  const firstRender = useRef(true);
  const prevSpecializationId = useRef<number | string | null>(null);

  useEffect(() => {
    // Skip on first render
    if (firstRender.current) {
      firstRender.current = false;
      prevSpecializationId.current = selectedSpecializationId;
      return;
    }


    // Only proceed if role data has loaded
    if (!isSuccessRole || !ROLEDATA.length) return;




    // Only reset role if specialization has changed
    if (prevSpecializationId.current !== selectedSpecializationId) {
      prevSpecializationId.current = selectedSpecializationId;

      const isValidRole = ROLEDATA.some(role => role.value === selectedRole);

      if (!isValidRole) {
        formMethods.setValue('role', '');
      }
    }
  }, [selectedSpecializationId, ROLEDATA, isSuccessRole]);






  return (
    <div className="max-w-[700px]">
      <Form {...formMethods}>
        <form>
          <InputField
            fieldName="title"
            languageName=""
            fieldWidth="w-full"
            labelSize="text-[20px] mb-3 font-[500]"
            fieldHeight="border-[#6B6B6B] rounded-[12px]"
            isError={!!formMethods.formState.errors?.title}
            lableName="Job Title"
            required
            placeholder="e.g UI/UX designer"
            maxLength={100}
            showLetterCount
          />
          <div className="mt-[25px] gap-[72px] flex items-center w-full">
            {
              SPECIALIZATIONDATA?.length > 1 && <SelectField
                name="specialization"
                labelName="Specializations"
                labelStyle="text-[20px] font-[500]"
                error={!!formMethods.formState.errors.specialization}
                isRequired
                height="border-[#6B6B6B] rounded-[12px] mt-3 h-12"
                showRequiredLabel
                placeholder={isSpecializationLoading ? "Loading..." : "e.g Design"}
                data={SPECIALIZATIONDATA}
                width="w-[50%] mt-[24px]"
              />
            }
            {
              isSuccessRole && <SelectField
                name="role"
                labelName="Role"
                labelStyle="text-[20px] font-[500]"
                error={!!formMethods.formState.errors.role}
                isRequired
                showRequiredLabel
                height="border-[#6B6B6B] rounded-[12px] mt-3 h-12"
                placeholder={
                  !specialization
                    ? "Select specialization first"
                    : isRoleFetching
                      ? "Loading roles..."
                      : "e.g Figma Designer"
                }
                data={ROLEDATA}
                width="w-[50%] mt-[24px]"
                isDisabled={!specialization || isRoleFetching}
              />
            }
          </div>

          <div className="mt-[20px] gap-[72px] flex items-center w-full">
            <SelectField
              name="job_type"
              labelName="Job Type"
              labelStyle="text-[20px] font-[500]"
              error={!!formMethods.formState.errors.job_type}
              isRequired
              height="border-[#6B6B6B] rounded-[12px] mt-3 h-12"
              showRequiredLabel
              placeholder="Full Time"
              data={JOB_TYPE_DATA}
              width="w-[50%] mt-[24px]"
            />
            <SelectField
              name="work_type"
              labelName="Work Type"
              labelStyle="text-[20px] font-[500]"
              error={!!formMethods.formState.errors.work_type}
              isRequired
              showRequiredLabel
              height="border-[#6B6B6B] rounded-[12px] mt-3 h-12"
              placeholder="On Site"
              data={WORK_TYPE_DATA}
              width="w-[50%] mt-[24px]"
            />
          </div>
          <InputField
            fieldName="location"
            languageName=""
            fieldWidth="w-full mt-[40px]"
            labelSize="text-[20px] mb-3 font-[500]"
            fieldHeight="border-[#6B6B6B] rounded-[12px]"
            isError={!!formMethods.formState.errors?.location}
            lableName="Location"
            required
            placeholder="e.g., City, State"
            maxLength={100}
            showLetterCount
          />

          <TextAreaFieldEditor
            name="description"
            place="Describe description about this job"
            lableName="Description"
            maxLength={800}
            isError={!!formMethods.formState.errors.description}
          />

          {/* <TextAreaField
            disabled={false}
            fieldName="description"
            placeholder="Describe the role, responsibilities and what make this opportunity exciting..."
            isError={!!formMethods.formState.errors.description}
            required
            labelSize="text-[20px] font-[500]"
            requiredLabel={true}
            languageName="userProfile"
            fieldHeight="h-[128px] border-[#6B6B6B] rounded-[12px] mt-3"
            fieldWidth="w-full mt-[50px]"
            showLetterCount
            maxLength={800}
          /> */}
        </form>
      </Form>
    </div>
  );
};

export default StepOneForm;
