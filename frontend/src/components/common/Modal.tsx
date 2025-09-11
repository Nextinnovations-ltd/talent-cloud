import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NavLink } from "./NavLink";

interface ModalProps {
  modalValue: boolean;
  onClose: () => void;
}

export const AlertDialogDemo: React.FC<ModalProps> = ({
  modalValue,
  onClose,
}) => {
  return (
    <AlertDialog open={modalValue}>
      <AlertDialogContent >
        <AlertDialogHeader>
          <AlertDialogTitle>Token Expired?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {" "}
            <NavLink to="/login" title="Back to Login" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onClose}>
            Resend
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
