import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import SelectedProject from "./SelectedProject";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef } from "react";

type ProjectModalProps = {
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
  projectId: number | null;
};

const ProjectModal: React.FC<ProjectModalProps> = ({
  openModal,
  setShowDialog,
  projectId,
}) => {
  const projectRef = useRef<{ submitForm: () => void } | null>(null);

  return (
    <Dialog open={openModal} onOpenChange={setShowDialog}>
      <DialogContent className="w-[550px] max-w-[90vw] flex flex-col max-h-[90vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="mb-[21px]">Edit Project</DialogTitle>
          <Separator className="mb-[21px]" />
        </DialogHeader>

        {/* Scrollable content */}
        <ScrollArea className="flex-1 max-h-[60vh] overflow-y-auto px-6">
          <div className="pb-6 px-2">
            <SelectedProject
              projectId={projectId}
              setShowDialog={setShowDialog}
              ref={projectRef}
            />
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="p-6 pt-0 flex justify-end space-x-2">
          <Button
            onClick={() => setShowDialog(false)}
            type="button"
            className="bg-white border border-gray-200 text-black font-[400] h-[42px] rounded-2xl py-[20px] text-[14px] shadow-none"
          >
            Cancel
          </Button>
          <Button
            onClick={() => projectRef.current?.submitForm()}
            type="submit"
            className="bg-[#0389FF] font-[400] h-[42px] text-white rounded-2xl py-[20px] text-[14px]"
          >
            {projectId ? "Update Project" : "Add Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
