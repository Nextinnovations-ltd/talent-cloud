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
import { useOnBoardingMutation } from "@/services/slices/authSlice";
import useToast from "@/hooks/use-toast";
import { SelectField } from "@/components/common/form/fields/select-field";
import { useFormattedExperience } from "@/lib/dropData.tsx/ReturnExperience";
import { OnBoardingStepTwoSchema } from "@/lib/OnBoardingStepTwoSchema";


type OnBoardingStepTwoType = {
  image: File | null;
  name: string;
  level: string;
  workExperience: string;
  tagline: string;
};

const StepTwoForm = ({ goToNextStep }: { goToNextStep: () => void }) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  // Remove useApiCaller and use useOnBoardingMutation directly
  const [onBoardingMutation] = useOnBoardingMutation();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { showNotification } = useToast();
  const { data: EXPERIENCEDATA } = useFormattedExperience();

  const form = useForm<OnBoardingStepTwoType>({
    resolver: yupResolver(OnBoardingStepTwoSchema) as unknown as import("react-hook-form").Resolver<OnBoardingStepTwoType, any>,
    mode: "onBlur",
    defaultValues: {
      image: null,
      name: "",
      tagline: "",
      level: "",
      workExperience: "",
    },
  });

  const formValues = form.watch();

  useEffect(() => {
    // Type-safe required fields check
    const isFormValid =
      !!formValues.name &&
      !!formValues.workExperience &&
      !!formValues.tagline &&
      !!formValues.level;
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
      } catch {
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

  // Helper to convert dataURL to File
  function dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  const onSubmit = async (values: OnBoardingStepTwoType) => {
    if (!isButtonDisabled) {
      setIsModalOpen(false);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("tagline", values.tagline);
      formData.append("experience_level_id", values.level);
      formData.append("experience_years", values.workExperience);
      formData.append("step", "1");
      if (values.image) {
        formData.append("profile_image", values.image);
      }
      // Call mutation directly with FormData (cast as unknown then any for mutation)
      const res = await onBoardingMutation(formData);



      // @ts-expect-error: dynamic response shape
      if (res?.data?.status) {
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
    const image = new window.Image();
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
      if (!ctx) return;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.scale(scale, scale);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);
      const editedImageUrl = canvas.toDataURL("image/png");
      setPreview(editedImageUrl);
      const file = dataURLtoFile(editedImageUrl, "profile.png");
      form.setValue("image", file);
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
               <InputField
                  fieldName={"workExperience"}
                  placeholder={"1.5"}
                  isError={!!form.formState.errors.workExperience}
                  required={true}
                  requiredLabel={true}
                  type={'number'}
                  languageName={"stepTwo"}
                  fieldHeight={""}
                  fieldWidth={""}
                />
         

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
                <input {...getInputProps()} type="file" style={{ display: 'none' }} />
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
