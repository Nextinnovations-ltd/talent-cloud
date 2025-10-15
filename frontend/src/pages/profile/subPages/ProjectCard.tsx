/* eslint-disable @typescript-eslint/no-explicit-any */
import SvgClock from "@/assets/svgs/SvgClock";
import SvgDelete from "@/assets/svgs/SvgDelete";
import SvgEdit from "@/assets/svgs/SvgEdit";
import SvgGroups from "@/assets/svgs/SvgGroups";
import SvgLink from "@/assets/svgs/SvgLink";
import { useState } from "react";
import BGGRADIENT from '@/assets/images/projectCardBg.png'

// 🧱 shadcn components
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import SvgOrganization from "@/assets/svgs/SvgOrganization";

type ProjectCardProps = {
  id: number;
  description: string;
  team_size: number | undefined;
  title: string;
  start_date: string | Date | undefined;
  end_date: string | Date | undefined;
  is_ongoing: boolean;
  project_image_url: string | undefined;
  tags: string[];
  project_url: string | undefined;
  handleEdit: any;
  handleDelete:any;
  organization:string | undefined
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  description,
  team_size,
  title,
  start_date,
  end_date,
  is_ongoing,
  project_image_url,
  tags,
  project_url,
  handleEdit,
  handleDelete,
  organization
}) => {


  const [open, setOpen] = useState(false);

  const calculateDuration = (
    start?: string | Date,
    end?: string | Date,
    ongoing?: boolean
  ) => {
    if (ongoing) return "Ongoing";
    if (!start || !end) return "N/A";

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "N/A";

    const diffInMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    if (diffInMonths <= 0) return "Less than a month";
    if (diffInMonths === 1) return "1 month";
    return `${diffInMonths} months`;
  };

  const durationText = calculateDuration(start_date, end_date, is_ongoing);


  return (
    <>
      <div className="border border-[#CFD1D4] p-5 mt-5 rounded-[12px] relative bg-white transition-all duration-200">
        <div className="flex items-start justify-between">
          {/* Project Info */}
          <div className="flex gap-5 items-start">
            <img
              width={140}
              height={117}
              className="rounded-[8px]  object-cover h-[117px]"
              src={
                project_image_url ||
                BGGRADIENT
              }
              alt={title}
            />
            <div>
              <h3 className="text-[18px] mb-[11px] font-semibold text-gray-800">
                {title || ""}
              </h3>
              <p className="text-[13px] text-[#6B6B6B] max-w-[500px] leading-[1.5]">
                {description || ""}
              </p>

              <ul className="flex items-center gap-[40px] mt-[18px] text-[#6B6B6B] text-[12px]">
                {
                  team_size && <li className="flex items-center gap-[8px]">
                    <SvgGroups /> {team_size || 0}
                  </li>
                }

                {
                  durationText && <li className="flex items-center gap-[8px]">
                    <SvgClock /> {durationText || 0}
                  </li>
                }



              {
                organization &&   <li className="flex items-center gap-[8px]">
                <SvgOrganization /> {organization || 0}
              </li>
              }

                {project_url && (
                  <li className="flex items-center gap-[8px]">
                    <SvgLink />
                    <a
                      href={project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Project link
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handleEdit(id)}
              className="flex items-center justify-center gap-2 border border-[#D0D0D0] text-[12px] text-[#6B6B6B] w-[73px] h-[35px] rounded-xl hover:bg-gray-100 transition"
            >
              <SvgEdit size={16} color="#6B6B6B" /> Edit
            </button>


            {/* Delete Button with Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center justify-center gap-2 border border-[#D0D0D0] text-[12px] text-[#6B6B6B] w-[85px] h-[35px] rounded-xl hover:bg-gray-100 transition">
                  <SvgDelete size={16} color="#6B6B6B" /> Delete
                </button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Project</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete <b>{title}</b>? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-red-500"
                    onClick={()=>handleDelete(id)}
                  >
                    Yes, Delete
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Scrollable Tags */}
        <div className="flex gap-3 mt-5 overflow-x-auto scrollbar-hide scroll-smooth py-1">
          {tags?.map((tag, index) => (
            <button
              key={index}
              className="px-4 py-1.5 border border-[#CBD5E1] rounded-full text-[12px] text-gray-700 bg-white hover:bg-gray-100 active:scale-95 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectCard;
