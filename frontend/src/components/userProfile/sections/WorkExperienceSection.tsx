import React from 'react'
import { Title } from '../Title';
import { motion, Variants } from 'framer-motion';
import { WorkExperienceCard } from '../components/WorkExperienceCard';
import { useNavigate } from 'react-router-dom';
import { useGetExperiencesQuery } from '@/services/slices/jobSeekerSlice';

interface WorkExperienceSectionProps {
  isWorkExperienceEdit: boolean;
  setIsWorkExperienceEdit: React.Dispatch<React.SetStateAction<boolean>>;
  containerVariants: Variants;
  itemVariants: Variants;
}

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  isWorkExperienceEdit,
  setIsWorkExperienceEdit,
  containerVariants,
  itemVariants,
}) => {

  const navigate = useNavigate();
  const { data } = useGetExperiencesQuery();


  const EXPERIENCEDATA = data?.data;



  return (
    <div>
      <Title
        title={" Work Experience"}
        onpressAdd={() => navigate('/user/edit/workexperience')}
        isEdit={isWorkExperienceEdit}
        onEditToggle={EXPERIENCEDATA?.length > 0 ? () => setIsWorkExperienceEdit((prev) => !prev) : undefined}
      />

      <motion.div
        className='grid grid-cols-2 gap-[143px] mb-[140px]'
        variants={containerVariants}
      >
        {
          EXPERIENCEDATA?.map((e, index) => <motion.div key={index} variants={itemVariants}>
            <WorkExperienceCard
              id={e.id}
              title={e.title}
              companyName={e.organization}
              experience='Mar 2025 - Present'
              description={e.description}
              isEdit={isWorkExperienceEdit}
            />
          </motion.div>)
        }

      </motion.div>
    </div>
  )
}

export default WorkExperienceSection;
