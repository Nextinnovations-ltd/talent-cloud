import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Education } from "./Education";


type EducationModalProps = {
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: boolean;
    eductionId: number | null;
};


const EducationModal: React.FC<EducationModalProps> = ({
    openModal,
    setShowDialog,
    eductionId
}) => {

    const educationRef = useRef<{ submitForm: () => void } | null>(null);



    return (

        <Dialog open={openModal} onOpenChange={setShowDialog}>
            <DialogContent className="w-[550px] max-w-[90vw] flex flex-col max-h-[90vh] p-0">
                {/* Header */}
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="mb-[21px]"> {
                        eductionId ? "Update Education" : "Add Education"
                    }</DialogTitle>
                    <Separator className="mb-[21px]" />
                </DialogHeader>

                {/* Scrollable content */}
                <ScrollArea className="flex-1 max-h-[60vh] overflow-y-auto px-6">
                    <div className="pb-6 px-2">
                        <Education
                            ref={educationRef}
                            eductionId={eductionId}
                            setShowDialog={setShowDialog} />
                    </div>
                </ScrollArea>

                {/* Footer (optional) */}
                <DialogFooter className="p-6 pt-0">
                    <Button
                        onClick={() => setShowDialog(false)}
                        type="button"
                        className="bg-white border border-gray-200 text-black font-[400] h-[42px] rounded-2xl py-[20px] text-[14px] shadow-none"
                    >
                        Cancel
                    </Button>
                    <Button onClick={() => educationRef.current?.submitForm()} type="submit" className="bg-[#0389FF] font-[400] h-[42px] text-white rounded-2xl py-[20px] text-[14px]">
                        {
                            eductionId ? "Update Education" : "Add Education"
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EducationModal