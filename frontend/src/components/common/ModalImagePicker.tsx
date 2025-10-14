import { useDropzone, FileRejection } from "react-dropzone";
import { useState, useCallback } from "react";
import SvgModalImagePicker from "@/assets/svgs/SvgModalImagePicker";
import { X } from "lucide-react";
import clsx from "clsx";

type FormLike = {
  setValue: (name: string, value: unknown) => void;
  clearErrors: (name?: string) => void;
  
};

type ModalImagePickerProps = {
  form: FormLike;
  setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  preview: string | ArrayBuffer | null;
};

const ModalImagePicker: React.FC<ModalImagePickerProps> = ({
  form,
  preview,
  setPreview
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


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
        return;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Final size check
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("File too large. Maximum size is 2MB.");
        return;
      }

      setErrorMessage(null); // ✅ clear error if valid

      // Read image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Update form field
      form?.setValue(`project_image_url`, file);
      form?.clearErrors(`project_image_url`);

    },
    [form, setPreview]
  );



  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    accept: { "image/png": [], "image/jpeg": [], "image/jpg": [] },
    noClick: true,
    noDrag: true,
  });

  return (
    <div
      {...getRootProps()}
      className={clsx('relative h-[305px] w-full   flex flex-col items-center justify-center border-[#0481EF] rounded-2xl  text-center overflow-hidden', preview ? "border-gray-300 border bg-white  " : 'border-2 border-dashed  bg-[#E7F4FF] ')}
    >
      {/* ✅ If preview exists, show image */}
      {preview ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src={preview as string}
            alt="Preview"
            className="object-cover w-full h-full rounded-2xl "
          />
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              form?.setValue(`project_image_url`, null);
            }}
            className="absolute top-3 right-3 bg-gray-200/70 hover:bg-gray-200/80 text-gray-500 px-2 py-1  text-sm rounded-full h-[40px]"
          >
            <X/>
          </button>
        </div>
      ) : (
        <>
          <SvgModalImagePicker />
          <h3 className="mt-2 font-medium">
            Upload your project preview photo
          </h3>
          <p className="text-[#0481EF] mb-2">
            Drop your image here or browse
          </p>

          <button
            type="button"
            onClick={open}
            className="bg-[#0481EF] text-white px-5 py-2 rounded-[16px] mt-2 hover:bg-[#036fd4] transition"
          >
            Browse
          </button>

          <input {...getInputProps()} className="hidden" />

          {errorMessage && (
            <p className="text-red-500 text-sm mt-3">{errorMessage}</p>
          )}
        </>
      )}
    </div>
  );
};

export default ModalImagePicker;
