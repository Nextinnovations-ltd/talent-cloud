/* eslint-disable @typescript-eslint/no-explicit-any */
import InputField from "../common/form/fields/input-field";
import TextAreaField from "../common/form/fields/text-area-field";
import { PhoneNumberInput } from "../common/PhoneNumberInput";
import { cn } from "@/lib/utils";
import DatePickerField from "../common/form/fields/date-picker-field";
import { SelectField } from "../common/form/fields/select-field";
import { useFormattedSpecialization } from "@/lib/dropData.tsx/ReturnSpecialization";
import { useFormattedExperience } from "@/lib/dropData.tsx/ReturnExperience";
import ImagePicker from "../common/ImagePicker";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { socialLinkFields } from "@/lib/formData.tsx/UserProfile";
import { useFormattedCountryList } from "@/lib/dropData.tsx/ReturnCountryListOptions";
import { useFormattedCityList } from "@/lib/dropData.tsx/ReturnCityListOptions";
import { useFormattedRolesBySpecializationList } from "@/lib/dropData.tsx/ReturnRoleOptionsBySpecialization";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { PageInitialLoading } from "../common/PageInitialLoading";
import clsx from "clsx";
import { useEffect, useRef } from "react";


export const UserProfileForm = ({
  form,
  setIsOpen,
  preview,
  setPreview,
  isSubmitting
}: {
  form: any;
  setIsOpen: any;
  preview: any;
  setPreview: any;
  isSubmitting: boolean
}) => {

  const selectedCountryId = form.watch("country");
  const selectedSpecializationId = form.watch("specializations");
  const { data: SPECIALIZATIONDATA, isLoading: FORMATTEDDATALoading } = useFormattedSpecialization();
  const { data: EXPERIENCEDATA, isLoading: EXPERIENCEDATALoading } = useFormattedExperience();
  const { data: COUNTRYDATA, isLoading: COUNTRYLoading } = useFormattedCountryList();
  const { data: CITYDATA, isLoading: CITYLoading } = useFormattedCityList(selectedCountryId);
  const { data: ROLEDATA, isLoading: ROLELoading,isSuccess: isSuccessRole } = useFormattedRolesBySpecializationList(selectedSpecializationId);



  const selectedRole = form.watch("role");
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
        form.setValue('role', '');
      }
    }
  }, [selectedSpecializationId, ROLEDATA, isSuccessRole]);
  
  
  



  const fieldHeight = "h-12";
  const fieldWidth = "max-w-[672px]";

  const loading = FORMATTEDDATALoading || EXPERIENCEDATALoading || COUNTRYLoading || ROLELoading




  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
      <PageInitialLoading/>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-[30px] my-4">

        <ImagePicker
          setIsOpen={setIsOpen}
          preview={preview}
          form={form}
          setPreview={setPreview} imageUploadType={"profile"} />

        <InputField
          fieldName="name"
          placeholder={'Choose your own nickname'}
          isError={form.formState.errors.name}
          required={true}
          requiredLabel={true}
          type="text"
          languageName="userProfile"
          maxLength={20}
          showLetterCount={true}
          fieldHeight={cn("w-full", fieldHeight)}
          fieldWidth={fieldWidth} />

        <InputField
          fieldName="username"
          placeholder={'Set your ID so that users can search for you'}
          isError={form.formState.errors.username}
          required={true}
          requiredLabel={true}
          type="text"
          languageName="userProfile"
          maxLength={20}
          showLetterCount={true}
          fieldHeight={cn("w-full", fieldHeight)}
          fieldWidth={fieldWidth}
          description={true}
          descriptionText={"* Username can only be changed once per 7 days"}
        />

        <div className="flex items-center space-x-4">
          <Switch
            id="is_open_to_work"
            className=""
            checked={form.watch("is_open_to_work")}
            onCheckedChange={(checked: boolean) => form.setValue("is_open_to_work", checked)}
          />
          <label htmlFor="is_open_to_work" className="text-sm font-medium">
          Avaliable for work
          </label>
        </div>

        <InputField
          fieldName="tagline"
          placeholder={'eg. Frontend Developer Lead at Google'}
          isError={form.formState.errors.tagline}
          required={true}
          requiredLabel={true}
          type="text"
          languageName="userProfile"
          maxLength={50}
          showLetterCount={true}
          fieldHeight={cn("w-full", fieldHeight)}
          fieldWidth={fieldWidth}
          description={true}
          descriptionText={"The community will see job title after your name"}
        />

        <Separator />

        <SelectField
          name={"specializations"}
          labelName={"Specializations"}
          error={form.formState.errors.role}
          isRequired={true}
          showRequiredLabel={true}
          placeholder={"eg. Web / Animation"}
          data={SPECIALIZATIONDATA}
          width=" max-w-[672px] mt-[24px]"
          description="System use only for job filtering and will not be visible to users."
        />

        <SelectField
          name={"role"}
          labelName={"Role"}
          error={form.formState.errors.role}
          isRequired={true}
          showRequiredLabel={true}
          placeholder={"eg. Development & IT/ Frontend Developer"}
          data={ROLEDATA}
          width=" max-w-[672px] mt-[24px]"
          description="System use only for job filtering and will not be visible to users."
        />

       <div className="flex gap-5 mt-[24px] max-w-[672px]  ">
       <SelectField
          name={"experience_level"}
          labelName={"Level"}
          error={form.formState.errors.role}
          isRequired={true}
          showRequiredLabel={true}
          placeholder={"eg. Junior Level"}
          data={EXPERIENCEDATA}
          width=" max-w-[672px] w-[calc(50%-10px)] mt-[6px] "
        />

        <InputField
          fieldName="experience_years"
          placeholder={'3'}
          isError={form.formState.errors.username}
          required={true}
          requiredLabel={true}
          type="number"
          languageName="userProfile"
          maxLength={3}
          showLetterCount={true}
          fieldHeight={cn("w-full" , fieldHeight,'mt-[1px]')}
          fieldWidth={clsx(fieldWidth, 'w-[calc(50%-10px)] mt-[10px] ')}
        />
       </div>

        <TextAreaField
          disabled={false}
          fieldName={'bio'}
          placeholder={'A brief introduction about yourself'}
          isError={form.formState.errors.bio}
          required={false}
          requiredLabel={true}
          languageName={"userProfile"}
          fieldHeight={"h-[128px]"}
          fieldWidth={fieldWidth}
          showLetterCount={true}
          maxLength={250}
        />
        <h3 className="text-[14px]">This  personal information's is only show for recruiter <span className="text-red-500">* </span></h3>

        <InputField
          fieldName="email"
          placeholder={'user@example.com'}
          isError={form.formState.errors.email}
          required={false}
          readOnly
          requiredLabel={true}
          disabled
          type="text"
          languageName="userProfile"
          maxLength={50}
          showLetterCount={true}
          fieldHeight={cn("w-full", fieldHeight)}
          fieldWidth={fieldWidth}
        />

        <div>
          <p className="mb-[7px] font-semibold">Phone Number</p>
          <div className="flex items-center gap-[16px]">
            <PhoneNumberInput
              isError={form.formState.errors?.country_code}
              value={form.getValues("country_code")}
              setValue={(e: any) => form.setValue("country_code", e)}
            />
            <InputField
              fieldName={'phone_number'}
              placeholder={'Enter your phone number'}
              isError={form.formState.errors?.phone_number}
              required={false}
              requiredLabel={false}
              type={'text'}
              languageName={"stepTwo"}
              fieldWidth={`w-full max-w-[497px] mt-[4px]  ${form.formState.errors?.phone_number && 'mt-[30px]'}`}
              fieldHeight={""}
            />

          </div>
        </div>

        <DatePickerField
          fieldName={'date_of_birth'}
          required={false}
          languageName={'userProfile'}
          fieldHeight={cn(" max-w-[672px]  w-full", fieldHeight)}
          fieldWidth={""}
        />

        {/* ---------- */}

        <SelectField
          name={"country"}
          labelName={"Country"}
          error={form.formState.errors.country}
          isRequired={true}
          showRequiredLabel={true}
          placeholder={"Please select the country"}
          data={COUNTRYDATA}
          width=" max-w-[672px] mt-[24px]"
        />

        <SelectField
          name={"city"}
          labelName={"City"}
          error={form.formState.errors.city}
          isRequired={true}
          showRequiredLabel={true}
          placeholder={"Please select the city"}
          data={CITYDATA}
          width=" max-w-[672px] mt-[24px]"
          isDisabled={CITYLoading}
        />

        {/* ---------- */}

        <InputField
          fieldName="address"
          placeholder={'Choose your address'}
          isError={form.formState.errors.address}
          required={false}
          requiredLabel={true}
          type="text"
          languageName="userProfile"
          maxLength={50}
          showLetterCount={true}
          fieldHeight={cn("w-full", fieldHeight)}
          fieldWidth={fieldWidth}
        />

        {socialLinkFields.map((field) => (
          <InputField
            key={field.fieldName}
            fieldName={field.fieldName}
            isError={field.isError?.(form)}
            startIcon={field.startIcon}
            languageName={"userProfile"}
            required={false}
            placeholder=""
          />
        ))}
      </div>
      <div className="mt-[60px] ">
        <div className="max-w-[672px] flex items-center justify-end">
          <Button
            type="submit"
            title="Save Button"
            className="w-[155px] disabled:bg-[#78acda] mt-[30px] h-[48px] bg-[#0389FF] text-white rounded-[30px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner /> : "Save Profile"}
          </Button>
        </div>
      </div>
    </>
  );
};
