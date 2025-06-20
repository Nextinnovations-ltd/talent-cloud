import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import "./imageEditor.css";
import { RotateCwIcon } from "lucide-react";
import { PrimaryButton } from "./PrimaryButton";

interface ImageEditorProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  preview: any;
  rotation: number;
  scale: number;
  rotateImage: () => void;
  handleScaleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  saveEditedImage: () => void;
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
}) => {
  // This function will trigger the rotation and animation for the button
  const handleRotateClick = () => {
    rotateImage(); // Apply the rotation to the image
  };

  return (
    <Dialog  open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-[90%] rounded-[15px]  md:w-full" >
        <h3 className=" mx-auto font-[600] text-[28px]">Adjust Photo</h3>
        <div className="flex flex-col  items-center">
          {preview && (
            <div className="relative md:w-[396px] md:h-[342px] rounded-[10px] border-2 overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-[10px]"
                style={{
                  transform: `rotate(${rotation}deg) scale(${scale})`,
                  transition: "transform 0.3s ease",
                }}
              />
            </div>
          )}

          <div className="flex px-[30px] flex-row mt-4 justify-center w-full items-cente gap-4">
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
                  background: `linear-gradient(to right, #0389FF 0%, #0389FF ${
                    ((scale - 0.5) * 100) / 1.5
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
          <DialogFooter className="w-full mt-[10px] px-[30px]">
            <div className="flex w-full flex-col">
              <PrimaryButton
                handleClick={saveEditedImage}
                title="Choose"
                width={"w-full"}
                isButtonDisabled={false}
              />
              {/* <Button className="bg-green-500 text-white">Chosen</Button> */}
              <Button
                type="button"
                variant={"ghost"}
                onClick={() => setIsModalOpen(false)}
                className="mt-[16px] text-[#0389FF] font-bold"
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
