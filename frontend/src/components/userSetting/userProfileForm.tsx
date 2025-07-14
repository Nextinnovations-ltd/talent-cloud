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

export const UserProfileForm = ({
  form,
  setIsOpen,
  preview,
  setPreview,
}: {
  form: any;
  setIsOpen: any;
  preview: any;
  setPreview: any;
}) => {

  const selectedCountryId = form.watch("country");
  const { data: FORMATTEDDATA, isLoading: FORMATTEDDATALoading } = useFormattedSpecialization();
  const { data: EXPERIENCEDATA, isLoading: EXPERIENCEDATALoading } = useFormattedExperience();
  const { data:COUNTRYDATA, isLoading:COUNTRYLoading } = useFormattedCountryList();
  const { data: CITYDATA, isLoading: CITYLoading } = useFormattedCityList(selectedCountryId);


  console.log(CITYDATA)


  const fieldHeight = "h-12";
  const fieldWidth = "max-w-[672px]";

  const loading = FORMATTEDDATALoading || EXPERIENCEDATALoading ||COUNTRYLoading 

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
       
      </div>
    );
  }

  return (
    <div className="space-y-[30px] my-4">

      <ImagePicker
        setIsOpen={setIsOpen}
        preview={preview}  
        form={form}
        setPreview={setPreview} />

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

      <div className="flex items-center space-x-2">
        <Switch
          id="is_open_to_work"
          className=""
          checked={form.watch("is_open_to_work")}
          onCheckedChange={(checked: boolean) => form.setValue("is_open_to_work", checked)}
        />
        <label htmlFor="is_open_to_work" className="text-sm font-medium">
          Open to work
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
        name={"role"}
        labelName={"Specialization Role"}
        error={form.formState.errors.role}
        isRequired={true}
        showRequiredLabel={true}
        placeholder={"eg. Development & IT/ Frontend Developer"}
        data={FORMATTEDDATA}
        width=" max-w-[672px] mt-[24px]"
        description="System use only for job filtering and will not be visible to users."
      />

      <SelectField
        name={"experience_level"}
        labelName={"Level"}
        error={form.formState.errors.role}
        isRequired={true}
        showRequiredLabel={true}
        placeholder={"eg. Junior Level"}
        data={EXPERIENCEDATA}
        width=" max-w-[672px] mt-[24px]"
      />

      <InputField
        fieldName="experience_years"
        placeholder={'3'}
        isError={form.formState.errors.username}
        required={true}
        requiredLabel={true}
        type="number"
        languageName="userProfile"
        maxLength={20}
        showLetterCount={true}
        fieldHeight={cn("w-full", fieldHeight)}
        fieldWidth={fieldWidth}
      />

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
        requiredLabel={true}
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
            fieldWidth="w-full max-w-[497px]"
            fieldHeight={""}
          />

        </div>
      </div>

      <DatePickerField
        fieldName={'date_of_birth'}
        required={false}
        languageName={'userProfile'}
        fieldHeight={cn(" w-full", fieldHeight)}
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
  );
};
