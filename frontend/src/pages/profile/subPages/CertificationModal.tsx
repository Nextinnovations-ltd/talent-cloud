import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Certification } from "./Certification";


type CertificationModalProps = {
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: boolean;
    certificationId: number | null;
};


const CertificationModal:React.FC<CertificationModalProps> = ({
    openModal,
    setShowDialog,
    certificationId
}) => {


  const certificationRef = useRef<{ submitForm: () => void } | null>(null);


  return (
    <Dialog open={openModal} onOpenChange={setShowDialog}>
    <DialogContent className="w-[550px] max-w-[90vw] flex flex-col max-h-[90vh] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
            <DialogTitle className="mb-[21px]"> {
                    certificationId ? "Update Certificate" : "Add Certificate"
                }</DialogTitle>
            <Separator className="mb-[21px]" />
        </DialogHeader>

        {/* Scrollable content */}
        <ScrollArea className="flex-1 max-h-[60vh] overflow-y-auto px-6">
            <div className="pb-6 px-2">
                <Certification 
                ref={certificationRef} 
                certificateId={certificationId} 
                setShowDialog={setShowDialog} />
            </div>
        </ScrollArea>

        {/* Footer (optional) */}
        <DialogFooter className="p-6 pt-0">
            <Button onClick={() => certificationRef.current?.submitForm()} type="submit" className="bg-[#0389FF] font-[400] h-[42px] text-white rounded-2xl py-[20px] text-[14px]">
                {
                    certificationId ? "Update Certificate" : "Add Certificate"
                }
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
  )
}

export default CertificationModal