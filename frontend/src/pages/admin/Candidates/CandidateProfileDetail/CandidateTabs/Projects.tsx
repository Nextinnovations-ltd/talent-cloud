import { useGetJobSeekersProjectsQuery } from "@/services/slices/adminSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router-dom";

const Projects = () => {

    const { id } = useParams<{ id: string }>();
    const {data} = useGetJobSeekersProjectsQuery(id ? {id} : skipToken);

    return (
        <div className="grid grid-cols-2 gap-[35px] mt-[72px]">
            {
                data?.data.map((e)=> <ProjectCard 
                projectImageUrl={e.project_image_url} 
                title={e.title} 
                description={e.description} />)
            }

        </div>
    )
}

import { useState } from "react";

interface ProjectCardProps {
  projectImageUrl: string;
  title: string;
  description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectImageUrl, title, description }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full">
      <div className="w-full h-[293px] relative">
        {!isLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-[17px]" />
        )}
        <img
          src={projectImageUrl}
          alt={title}
          className={`w-full h-full object-cover  rounded-[17px] transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
        />
      </div>

      <div>
        <h3 className="text-[24px] font-semibold mt-[26px] mb-[12px]">{title}</h3>
        <p className="text-[#6B6B6B]">{description}</p>
      </div>
    </div>
  );
};



export default Projects;
