import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { SVGProfile, SVGUploadSign } from "@/constants/svgs";
import { Button } from "../ui/button";

import { ImageEditor } from "./ImageEditor";

export const ImageUploader: React.FC = () => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [rotation, setRotation] = React.useState(0); // State to track rotation angle
  const [scale, setScale] = React.useState(1); // State to track image zoom level

  const formSchema = z.object({
    image: z
      .instanceof(File)
      .refine((file) => file.size !== 0, "Please upload an image"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
    },
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);
        form.setValue("image", acceptedFiles[0]);
        form.clearErrors("image");
        setIsModalOpen(true); // Open the modal when an image is selected
      } catch (error) {
        setPreview(null);
        form.resetField("image");
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 5000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    toast.success(`Image uploaded successfully 🎉 ${values.image.name}`);
    setIsModalOpen(false);
  };

  const rotateImage = () => {
    setRotation((prevRotation) => prevRotation + 90);
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value)); // Update scale value
  };

  const saveEditedImage = () => {
    if (!preview) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const image = new Image();
    image.src = preview as string;

    image.onload = () => {
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);

      const editedImageUrl = canvas.toDataURL("image/png");
      setPreview(editedImageUrl);
      toast.success("Image saved successfully!");
      setIsModalOpen(false);
    };
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem className="mx-auto">
              <FormLabel
                className={`${
                  fileRejections.length !== 0 && "text-destructive"
                }`}
              ></FormLabel>
              <FormControl>
                <div
                  {...getRootProps()}
                  className="mx-auto flex w-[187px] h-[187px] rounded-full cursor-pointer flex-col relative items-center justify-center gap-y-2"
                >
                  <div className="absolute bottom-[10px] right-[10px]">
                    <SVGUploadSign />
                  </div>
                  {preview && (
                    <img
                      src={preview as string}
                      alt="Uploaded image"
                      className="w-[187px] h-[187px] bg-background rounded-full"
                    />
                  )}
                  {!preview && <SVGProfile />}

                  <Input {...getInputProps()} type="file" />
                  {isDragActive ? <p>Drop the image!</p> : <></>}
                </div>
              </FormControl>
              <FormMessage>
                {fileRejections.length !== 0 && (
                  <p>
                    Image must be less than 1MB and of type png, jpg, or jpeg
                  </p>
                )}
              </FormMessage>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mx-auto block h-auto rounded-lg px-8 py-3 text-xl"
        >
          Submit
        </Button>
      </form>

      {/* Modal */}
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
    
    </Form>
  );
};
