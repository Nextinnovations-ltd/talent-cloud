import SvgAdd from "@/assets/svgs/SvgAdd";
import { ProfileTitle } from "@/components/common/ProfileTitle"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import WorkExperienceModal from "./WorkExperienceModal";
import { useDeleteExperienceByIdMutation, useGetExperiencesQuery } from "@/services/slices/jobSeekerSlice";
import ProjectCard from "./ProjectCard";
import useToast from "@/hooks/use-toast";


const WorkExperiencePage = () => {
    const [isHover, setIsHover] = useState(false);
    const [workExperienceId, setWorkExperienceId] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const { showNotification } = useToast();
    const [deleteWorkExperience] = useDeleteExperienceByIdMutation();


    const { data } = useGetExperiencesQuery();

    const handleAddProject = () => {
        setWorkExperienceId(null); // no id means new project
        setOpenModal(true);
    };

    const EXPERIENCES = data?.data;

    const handleEditFunction = (id: number) => {
        setWorkExperienceId(id);
        setOpenModal(true);
    };

    const handleDelete = async (id:number) => {
        try {
            await deleteWorkExperience(id);
            showNotification({ message: "Work experience deleted successfully", type: "success" });
            setOpenModal(false);
        } catch {
            showNotification({ message: "Failed to delete experience", type: "danger" });
        }
    };

      // handle edit

   


    return (
        <>
            <div className="mb-[120px]">
                <ProfileTitle title="Work Experience" />
                <h3 className="mt-[10px] text-[#6B6B6B] mb-[24px]">
                    Show  employer to about your experience
                </h3>

                <Button
                    className="w-[212px] h-[46px] border border-[#0481EF] text-[#0481EF] bg-white shadow-none rounded-[16px] gap-2 
                   hover:bg-[#0481EF] hover:text-white transition-[500] duration-300"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onClick={handleAddProject}
                >
                    <SvgAdd color={isHover ? "#ffffff" : "#0481EF"} />
                 Add Work Experience
                </Button>

                <div>
                    {
                        EXPERIENCES?.map((experience) => (
                            <ProjectCard
                                key={experience.id}
                                title={experience.title}
                                description={experience.description}
                                start_date={experience.start_date}
                                end_date={experience.end_date}
                                organization={experience?.organization}
                                is_ongoing={experience.is_present_work}
                                handleEdit={handleEditFunction}
                                id={experience?.id}
                                team_size={undefined}
                                project_image_url={undefined}
                                tags={[]}
                                project_url={undefined}
                                handleDelete={handleDelete}
                                modalTitle="Delete this experience?"
                            />
                        ))
                    }

                </div>
            </div>
            <WorkExperienceModal
                openModal={openModal}
                setShowDialog={setOpenModal}
                workExperienceId={workExperienceId}
            />
        </>
    )
}

export default WorkExperiencePage