import { SVGProfile } from "@/constants/svgs";
import { useState,useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { ImageEditor } from "./ImageEditor";

 const ImagePicker = ({setPreview,preview,form,setIsOpen, type = "circle"}:{
    setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
    preview: string | ArrayBuffer | null;
    form: any;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    type?: "circle" | "square";
 }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

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


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 5000000,
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    noDrag: true,
  });

  return (
  <>
    <div className="flex gap-[30px] items-center">
    <div
{...getRootProps()}
className={`cursor-pointer bg-slate-200/50 flex items-center justify-center  transition-all duration-300 w-[110px] h-[110px] ${
  type === "circle" ? "rounded-full" : "rounded-[16px]"
}`}
>
{preview ? (
  <img
    src={preview as string}
    width={110}
    height={110}
    alt="Uploaded"
    className={`object-cover w-full h-full ${
      type === "circle" ? "rounded-full" : "rounded-[16px]"
    }`}
  />
) : (
  <SVGProfile />
)}
</div>
      <div className="flex ">
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
  </>
)
}


export default ImagePicker