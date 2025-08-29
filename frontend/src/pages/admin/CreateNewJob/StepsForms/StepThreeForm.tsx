/* eslint-disable @typescript-eslint/no-explicit-any */
import { UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { SelectField } from "@/components/common/form/fields/select-field";
import { PER_SALARY_TYPE_DATA, PROJECT_DURATION_TYPE_DATA, SALARY_MODE_TYPE_DATA } from "@/constants/workTypeConstants";
import InputField from "@/components/common/form/fields/input-field";
import RadioField from "@/components/common/form/fields/radio-field";
import { MultiSelect } from "@/components/common/MultiSelect";
import { useFormattedSkills } from "@/lib/dropData.tsx/ReturnSkills";
import { useEffect, useState } from "react";
import { useFormattedExperience } from "@/lib/dropData.tsx/ReturnExperience";
import clsx from "clsx";
import DatePickerField from "@/components/common/form/fields/date-picker-field";

type StepThreeFormProps = {
    formMethods: UseFormReturn<any>;
};

const StepThreeForm = ({ formMethods }: StepThreeFormProps) => {
    const { data: FORMATTEDDATA, isLoading } = useFormattedSkills();
    const { data: FORMATTEDEXPERIENCE, isLoading: FORMATTEDLOADING } = useFormattedExperience();
    const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(
        formMethods.getValues('skills') || []
    );

    // Effect for syncing selected frameworks with form
    useEffect(() => {
        if (formMethods) {
            formMethods.setValue('skills', selectedFrameworks);
        }
    }, [formMethods, selectedFrameworks]);

    // Effect for handling salary mode and negotiable changes
    useEffect(() => {
        const subscription = formMethods.watch((value, { name }) => {
            if (name === 'is_salary_negotiable') {
                if (value.is_salary_negotiable) {
                    // Clear all salary fields when salary is negotiable
                    formMethods.setValue('salary_mode', '');
                    formMethods.setValue('salary_fixed', '');
                    formMethods.setValue('salary_min', '');
                    formMethods.setValue('salary_max', '');
                    formMethods.clearErrors([
                        'salary_mode',
                        'salary_fixed',
                        'salary_min',
                        'salary_max'
                    ]);
                }
            } else if (name === 'salary_mode') {
                if (value.salary_mode === 'range') {
                    formMethods.setValue('salary_fixed', '');
                    formMethods.clearErrors('salary_fixed');
                } else if (value.salary_mode === 'fixed') {
                    formMethods.setValue('salary_min', '');
                    formMethods.setValue('salary_max', '');
                    formMethods.clearErrors(['salary_min', 'salary_max']);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [formMethods]);

    if (isLoading || FORMATTEDLOADING) return <></>;

    return (
        <div className="max-w-[700px] ">
            <Form {...formMethods}>
                <form>
                    <div className="gap-[72px] mt-[40px] flex items-center w-full">
                        <SelectField
                            name={"project_duration"}
                            labelName={"Project Duration"}
                            labelStyle="text-[20px] font-[500]"
                            error={!!formMethods.formState.errors.project_duration}
                            isRequired={true}
                            height={clsx('border-[#6B6B6B] rounded-[12px] mt-2 h-[45px]')}
                            showRequiredLabel={true}
                            placeholder={"Select the Duration"}
                            data={PROJECT_DURATION_TYPE_DATA}
                            width={clsx('w-[50%] ', !!formMethods.formState.errors.number_of_positions && "mt-[-28px]", !!formMethods.formState.errors.number_of_positions && 'mt-[0px]')}
                        />
                        <InputField
                            fieldName='number_of_positions'
                            languageName=""
                            fieldWidth={clsx("w-[50%]", !!formMethods.formState.errors.project_duration && "mt-[-28px]" )}
                            type="number"
                            labelSize="text-[20px] mb-3 font-[500]"
                            fieldHeight="border-[#6B6B6B] rounded-[12px]"
                            isError={!!formMethods.formState.errors?.number_of_positions}
                            lableName="Number of position"
                            required={true}
                            placeholder="0"
                        />
                    </div>

                    <SelectField
                        name={"salary_type"}
                        labelName={"Salary Type"}
                        labelStyle="text-[20px] font-[500]"
                        error={!!formMethods.formState.errors.salary_type}
                        isRequired={true}
                        showRequiredLabel={true}
                        height="border-[#6B6B6B] rounded-[12px] mt-2 h-12"
                        placeholder={"Monthly"}
                        data={PER_SALARY_TYPE_DATA}
                        width="w-[calc(50%-36px)] mt-[40px]"
                    />

                    <RadioField
                        fieldName={"is_salary_negotiable"}
                        fieldStyle={"mt-[40px] text-[#575757]"}
                        requiredLabel={false}
                        labelStyle={"text-[20px]"}
                        labelName={"If Salary negotiation"}
                        required={false}
                    />

                    {!formMethods.watch('is_salary_negotiable') && (
                        <>
                            <div className="gap-[72px] flex items-center w-full mt-[40px]">

                                <SelectField
                                    name={"salary_mode"}
                                    labelName={"Salary Rate"}
                                    labelStyle="text-[20px] font-[500]"
                                    error={!!formMethods.formState.errors.salary_mode}
                                    isRequired={true}
                                    height="border-[#6B6B6B] rounded-[12px] mt-2 h-12"
                                    showRequiredLabel={true}
                                    placeholder={"Select the salary mode"}
                                    data={SALARY_MODE_TYPE_DATA}
                                    width="w-[calc(50%-36px)]"
                                />
                            </div>

                            <div className="gap-[72px] mt-[40px] flex items-center w-full">
                                <InputField
                                    fieldName={clsx(formMethods?.watch('salary_mode') === 'range' ? 'salary_min' : 'salary_fixed')}
                                    languageName=""
                                    fieldWidth="w-full"
                                    type="text"
                                    formatThousands
                                    labelSize="text-[20px] mb-3 font-[500]"
                                    fieldHeight="border-[#6B6B6B] rounded-[12px]"
                                    isError={formMethods?.watch('salary_mode') === 'range' ? !!formMethods.formState.errors?.salary_min : !!formMethods.formState.errors?.salary_fixed}
                                    lableName={clsx(formMethods?.watch('salary_mode') === 'range' ? 'Minimum Salary' : 'Fixed Salary')}
                                    required={true}
                                    placeholder="0000 MMK"
                                />
                                {formMethods.watch('salary_mode') === 'range' && (
                                    <InputField
                                        fieldName='salary_max'
                                        languageName=""
                                        fieldWidth="w-full"
                                        type="text"
                                        formatThousands
                                        labelSize="text-[20px] mb-3 font-[500]"
                                        fieldHeight="border-[#6B6B6B] rounded-[12px]"
                                        isError={!!formMethods.formState.errors?.salary_max}
                                        lableName="Maximum Salary"
                                        required={true}
                                        placeholder="0000 MMK"
                                    />
                                )}
                            </div>
                        </>
                    )}

                    <DatePickerField
                        labelStyle="text-[20px] mb-3 font-[500]"
                        fieldStyle="mt-[40px]"
                        fieldName={'last_application_date'}
                        labelName="Last Application Date"
                        languageName={""}
                        required={true}
                        fieldHeight={"border-[#6B6B6B] rounded-[12px] h-12"}
                        fieldWidth={"w-full"}
                        placeholder="Last Application Date"
                    />

                    <div className="mt-[40px]">
                        <MultiSelect
                            options={Array.isArray(FORMATTEDDATA) ? FORMATTEDDATA.map(opt => ({ ...opt, value: String(opt.value) })) : []}
                            onValueChange={setSelectedFrameworks}
                            defaultValue={selectedFrameworks}
                            placeholder="Skills"
                            isLabel
                            variant="inverted"
                            animation={2}
                            maxCount={200}
                            className="h-[50px] min-h-[30px] text-[16px] border-[#6B6B6B] rounded-[12px]"
                        />
                    </div>

                    <div className="gap-[72px] mt-[40px] flex items-center w-full">
                        <SelectField
                            name={"experience_level"}
                            labelName={"Experience Level"}
                            labelStyle="text-[20px] font-[500]"
                            error={!!formMethods.formState.errors.experience_level}
                            isRequired={false}
                            height="border-[#6B6B6B] rounded-[12px] h-12"
                            showRequiredLabel={true}
                            placeholder={"Select the Duration"}
                            data={FORMATTEDEXPERIENCE}
                            width="w-[100%]"
                        />
                        <InputField
                            fieldName='experience_years'
                            languageName=""
                            fieldWidth="w-full"
                            type="number"
                            maxLength={2}
                            labelSize="text-[20px] mb-3 font-[500]"
                            fieldHeight="border-[#6B6B6B] rounded-[12px]"
                            isError={!!formMethods.formState.errors?.experience_years}
                            lableName="Years of Experience"
                            required={false}
                            placeholder="0"
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default StepThreeForm;