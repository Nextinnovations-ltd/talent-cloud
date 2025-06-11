import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDropzone } from "react-dropzone";
import InputField from "@/components/common/form/fields/input-field";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Form } from "@/components/ui/form";
import {
  nameFields,
} from "@/lib/formData.tsx/StepperTwoFieldData";
import { SVGProfile, SVGUploadSign } from "@/constants/svgs";
import { ImageEditor } from "@/components/common/ImageEditor";
import { Input } from "@/components/ui/input";
import { useApiCaller } from "@/hooks/useApicaller";
import { useOnBoardingMutation } from "@/services/slices/authSlice";
import useToast from "@/hooks/use-toast";
import { SelectField } from "@/components/common/form/fields/select-field";
import { useFormattedExperience } from "@/lib/dropData.tsx/ReturnExperience";
import { WORKEXPERIENCE } from "@/lib/formData.tsx/CommonData";
import { OnBoardingStepTwoSchema } from "@/lib/OnBoardingStepTwoSchema";


type OnBoardingStepTwoType = {
  image:any,
  name:string,
  level:string,
  workExperience:string,
  tagline:string,
}

const StepTwoForm = ({ goToNextStep }: { goToNextStep: any }) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const { executeApiCall } = useApiCaller(useOnBoardingMutation);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { showNotification } = useToast();
  const { data: EXPERIENCEDATA } = useFormattedExperience();

  const form = useForm<OnBoardingStepTwoType>({
    resolver: yupResolver(OnBoardingStepTwoSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
      name: "",
      tagline:"",
      level:"",
      workExperience:""
    },
  });

  const formValues: any = form.watch();

  useEffect(() => {
    const requiredFields = [
      "name",
      "workExperience",
      "tagline",
      "level"
    ];
    const isFormValid = requiredFields.every((field) => !!formValues[field]);

    setIsButtonDisabled(!isFormValid);
  }, [formValues]);

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("image", acceptedFiles[0]);
        form.clearErrors("image");
        setIsModalOpen(true);
      } catch (error) {
        setPreview(null);
        form.resetField("image");
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5000000,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  });

  const onSubmit = async (values: any) => {
    if (!isButtonDisabled) {
      setIsModalOpen(false);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("country_code", values.countryCode);
      formData.append("address", values.address);
      formData.append("phone_number", values.phone);
      formData.append("step", "1");


      formData.append(
        "date_of_birth",
        `${values.year}-${values.month}-${values.day}`
      );

      // Append image
      if (values.image) {
        formData.append("profile_image", values.image);
      }
      const res = await executeApiCall(formData);

      if (res.success) {
        goToNextStep();
      }
    } else {
      showNotification({
        message: "Please fill in the information!",
        type: "danger",
      });
    }
  };

  const rotateImage = () => {
    setRotation((prevRotation) => prevRotation + 90);
  };

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
      const scaledWidth = image.width;
      const scaledHeight = image.height;

      const rotatedWidth =
        Math.abs(scaledWidth * Math.cos(radians)) +
        Math.abs(scaledHeight * Math.sin(radians));
      const rotatedHeight =
        Math.abs(scaledWidth * Math.sin(radians)) +
        Math.abs(scaledHeight * Math.cos(radians));

      canvas.width = rotatedWidth;
      canvas.height = rotatedHeight;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.scale(scale, scale);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);

      const editedImageUrl = canvas.toDataURL("image/png");

      setPreview(editedImageUrl);

      canvas.toBlob((blob) => {
        if (blob) {
          setIsModalOpen(false);
        }
      }, "image/png");
    };
  };

  return (
    <div className="   ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="  space-y-14 w-full "
        >
          <div className="flex gap-[40px] md:gap-0  flex-col-reverse  md:flex-row w-full  justify-between">
            <div className=" space-y-4 md:w-[50%]">
              {/* Form Fields */}
              {nameFields.map((field) => (
                <InputField
                  key={field.fieldName}
                  fieldName={field.fieldName}
                  placeholder={field.placeholder}
                  isError={field.isError(form)}
                  required={field.required}
                  description={field.description}
                  descriptionText={field.descriptionText}
                  requiredLabel={field.requiredLabel}
                  type={field.type}
                  languageName={"stepTwo"}
                  fieldHeight={""}
                  fieldWidth={""}
                />
              ))}
              <SelectField
                name={"level"}
                labelName={'Level'}
                isRequired={true}
                error={!!form.formState.errors.level}
                showRequiredLabel={true}
                placeholder={"eg. Junior Level"}
                data={EXPERIENCEDATA}
                width=" max-w-[672px] mt-[24px]"
              />
              <SelectField
                name={"workExperience"}
                labelName={'Work Experience'}
                isRequired={true}
                error={!!form.formState.errors.workExperience}
                showRequiredLabel={true}
                placeholder={"eg. Less than 1 year"}
                data={WORKEXPERIENCE}
                width=" max-w-[672px] mt-[24px]"
              />

              {/* <div>
                <p className="mb-[7px]">{t("phoneNumber")}</p>
                <div className="flex items-center  gap-[16px]">
                  <PhoneNumberInput
                    value={form.getValues("countryCode")}
                    setValue={(e: any) => form.setValue("countryCode", e)}
                  />
                  {phoneNumberFields.map((field) => (
                    <InputField
                      key={field.fieldName}
                      fieldName={field.fieldName}
                      placeholder={field.placeholder}
                      isError={field.isError(form)}
                      required={field.required}
                      requiredLabel={field.requiredLabel}
                      type={field.type}
                      languageName={"stepTwo"}
                      fieldHeight={""}
                      fieldWidth={"w-full"}
                    />
                  ))}
                </div>
              </div> */}

              {/* <div>
                <p className="mb-[7px]">{t("dateOfBirth")}</p>
                <div className="flex items-center gap-[16px]">
                  {dateOFBirthFields.map((field) => (
                    <InputField
                      key={field.fieldName}
                      fieldName={field.fieldName}
                      placeholder={field.placeholder}
                      isError={field.isError(form)}
                      required={field.required}
                      requiredLabel={field.requiredLabel}
                      type={field.type}
                      languageName={""}
                      fieldHeight={""}
                      fieldWidth={"w-[85px]"}
                    />
                  ))}
                </div>
              </div> */}

              {/* {addressFields.map((field) => (
                <InputField
                  key={field.fieldName}
                  fieldName={field.fieldName}
                  placeholder={field.placeholder}
                  isError={field.isError(form)}
                  required={field.required}
                  requiredLabel={field.requiredLabel}
                  type={field.type}
                  languageName={"stepTwo"}
                  fieldHeight={""}
                  fieldWidth={""}
                />
              ))} */}
            </div>

            {/* Image Uploader */}
            <div className="md:w-[50%]  flex flex-col items-center justify-start">
              <div
                {...getRootProps()}
                className={`w-[187px] border-2 relative h-[187px] rounded-full cursor-pointer flex items-center  justify-center  transition-all duration-300 ${isDragActive
                  ? "border-2 border-dashed border-[#0389FF] bg-[#0389ff88]"
                  : " border-gray-300"
                  }`}
              >
                <div className="absolute z-30 bottom-[10px]  right-[10px]">
                  <SVGUploadSign />
                </div>
                {preview ? (
                  <div
                    style={{
                      width: "99%",
                      height: "99%",
                      overflow: "hidden",
                    }}
                    className="rounded-full"
                  >
                    <img
                      src={preview as string}
                      alt="Uploaded image"
                      className="rounded-full"
                      style={{
                        transition: "transform 0.3s ease",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                ) : (
                  <SVGProfile />
                )}
                {isDragActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <p className="text-white text-lg font-medium">
                      Drop the image!
                    </p>
                  </div>
                )}
                <Input {...getInputProps()} type="file" />
              </div>
              <p className="text-[#686C73] mt-[25px]">
                Upload your profile picture to stand out.
                {/* <div className="" {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  )}
                </div> */}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-[200px]">
            <PrimaryButton
              title="Continue"
              isButtonDisabled={isButtonDisabled}
            />
          </div>
        </form>
      </Form>

      {/* Modal for Image Editing */}
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

export default StepTwoForm;
