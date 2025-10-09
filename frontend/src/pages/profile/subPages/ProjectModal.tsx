import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
  
  type ProjectModalProps = {
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: boolean;
  };
  
  const ProjectModal: React.FC<ProjectModalProps> = ({
    setShowDialog,
    openModal,
  }) => {
    return (
      <Dialog open={openModal} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-[21px]">Edit Project</DialogTitle>
            <Separator className="mb-[21px]"/>
            <DialogDescription className="pt-[21px]">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className="bg-[#0389FF] font-[400] h-[42px] text-white rounded-2xl py-[20px] text-[14px]">Update Project</Button>
        </DialogFooter>
        </DialogContent>
       
      </Dialog>
    );
  };
  
  export default ProjectModal;
  