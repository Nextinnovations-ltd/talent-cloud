import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import "./imageEditor.css";
import { RotateCwIcon } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";
import { Skeleton } from "../ui/skeleton";

export interface ImageEditorProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  preview: string | ArrayBuffer | null;
  rotation: number;
  scale: number;
  rotateImage: () => void;
  handleScaleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  saveEditedImage: () => void;
  isUploading?: boolean;
  errorMessage?: string | null;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  isModalOpen,
  setIsModalOpen,
  preview,
  rotation,
  scale,
  rotateImage,
  handleScaleChange,
  saveEditedImage,
  isUploading = false,
  errorMessage,
}) => {
  // This function will trigger the rotation and animation for the button
  const handleRotateClick = () => {
    rotateImage(); // Apply the rotation to the image
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent onInteractOutside={(e) => {
        e.preventDefault();
      }}
        className="w-[90%] rounded-[15px]  md:w-full" >
        <h3 className=" mx-auto font-[600] text-[28px]">Adjust Photo</h3>
     
        {errorMessage && (
          <div className="mx-auto mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium text-center">{errorMessage}</p>
          </div>
        )}
        <div className="flex flex-col  items-center">
          {typeof preview === "string" && (
            <div className="relative md:w-[396px] md:h-[342px] rounded-[10px] border-2 overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain rounded-[10px] bg-slate-100"
                style={{
                  transform: `rotate(${rotation}deg) scale(${scale})`,
                  transition: "transform 0.3s ease",
                }}
              />
            </div>
          )}

          {
            isUploading && <Skeleton className="h-[20px] w-[87%] mt-4 bg-slate-200 " />
          }
          {
            !isUploading && <div className="flex px-[30px] flex-row mt-4 justify-center w-full items-cente gap-4">
              {/* Zoom Slider */}
              <div className="flex w-full items-center">
                <input
                  id="scale"
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={scale}
                  onChange={handleScaleChange}
                  className="w-full h-2 bg-[#CBD5E1] rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #0389FF 0%, #0389FF ${((scale - 0.5) * 100) / 1.5
                      }%, #CBD5E1 ${((scale - 0.5) * 100) / 1.5}%, #CBD5E1 100%)`,
                  }}
                />
                {/* <span className="text-sm">{scale.toFixed(1)}x</span> */}
              </div>

              {/* Rotation Button */}
              <Button
                type="button"
                variant={"ghost"}
                onClick={handleRotateClick}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 0.5s ease",
                }}
              >
                <RotateCwIcon />
              </Button>

              {/* Chosen Button */}
            </div>
          }
          <DialogFooter className="w-full mt-[10px] px-[30px]">
            <div className="flex w-full flex-col">
              <PrimaryButton
                handleClick={saveEditedImage}
                title="Choose"
                width={"w-full"}
                isButtonDisabled={isUploading}
                loading={isUploading}
              />
              {/* <Button className="bg-green-500 text-white">Chosen</Button> */}
              <Button
                type="button"
                variant={"ghost"}
                onClick={() => setIsModalOpen(false)}
                className="mt-[16px] text-[#0389FF] font-bold"
                disabled={isUploading}
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
