import { SVGProfile } from "@/constants/svgs";
import DefaultImage from '@/assets/Login/DefaultImg.png';
import { useState, useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Button } from "../ui/button";
import { ImageEditor } from "./ImageEditor";
import UploadToS3 from "@/lib/UploadToS3/UploadToS3";
import { useGetJobSeekerProfileQuery } from "@/services/slices/jobSeekerSlice";
import imageCompression from 'browser-image-compression';

type FormLike = {
  setValue: (name: string, value: unknown) => void;
  clearErrors: (name?: string) => void;
};

const ImagePicker = ({
  setPreview,
  preview,
  form,
  type = "circle",
  imageUploadType = "profile"
}: {
  setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  preview: string | ArrayBuffer | null;
  form: FormLike;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type?: "circle" | "square";
  imageUploadType: "profile" | "resume" | "coverLetter" | "project";
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { refetch } = useGetJobSeekerProfileQuery();

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

      // Get canvas as JPEG blob first, then compress to under 2MB using library
      canvas.toBlob((blob) => {
        if (!blob) {
          setErrorMessage("Failed to process image. Please try again.");
          return;
        }

        const originalName = selectedFile?.name || "image";
        const baseName = originalName.replace(/\.[^/.]+$/, "");

        const options = {
          maxSizeMB: 2,
          useWebWorker: true,
          maxIteration: 10,
          initialQuality: 0.9,
          fileType: 'image/jpeg',
          alwaysKeepResolution: true,
        } as const;

        const intermediateFile = new File([blob], `${baseName}-edited-source.jpg`, { type: 'image/jpeg' });

        imageCompression(intermediateFile, options)
          .then((compressedBlob) => {
            if (!compressedBlob || compressedBlob.size > 2 * 1024 * 1024) {
              setErrorMessage("Edited image is too large (over 2MB). Please reduce scale or choose a smaller image.");
              return;
            }

            // Update preview to compressed image
            const fr = new FileReader();
            fr.onload = () => setPreview(fr.result);
            fr.readAsDataURL(compressedBlob);

            const rotatedFile = new File([compressedBlob], `${baseName}-edited.jpg`, {
              type: "image/jpeg",
            });

            if (imageUploadType === 'project') {
              form.setValue("project_image_url", rotatedFile);
              setIsModalOpen(false);
            } else {
              setIsUploading(true);
              UploadToS3({ file: rotatedFile, type: imageUploadType })
                .then(() => {
                  setIsModalOpen(false);
                  refetch();
                })
                .finally(() => {
                  setIsUploading(false);
                });
            }
          })
          .catch((err) => {
            console.error('Compression error:', err);
            setErrorMessage("Error compressing image. Please try again.");
          });
      }, 'image/jpeg', 0.92);
    };
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const firstError = fileRejections[0].errors[0];
        if (firstError.code === "file-too-large") {
          setErrorMessage("File too large. Maximum size is 2MB.");
        } else if (firstError.code === "file-invalid-type") {
          setErrorMessage("Invalid file type. Only JPG and PNG are allowed.");
        } else {
          setErrorMessage("File not accepted.");
        }
        setIsModalOpen(false); // Close modal if there's an error
        return; // ⛔ stop — do not setPreview or setValue
      }
  
      if (acceptedFiles.length === 0) return;
  
      setErrorMessage(null); // ✅ clear error only if valid
  
      const file = acceptedFiles[0];
  
      // Final safeguard: manual check just in case
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File too large. Maximum size is 2MB.");
        setIsModalOpen(false); // Close modal if there's an error
        return; // ⛔ stop — don't setPreview
      }
  
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
  
      form.setValue("profile_image_url", file);
      form.clearErrors("profile_image_url");
      setSelectedFile(file);
      setIsModalOpen(true);
    },
    [form, setPreview, setIsModalOpen]
  );
  

  const rotateImage = () => setRotation((prev) => prev + 90);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    noDrag: true,
  });

  return (
    <>
      <div className="flex gap-[30px] items-center">
        <div
          {...getRootProps()}
          className={`cursor-pointer bg-slate-200/50 flex items-center justify-center transition-all duration-300 w-[110px] h-[110px] ${
            type === "circle" ? "rounded-full" : "rounded-[16px]"
          }`}
        >
          {preview ? (
            <img
              src={preview as string}
              width={110}
              height={110}
              className={`object-cover w-full h-full ${
                type === "circle" ? "rounded-full" : "rounded-[16px]"
              }`}
            />
          ) : (
            type === "circle" ? (
              <SVGProfile />
            ) : (
              <img
                src={DefaultImage}
                width={110}
                height={110}
                alt="Uploaded"
                className="object-contain w-full h-full opacity-50"
              />
            )
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex">
            <Button
              type="button"
              className="p-0 w-[139px] text-white h-[45px] bg-[#0389FF]"
              disabled={isUploading}
            >
              <div {...getRootProps({ noDrag: true })} className="p-0">
                Change photo
                <input type="file" {...getInputProps()} className="hidden" />
              </div>
            </Button>
            {/* <Button
              type="button"
              className="p-0 w-[139px] shadow-none h-[45px] bg-white text-black"
              onClick={() => setIsOpen(true)}
              disabled={isUploading}
            >
              <h3 className="font-bold">Remove</h3>
            </Button> */}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
          )}
        </div>
      </div>

      <ImageEditor
        isModalOpen={isModalOpen && !errorMessage}
        setIsModalOpen={setIsModalOpen}
        preview={preview}
        rotation={rotation}
        scale={scale}
        handleScaleChange={handleScaleChange}
        saveEditedImage={saveEditedImage}
        rotateImage={rotateImage}
        isUploading={isUploading}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default ImagePicker;
