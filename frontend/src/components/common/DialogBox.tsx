import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { PrimaryButton } from "./PrimaryButton";

export const DialogBox = ({
  isOpen,
  setIsOpen,
  title,
  description,
  negative,
  action,
  handleAction,
}: {
  isOpen: boolean;
  setIsOpen: any;
  negative: string;
  action: string;
  title: string;
  description: string;
  handleAction: any;
}) => {
  // const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-[30px]">
          <DialogHeader className="p-0 m-0">
            <DialogTitle className="font-bold text-[20px]">{title}</DialogTitle>
            <DialogDescription className="text-[16px] text-[#686C73]">
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end p-0 mt-[5px] gap-[20px] justify-center items-center">
            {/* Close Dialog on Click */}
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                {negative}
              </Button>
            </DialogClose>

            <PrimaryButton
              handleClick={handleAction}
              width={"w-[115px]"}
              title={action}
              isButtonDisabled={false}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
