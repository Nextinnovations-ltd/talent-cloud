import { useState } from "react";
import SvgAdd from "@/assets/svgs/SvgAdd";
import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Button } from "@/components/ui/button";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

const Projects = () => {
  const [isHover, setIsHover] = useState(false);
  const [openModal,setOpenModal] = useState(false);

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
        onClick={()=>setOpenModal(true)}
      >
        <SvgAdd
          color={isHover ? "#ffffff" : "#0481EF"}
        />
        Add Project
      </Button>

      <div>
        <ProjectCard/>
        <ProjectCard/>
        <ProjectCard/>
        <ProjectCard/>

      </div>
    </div>
    <ProjectModal openModal={openModal} setShowDialog={setOpenModal}/>
   </>
  );
};

export default Projects;
