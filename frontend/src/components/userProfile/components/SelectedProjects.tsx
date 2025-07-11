import SvgDelete from "@/assets/svgs/SvgDelete";
import SvgEdit from "@/assets/svgs/SvgEdit";
import { useDeleteSelectedProjectsMutation } from "@/services/slices/jobSeekerSlice";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useToast from "@/hooks/use-toast";

interface SelectedProjectsProps {
  id: number;
  title: string;
  description: string;
  tags: string[];
  project_url?: string;
  project_image_url?: string;
  start_date: string | Date;
  end_date?: string | Date;
  is_ongoing: boolean;
  team_size: number;
  isEdit?: boolean;
  onEdit?: (id: number) => void;
  // Removed onDelete prop
}

export const SelectedProjects = ({
  id,
  title,
  description,
  tags,
  project_url,
  project_image_url,
  isEdit = false,
  onEdit,
}: SelectedProjectsProps) => {
  const [open, setOpen] = useState(false);
  const [deleteSelectedProject] = useDeleteSelectedProjectsMutation();
  const { showNotification } = useToast();


  const handleDelete = async () => {
    try {
      await deleteSelectedProject(id);
      showNotification({ message: "Project deleted successfully", type: "success" });
      setOpen(false);
    } catch {
      showNotification({ message: "Failed to delete project", type: "danger" });
    }
  };

  return (
    <div className="relative w-full max-w-[500px]   bg-white rounded-[20px]  flex flex-col gap-4  border-[#E5E7EB]">
      {isEdit && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button
            onClick={() => onEdit?.(id)}
            className="p-1 w-[35px] h-[35px] flex items-center justify-center rounded-full bg-[#0389FF] shadow hover:bg-gray-100 hover:bg-[#0389FF]/80 hover:scale-105"
            title="Edit"
          >
            <SvgEdit size={16} color={'#ffffff'} />
          </button>
          <button
            onClick={() => setOpen(true)}
            className="p-1 w-[35px] h-[35px] bg-[#F23030] rounded-full shadow hover:bg-[#F23030]/80 hover:scale-105"
            title="Delete"
          >
            <SvgDelete size={18} color={'#ffffff'} />
          </button>
        </div>
      )}
      {project_image_url && (
        <img className="h-[230px] w-full object-cover rounded-lg mb-2" src={project_image_url} alt={title} />
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-[22px] font-bold text-[#05060F]">{title}</h3>
        <p className="text-[15px] text-[#6B6B6B]">{description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags && tags.map((tag, idx) => (
            <span key={idx} className="border-[1px] border-[#CBD5E1] text-[#05060F] px-3 py-1 rounded-full text-sm font-medium">{tag}</span>
          ))}
        </div>
        <div className="flex flex-col gap-1 mt-2 text-[14px] text-[#6B6B6B]">
          {project_url && (
            <a
              href={project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0389FF] underline mt-1 inline-block"
            >
              Visit Project
            </a>
          )}
        </div>
      </div>
      {/* Confirm delete dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Delete Project</DialogTitle>
          <div className="mb-4">
            Are you sure you want to delete <span className="font-semibold">{title}</span>?
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 w-[100px] py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setOpen(false)}
            >
              No
            </button>
            <button
              className="px-4 py-2 w-[100px] bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleDelete}
            >
              Yes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 