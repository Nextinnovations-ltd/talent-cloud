import SvgAdd from "@/assets/svgs/SvgAdd";
import { ProfileTitle } from "@/components/common/ProfileTitle";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import EducationModal from "./EducationModal";
import { useDeleteEducationByIdMutation, useGetEducationsQuery } from "@/services/slices/jobSeekerSlice";
import ProjectCard from "./ProjectCard";
import useToast from "@/hooks/use-toast";

const EducationPage = () => {
    const [isHover, setIsHover] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [educationId, setEducationId] = useState<number | null>(null);
    const [deleteEducationByIdMutation] = useDeleteEducationByIdMutation();
    const { showNotification } = useToast();
    const {data} = useGetEducationsQuery();

    const EDUCATIONS = data?.data;




    const handleAddProject = () => {
        setEducationId(null); // no id means new project
        setOpenModal(true);
    };

    const handleEditFunction = (id: number) => {
        setEducationId(id);
        setOpenModal(true);
      };

      const handleDelete = async (id:number)=> {
        try {
          await deleteEducationByIdMutation(id);
          showNotification({ message: "Education deleted successfully", type: "success" });
          setOpenModal(false);
      } catch {
          showNotification({ message: "Failed to delete experience", type: "danger" });
      }
      }

     

    return (
        <>
            <div className="mb-[120px]">
                <ProfileTitle title="Education" />
                <h3 className="mt-[10px] text-[#6B6B6B] mb-[24px]">
                    Show  employer to about your education background
                </h3>
                <Button
                    className="w-[212px] h-[46px] border border-[#0481EF] text-[#0481EF] bg-white shadow-none rounded-[16px] gap-2 
                   hover:bg-[#0481EF] hover:text-white transition-[500] duration-300"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onClick={handleAddProject}
                >
                    <SvgAdd color={isHover ? "#ffffff" : "#0481EF"} />
                    Add Education
                </Button>

                <div>

            {EDUCATIONS?.map((education) => (
            <ProjectCard
              key={education.id}
              id={education.id}
              description={education.description}
              team_size={undefined}
              title={education?.degree}
              start_date={education?.start_date}
              end_date={education?.end_date}
              is_ongoing={education?.is_currently_attending}
              project_image_url={undefined}
              tags={[]}
              organization={education?.institution}
              project_url={undefined}
              handleEdit={handleEditFunction}
              handleDelete={handleDelete}
              modalTitle="Delete this education?"
            />
          ))}
            </div>

            </div>

            <EducationModal
                openModal={openModal}
                setShowDialog={setOpenModal}
                eductionId={educationId}
            />

        </>
    )
}

export default EducationPage