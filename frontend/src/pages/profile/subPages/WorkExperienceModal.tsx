import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WorkExperience } from "./WorkExperience";
import { useRef } from "react";

type WorkExperienceModalProps = {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
  workExperienceId: number | null;
};


const WorkExperienceModal: React.FC<WorkExperienceModalProps> = ({
  openModal, setShowDialog, workExperienceId
}) => {

  const workExperienceRef = useRef<{ submitForm: () => void } | null>(null);


  return (
    <Dialog open={openModal} onOpenChange={setShowDialog}>
      <DialogContent className="w-[550px] max-w-[90vw] flex flex-col max-h-[90vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="mb-[21px]">Add Work Experience</DialogTitle>
          <Separator className="mb-[21px]" />
        </DialogHeader>

        {/* Scrollable content */}
        <ScrollArea className="flex-1 max-h-[60vh] overflow-y-auto px-6">
          <div className="pb-6 px-2">
            <WorkExperience workExperienceId={workExperienceId} setShowDialog={setShowDialog} ref={workExperienceRef} />
          </div>
        </ScrollArea>

        {/* Footer (optional) */}
        <DialogFooter className="p-6 pt-0">
          <Button onClick={() => { workExperienceRef.current?.submitForm() }} type="submit" className="bg-[#0389FF] font-[400] h-[42px] text-white rounded-2xl py-[20px] text-[14px]">
            {
              workExperienceId ? "Update Experience" : "Add  Experience"
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WorkExperienceModal