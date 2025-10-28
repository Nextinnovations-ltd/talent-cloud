/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "@/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import InputField from "@/components/common/form/fields/input-field";
import { yupResolver } from "@hookform/resolvers/yup";
import { CertificationYupSchema } from "@/lib/CertificationSchema";
import { SelectField } from "@/components/common/form/fields/select-field";
import CustomCheckbox from "@/components/common/form/fields/checkBox-field";
import { MONTHDATA } from "@/lib/formData.tsx/CommonData";
import { useAddCertificationMutation, useGetCerificationByIdQuery, useUpdateCertificationMutation,} from "@/services/slices/jobSeekerSlice";
import { useEffect,forwardRef, useImperativeHandle } from "react";
import useToast from "@/hooks/use-toast";


type CertificationFormType = {
  certificationName: string;
  organizationIssue: string;
  issueYear: string;
  issueMonth: string;
  expirationYear?: string;
  expirationMonth?: string;
  noExpired: boolean;
  credentialURL?: string;
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

type CertificateProps = {
  certificateId?:number | null;
  setShowDialog: (val:boolean)=> void
}

export const Certification = forwardRef<any, CertificateProps>(({ certificateId, setShowDialog }, ref) => {


  const {showNotification} = useToast();
  const [addCertification, { isLoading }] = useAddCertificationMutation();
  const { data: CertificationData, isLoading: getLoadiing } = useGetCerificationByIdQuery(certificateId, { skip: !certificateId });
  const [updateCertification,{isLoading:isUpading}]  = useUpdateCertificationMutation();

  //@ts-ignore
  const CERTIFICATIONDATA = CertificationData?.data;

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
      certificationName: "",
      organizationIssue: "",
      issueYear: "",
      issueMonth: "",
      expirationYear: "",
      expirationMonth: "",
      noExpired: false,
      credentialURL: "",
    },
  });

  useEffect(() => {
    if (certificateId && CERTIFICATIONDATA) {
      form.reset({
        certificationName: CERTIFICATIONDATA.title || "",
        organizationIssue: CERTIFICATIONDATA.organization || "",
        issueYear: CERTIFICATIONDATA.issued_date ? CERTIFICATIONDATA.issued_date.split("-")[0] : "",
        issueMonth: CERTIFICATIONDATA.issued_date ? CERTIFICATIONDATA.issued_date.split("-")[1] : "",
        expirationYear: CERTIFICATIONDATA.has_expiration_date && CERTIFICATIONDATA.expiration_date
          ? CERTIFICATIONDATA.expiration_date.split("-")[0]
          : "",
        expirationMonth: CERTIFICATIONDATA.has_expiration_date && CERTIFICATIONDATA.expiration_date
          ? CERTIFICATIONDATA.expiration_date.split("-")[1]
          : "",
        noExpired: !CERTIFICATIONDATA.has_expiration_date,
        credentialURL: CERTIFICATIONDATA.url || "",
      });
    }
  }, [certificateId, CERTIFICATIONDATA, form]);

  const onSubmit = async (data: CertificationFormType) => {
    try {
      // Transform form data to match API payload format
      const payload = {
        title: data.certificationName,
        organization: data.organizationIssue,
        issued_date: `${data.issueYear}-${data.issueMonth.padStart(2, '0')}-01`,
        expiration_date: data.noExpired ? "" : `${data.expirationYear || ""}-${(data.expirationMonth || "01").padStart(2, '0')}-01`,
        has_expiration_date: !data.noExpired,
        url: data.credentialURL || ""
      };

      let response;
      if (certificateId) {
        // Update mode
        response = await updateCertification({ id: certificateId, credentials: payload }).unwrap();
      } else {
        // Add mode
        response = await addCertification(payload).unwrap();

      }
      // Reset form with new data if needed
      if (response) {
       
        showNotification({ message: certificateId ? "Certification updated successfully" : "Certification added successfully", type: "success" });
        setShowDialog(false);
      }
    } catch (error) {
      showNotification({ message: 'Failed to save certification', type: "danger" });
      console.error('Failed to save certification:', error);
    }
  };

  // Watch the value of the 'noExpired' field
  const noExpired = useWatch({
    control: form.control,
    name: "noExpired",
    defaultValue: false,
  });


  useImperativeHandle(ref, () => ({
    submitForm: () => {
       //@ts-ignore
      form.handleSubmit(onSubmit)();
    },
  }));

  const LOADING =  isLoading || isUpading;

  if(getLoadiing) return <p>Loading...</p>

  return (
    <div className="mt-[20px]">
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
              required={true}
              placeholder="Name"
              maxLength={60}
              showLetterCount
              disabled={LOADING}
            />
            <InputField
              fieldName={`organizationIssue`}
              languageName=""
              isError={!!form.formState.errors?.organizationIssue}
              lableName="Issued organization"
              required={true}
              placeholder="Organization"
              maxLength={60}
              showLetterCount
              disabled={LOADING}
            />
            <div className="flex max-w-[672px] gap-4">
              <SelectField
                name={`issueYear`}
                placeholder="Year"
                error={!!form.formState.errors?.issueYear}
                showRequiredLabel
                labelName="Issued Date"
                data={generateYearData()}
                width="w-[50%]"
                isRequired
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
                  isRequired
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
             {form.formState.errors && (form.formState.errors as Record<string, { message?: string; type?: string }>)[""] && (form.formState.errors as Record<string, { message?: string; type?: string }>)[""]?.type === "end-date-after-start-date" && (
              <div className="text-red-500 font-medium text-[0.8rem] mt-1">
               {(form.formState.errors as Record<string, { message?: string; type?: string }>)[""]?.message}
              </div>
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
              disabled={LOADING}
            />
          </div>
          {/* </motion.div> */}
        </form>
      </Form>
    </div>
  );
});