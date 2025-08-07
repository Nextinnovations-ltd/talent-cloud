import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
  } from "@/components/ui/alert-dialog";
  import { LoadingSpinner } from "../common/LoadingSpinner";
  
  interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isLoading: boolean;
  }
  
  const ConfirmationDialog = ({
    open,
    onOpenChange,
    onConfirm,
    isLoading,
  }: ConfirmationDialogProps) => {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Shortlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add this applicant to your shortlist?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={onConfirm}
              disabled={isLoading}
              className="text-blue-500"
            >
              {isLoading ? <LoadingSpinner /> : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  export default ConfirmationDialog;