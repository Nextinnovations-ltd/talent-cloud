import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Form } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import InputField from "@/components/common/form/fields/input-field";
import { yupResolver } from "@hookform/resolvers/yup";
import { CertificationYupSchema } from "@/lib/CertificationSchema";
import { SelectField } from "@/components/common/form/fields/select-field";
import CustomCheckbox from "@/components/common/form/fields/checkBox-field";
import { MONTHDATA } from "@/lib/formData.tsx/CommonData";
import { useAddCertificationMutation, useGetCerificationByIdQuery,} from "@/services/slices/jobSeekerSlice";
import { useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import clsx from "clsx";
import useToast from "@/hooks/use-toast";


type CertificationFormType = {
  certificationName: string;
  organizationIssue: string;
  issueYear: string;
  issueMonth: string;
  expirationYear: string;
  expirationMonth: string;
  noExpired: boolean;
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


  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {showNotification} = useToast();
  const id = searchParams.get("id");

  const [addCertification, { isLoading }] = useAddCertificationMutation();
  const { data: CertificationData, isLoading: getLoadiing } = useGetCerificationByIdQuery(id, { skip: !id });

  console.log(CertificationData)

 // const CertificationData = {
 //   "id": 1,
  //  "title": "Test",
  //  "organization": "Test",
  //  "issued_date": "2010-02-01",
  //  "expiration_date": "2000-01-01",
  //  "has_expiration_date": true,
  //  "url": "https://www.facebook.com",
  //  "user": 1
 // }

 




  const form = useForm<CertificationFormType>({
    resolver: yupResolver(CertificationYupSchema),
    defaultValues: {
      noExpired: false,
    },
  });

  useEffect(()=>{
  console.log(form.getValues())
  },[form])

  useEffect(() => {
    if (id && CertificationData) {
      form.reset({
        certificationName: CertificationData.title || "",
        organizationIssue: CertificationData.organization || "",
        issueYear: CertificationData.issued_date ? CertificationData.issued_date.split("-")[0] : "",
        issueMonth: CertificationData.issued_date ? CertificationData.issued_date.split("-")[1] : "",
        expirationYear: CertificationData.has_expiration_date && CertificationData.expiration_date
          ? CertificationData.expiration_date.split("-")[0]
          : "",
        expirationMonth: CertificationData.has_expiration_date && CertificationData.expiration_date
          ? CertificationData.expiration_date.split("-")[1]
          : "",
        noExpired: !CertificationData.has_expiration_date,
        credentialURL: CertificationData.url || "",
      });
    }
  }, [id, CertificationData, form]);

  const onSubmit = async (data: CertificationFormType) => {
    try {
      // Transform form data to match API payload format
      const payload = {
        title: data.certificationName,
        organization: data.organizationIssue,
        issued_date: `${data.issueYear}-${data.issueMonth.padStart(2, '0')}-01`,
        expiration_date: data.noExpired ? "" : `${data.expirationYear}-${data.expirationMonth.padStart(2, '0')}-01`,
        has_expiration_date: !data.noExpired,
        url: data.credentialURL || ""
      };

      await addCertification(payload).unwrap();
      navigate('/user/mainProfile')

      console.log('Certification added successfully');
    } catch (error) {
      console.error('Failed to add certification:', error);
    }
  };

  // Watch the value of the 'noExpired' field
  const noExpired = useWatch({
    control: form.control,
    name: "noExpired",
    defaultValue: false,
  });

  if(getLoadiing) return <p>Loading...</p>

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
                disabled={isLoading}
                className={clsx("mt-4  h-[48px] rounded-[26px] bg-blue-500 text-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed justify-center items-center",id? 'w-[200px] ' : 'w-[165px]')}
              >
                {isLoading ? <LoadingSpinner /> : id ? "Update Experience" : "Save Experience"}
              </button>
            </div>
          </div>
          {/* </motion.div> */}
        </form>
      </Form>
    </div>
  );
};