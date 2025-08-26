import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { RadioGroupItem, RadioGroup } from "../ui/radio-group";
import ApplyJobUploadResume from "./ApplyJobUploadResume";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

type ApplyCoverLetterProps = {
  fileData: File | undefined;
  setFileData: (file: File | undefined) => void;
};

type CoverChoice = "uploadCover" | "noCover";

const ApplyCoverLetter: React.FC<ApplyCoverLetterProps> = ({ fileData, setFileData }) => {
  const [radioValue, setRadioValue] = useState<CoverChoice>("noCover");

  // If user chooses "Skip", clear any selected file
  useEffect(() => {
    if (radioValue === "noCover" && fileData) setFileData(undefined);
  }, [radioValue, fileData, setFileData]);

  return (
    <div className="mt-[50px] mb-[10px]">
      <h3 className="text-[22px]">Cover Letter</h3>
      <p className="text-[14px] my-[10px]">Optional but recommended to stand out</p>

      <RadioGroup
        className="mt-[40px]"
        value={radioValue}
        onValueChange={(v) => setRadioValue(v as CoverChoice)}
      >
        {/* Upload option */}
        <div className="flex items-center cursor-pointer gap-3">
          <RadioGroupItem value="uploadCover" id="cover-upload" />
          <Label className="font-medium cursor-pointer" htmlFor="cover-upload">
            <h3 className="text-[16px]">Upload Cover Letter</h3>
            <p className="text-[12px] mt-[10px] font-light">Upload a personalized cover letter</p>
          </Label>
        </div>

        {radioValue === "uploadCover" && (
          fileData ? (
            <div className="flex items-center ml-8 justify-start gap-5 mt-5">
              <div className="h-[51px] px-4 flex items-center shadow-none border rounded font-normal border-slate-300 bg-slate-100 gap-3 max-w-[320px] truncate">
                {fileData.name}
              </div>
              <Button
                type="button"
                onClick={() => setFileData(undefined)}
                className="w-[48px] hover:bg-gray-300 flex items-center justify-center h-[48px] rounded-full bg-gray-200"
              >
                <Trash size={18} />
              </Button>
            </div>
          ) : (
            <div className="mt-[20px] ml-8">
              <ApplyJobUploadResume type="coverLetter" setFileData={setFileData} />
            </div>
          )
        )}

        {/* Skip option */}
        <div className="flex items-center cursor-pointer gap-3 mt-[40px]">
          <RadioGroupItem value="noCover" id="cover-skip" />
          <Label className="font-medium cursor-pointer" htmlFor="cover-skip">
            <h3 className="text-[16px]">Skip Cover Letter</h3>
            <p className="text-[12px] mt-[10px] font-light">Continue without a cover letter</p>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default ApplyCoverLetter;
