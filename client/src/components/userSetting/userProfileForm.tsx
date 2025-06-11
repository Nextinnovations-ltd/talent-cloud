import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import InputField from "../common/form/fields/input-field";
import TextAreaField from "../common/form/fields/text-area-field";
import { PhoneNumberInput } from "../common/PhoneNumberInput";
import { ImageEditor } from "../common/ImageEditor";
import { SVGProfile } from "@/constants/svgs";
import { cn } from "@/lib/utils";
import { fields } from "@/lib/formData.tsx/UserProfile";
import { Button } from "../ui/button";
import DatePickerField from "../common/form/fields/date-picker-field";
import { SelectField } from "../common/form/fields/select-field";
import { useFormattedSpecialization } from "@/lib/dropData.tsx/ReturnSpecialization";
import { useFormattedExperience } from "@/lib/dropData.tsx/ReturnExperience";

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
  const { t } = useTranslation("stepTwo");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const { data: FORMATTEDDATA } = useFormattedSpecialization();
  const { data: EXPERIENCEDATA } = useFormattedExperience();

  const fieldHeight = "h-12";
  const fieldWidth = "max-w-[672px]";

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(acceptedFiles[0]);
      form.setValue("profile_image_url", acceptedFiles[0]);
      form.clearErrors("profile_image_url");
      setIsModalOpen(true);
    },
    [form]
  );

  const rotateImage = () => setRotation((prev) => prev + 90);

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  };

  const saveEditedImage = () => {
    if (!preview) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.src = preview as string;

    image.onload = () => {
      const radians = (rotation * Math.PI) / 180;
      const { width, height } = image;

      const rotatedWidth =
        Math.abs(width * Math.cos(radians)) +
        Math.abs(height * Math.sin(radians));
      const rotatedHeight =
        Math.abs(width * Math.sin(radians)) +
        Math.abs(height * Math.cos(radians));

      canvas.width = rotatedWidth;
      canvas.height = rotatedHeight;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.scale(scale, scale);
      ctx.drawImage(image, -width / 2, -height / 2);

      setPreview(canvas.toDataURL("image/png"));

      canvas.toBlob((blob) => {
        if (blob) setIsModalOpen(false);
      }, "image/png");
    };
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5000000,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    noDrag: true,
  });

  return (
    <div className="space-y-[30px] my-4">
      <div className="md:w-[50%] flex gap-[30px] items-center">
        <div
          {...getRootProps()}
          className="w-[110px] h-[110px] rounded-full cursor-pointer flex items-center justify-center bg transition-all duration-300"
        >
          {preview ? (
            <img
              src={preview as string}
              alt="Uploaded"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <SVGProfile />
          )}
        </div>
        <div>
          <Button
            type="button"
            className="p-0 w-[139px] text-white h-[45px] bg-[#0389FF]"
          >
            <div {...getRootProps({ noDrag: true })} className="p-0">
              Change photo
              <input type="file" {...getInputProps()} className="hidden" />
            </div>
          </Button>
          <Button
            type="button"
            className="p-0 w-[139px] shadow-none h-[45px] bg-white text-black"
            onClick={() => setIsOpen(true)}
          >
            <h3 className="font-bold">Remove</h3>
          </Button>
        </div>
      </div>

      {fields.map((field) => {
        if (field.type === "date") {
          return (
            <DatePickerField
              fieldName={field.fieldName}
              required={field.required}
              languageName={field.languageName}
              placeholder={field.placeholder}
              fieldHeight={cn(" w-full", fieldHeight)}
              fieldWidth={""}
            />
          );
        }

        if (field.type === "select") {
          return (
            <SelectField
              name={field.fieldName}
              labelName={field.labelName}
              error={field.isError(form)}
              showRequiredLabel={field.requiredLabel}
              placeholder={field.placeholder}
              data={
                field.fieldName === "specialization_id"
                  ? FORMATTEDDATA
                  : EXPERIENCEDATA
              }
              width=" max-w-[672px] mt-[24px]"
            />
          );
        }

        if (field.type === "phoneNumber") {
          return (
            <div key={field.fieldName}>
              <p className="mb-[7px] font-semibold">{t("phoneNumber")}</p>
              <div className="flex items-center gap-[16px]">
                <PhoneNumberInput
                  isError={form.formState.errors?.country_code}
                  value={form.getValues("country_code")}
                  setValue={(e: any) => form.setValue("country_code", e)}
                />
                {field.chilField?.map((childField: any) => (
                  <InputField
                    key={childField.fieldName}
                    fieldName={childField.fieldName}
                    placeholder={childField.placeholder}
                    isError={childField.isError(form)}
                    required={childField.required}
                    requiredLabel={childField.requiredLabel}
                    type={childField.type}
                    languageName={"stepTwo"}
                    fieldWidth="w-full max-w-[497px]"
                    fieldHeight={""}
                  />
                ))}
              </div>
            </div>
          );
        }

        if (field.type === "textArea") {
          return (
            <TextAreaField
              key={field.fieldName}
              disabled={false}
              fieldName={field.fieldName}
              placeholder={field.placeholder}
              isError={field.isError(form)}
              required={field.required}
              requiredLabel={field.requiredLabel}
              languageName={field.languageName}
              fieldHeight={field.height ?? "h-[128px]"}
              fieldWidth={fieldWidth}
              showLetterCount={field.showLetterCount}
              maxLength={field.maxLength}
              description={field.description}
              descriptionText={field.descriptionText}
            />
          );
        }

        return (
          <InputField
            key={field.fieldName}
            disabled={false}
            fieldName={field.fieldName}
            placeholder={field.placeholder}
            isError={field.isError(form)}
            required={field.required}
            requiredLabel={field.requiredLabel}
            type={field.type}
            languageName={field.languageName}
            fieldHeight={cn("w-full", fieldHeight)}
            fieldWidth={fieldWidth}
            showLetterCount={field.showLetterCount}
            maxLength={field.maxLength}
            description={field.description}
            descriptionText={field.descriptionText}
          />
        );
      })}

      <ImageEditor
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        preview={preview}
        rotation={rotation}
        scale={scale}
        handleScaleChange={handleScaleChange}
        saveEditedImage={saveEditedImage}
        rotateImage={rotateImage}
      />
    </div>
  );
};
