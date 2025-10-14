import { useState } from "react";
import SvgAdd from "@/assets/svgs/SvgAdd";
import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Button } from "@/components/ui/button";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { useDeleteSelectedProjectsMutation, useGetSelectedProjectsQuery } from "@/services/slices/jobSeekerSlice";
import useToast from "@/hooks/use-toast";

const Projects = () => {
  const [isHover, setIsHover] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editProjectId, setEditProjectId] = useState<number | null>(null);
  const { data } = useGetSelectedProjectsQuery();
  const [deleteSelectedProject] = useDeleteSelectedProjectsMutation();
  const { showNotification } = useToast();

  const PROJECTS = data?.data;

  // handle edit
  const handleEditFunction = (id: number) => {
    setEditProjectId(id);
    setOpenModal(true);
  };

  const handleAddProject = () => {
    setEditProjectId(null); // no id means new project
    setOpenModal(true);
  };


  const handleDelete = async (id:number)=> {
    try {
      await deleteSelectedProject(id);
      showNotification({ message: "Work experience deleted successfully", type: "success" });
      setOpenModal(false);
  } catch {
      showNotification({ message: "Failed to delete experience", type: "danger" });
  }
  }


  return (
    <>
      <div className="mb-[120px]">
        <ProfileTitle title="Selected Project" />
        <h3 className="mt-[10px] text-[#6B6B6B] mb-[24px]">
          Show employers your projects
        </h3>

        <Button
          className="w-[212px] h-[46px] border border-[#0481EF] text-[#0481EF] bg-white shadow-none rounded-[16px] gap-2 
                   hover:bg-[#0481EF] hover:text-white transition-[500] duration-300"
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={handleAddProject}
        >
          <SvgAdd color={isHover ? "#ffffff" : "#0481EF"} />
          Add Project
        </Button>

        <div>
          {PROJECTS?.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              description={project.description}
              team_size={project.team_size}
              title={project.title}
              start_date={project.start_date}
              end_date={project.end_date}
              is_ongoing={project.is_ongoing}
              project_image_url={project.project_image_url}
              tags={project.tags}
              organization={undefined}
              project_url={project.project_url}
              handleEdit={handleEditFunction}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {/* Pass editProjectId to modal */}
      <ProjectModal
        openModal={openModal}
        setShowDialog={setOpenModal}
        projectId={editProjectId}
      />
    </>
  );
};

export default Projects;
