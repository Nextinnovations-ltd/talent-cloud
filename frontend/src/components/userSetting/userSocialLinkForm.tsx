import { socialLinkFields } from "@/lib/formData.tsx/UserProfile";
import InputField from "../common/form/fields/input-field";

export const UserSocialLinkForm = ({ form }: { form: any }) => {

  return (
    <div className="space-y-[30px] my-4 ">
      {socialLinkFields.map((field) => {
        return (
          <InputField
            key={field.fieldName}
            fieldName={field.fieldName}
            isError={field.isError?.(form)}
            startIcon={field.startIcon}
            languageName={"userProfile"}
            required={false}
          />
        );
      })}
    </div>
  );
};
