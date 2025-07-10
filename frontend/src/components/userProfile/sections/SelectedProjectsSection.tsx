import { motion, Variants } from "framer-motion"
import { Title } from "../Title"
import { SelectedProjects } from "../components/SelectedProjects";
import { useNavigate } from "react-router-dom";
import { useGetSelectedProjectsQuery } from "@/services/slices/jobSeekerSlice";
import { EmptyData } from '@/components/common/EmptyData';
import EmptyProjects from '@/assets/Login/EmptyProjects.png';

interface SelectedProjectsSectionPropps {
  isSelectedProjectsEdit: boolean;
  setIsSelectedProjectsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  containerVariants: Variants;
  itemVariants: Variants;
}

const SelectedProjectsSection:React.FC<SelectedProjectsSectionPropps> = ({
  containerVariants,
  isSelectedProjectsEdit,
  itemVariants,
  setIsSelectedProjectsEdit
}) => {
  const { data } = useGetSelectedProjectsQuery();
  const navigate = useNavigate();
  console.log(data)
  const PROJECTS = data?.data;

  return (
    <>
      <Title
        title={" Selected Projects"}
        isEdit={isSelectedProjectsEdit}
        onpressAdd={() => navigate('/user/edit/SelectedProjects')}
        onEditToggle={PROJECTS && PROJECTS.length > 0 ? () => setIsSelectedProjectsEdit((prev) => !prev) : undefined}
      />

      {(!PROJECTS || PROJECTS.length === 0) && (
        <EmptyData
          image={<img src={EmptyProjects} alt="No Projects" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          title="Selected Projects"
          description="This user does not have any selected projects yet."
        />
      )}

      {PROJECTS && PROJECTS.length > 0 && (
        <motion.div
          className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-[72px] mb-20 md:mb-32 lg:mb-[140px]'
          variants={containerVariants}
        >
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              className="h-[25rem] w-full flex items-center justify-center"
              variants={itemVariants}
            >
            
                <SelectedProjects
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  tags={project.tags}
                  project_url={project.project_url}
                  project_image_url={project.project_image_url}
                  start_date={project.start_date}
                  end_date={project.end_date}
                  is_ongoing={project.is_ongoing}
                  team_size={project.team_size}
                  isEdit={isSelectedProjectsEdit}
                  onEdit={() => navigate(`/user/edit/SelectedProjects?id=${project.id}`)}
                  onDelete={() => { /* TODO: implement delete logic */ }}
                />

            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  )
}

export default SelectedProjectsSection