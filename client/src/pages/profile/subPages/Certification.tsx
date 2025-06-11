import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Form } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import InputField from "@/components/common/form/fields/input-field";
import { yupResolver } from "@hookform/resolvers/yup";
import { CertificationYupSchema } from "@/lib/CertificationSchema";
import { SelectField } from "@/components/common/form/fields/select-field";
import CustomCheckbox from "@/components/common/form/fields/checkBox-field";
import { MONTHDATA } from "@/lib/formData.tsx/CommonData";

type CertificationFormType = {
  certificationName: string;
  organizationIssue: string;
  issueYear: string;
  issueMonth: string;
  expirationYear: string;
  expirationMonth: string;
  noExpired: boolean;
  credentialId: string;
  credentialURL: string;
};


const generateYearData = (
  startYear = 2000,
  endYear = new Date().getFullYear()
) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    const year = (startYear + index).toString();
    return { value: year, label: year };
  });
};

export const Certification = () => {
  const form = useForm<CertificationFormType>({
    resolver: yupResolver(CertificationYupSchema),
    defaultValues: {
      noExpired: false,
    },
  });

  const onSubmit = (data: CertificationFormType) => console.log(data);

  // Watch the value of the 'noExpired' field
  const noExpired = useWatch({
    control: form.control,
    name: "noExpired",
    defaultValue: false,
  });

  return (
    <div className="mb-[120px]">
      <ProfileTitle title="Certification" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* <motion.div
            key={1}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          > */}
          <div className="mb-4 space-y-[30px] max-w-[672px]">
            <InputField
              fieldName={`certificationName`}
              languageName=""
              isError={!!form.formState.errors?.certificationName}
              lableName="Name of Certification"
              required={false}
              placeholder="Name"
              maxLength={60}
              showLetterCount
            />
            <InputField
              fieldName={`organizationIssue`}
              languageName=""
              isError={!!form.formState.errors?.organizationIssue}
              lableName="Issuing organization"
              required={false}
              placeholder="Organization"
              maxLength={60}
              showLetterCount
            />
            <div className="flex max-w-[672px] gap-4">
              <SelectField
                name={`issueYear`}
                placeholder="Year"
                error={!!form.formState.errors?.issueYear}
                showRequiredLabel
                labelName="Issue Date"
                data={generateYearData()}
                width="w-[50%]"
              />
              <SelectField
                name={`issueMonth`}
                placeholder="Month"
                error={!!form.formState.errors?.issueMonth}
                showRequiredLabel
                labelName=""
                data={MONTHDATA}
                width="w-[50%] mt-[24px]"
              />
            </div>

            {/* Animate the Expiration Date fields */}
            {/* <AnimatePresence> */}
            {!noExpired && (
              // <motion.div
              //   initial={{ opacity: 0, height: 0 }}
              //   animate={{ opacity: 1, height: "auto" }}
              //   exit={{ opacity: 0, height: 0 }}
              //   transition={{ duration: 0.3, ease: "easeInOut" }}
              // >
              <div className="flex max-w-[672px] gap-4">
                <SelectField
                  name={`expirationYear`}
                  placeholder="Year"
                  error={!!form.formState.errors?.expirationYear}
                  showRequiredLabel
                  labelName="Expiration Date"
                  data={generateYearData()}
                  width="w-[50%]"
                />
                <SelectField
                  name={`expirationMonth`}
                  placeholder="Month"
                  error={!!form.formState.errors?.expirationMonth}
                  showRequiredLabel
                  labelName=""
                  data={MONTHDATA}
                  width="w-[50%] mt-[24px]"
                />
              </div>
              // </motion.div>
            )}
            {/* </AnimatePresence> */}

            <CustomCheckbox
              form={form}
              fieldName={`noExpired`}
              text={"The credential does not expire"}
              typeStyle="mono"
            />
            <InputField
              fieldName={`credentialId`}
              languageName=""
              isError={!!form.formState.errors?.credentialId}
              lableName="Credential ID"
              required={false}
              placeholder="ID"
            />
            <InputField
              fieldName={`credentialURL`}
              languageName=""
              isError={!!form.formState.errors?.credentialURL}
              lableName="Credential URL"
              required={false}
              placeholder="URL"
            />
            <div className="max-w-[672px] flex items-center justify-end">
              <button
                type="submit"
                className="mt-4 w-[155px] h-[48px] rounded-[26px] bg-blue-500 text-white px-4 py-2"
              >
                Save Profile
              </button>
            </div>
          </div>
          {/* </motion.div> */}
        </form>
      </Form>
    </div>
  );
};