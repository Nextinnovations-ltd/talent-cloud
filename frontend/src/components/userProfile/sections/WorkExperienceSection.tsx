import React from 'react'
import { Title } from '../Title';
import { motion, Variants } from 'framer-motion';
import { WorkExperienceCard } from '../components/WorkExperienceCard';
import { useNavigate } from 'react-router-dom';
import { useGetExperiencesQuery } from '@/services/slices/jobSeekerSlice';
import { EmptyData } from '@/components/common/EmptyData';
import EmptyExperiences from '@/assets/Login/EmptyExperiences.png';

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
        onEditToggle={EXPERIENCEDATA && EXPERIENCEDATA.length > 0 ? () => setIsWorkExperienceEdit((prev) => !prev) : undefined}
      />

      {(!EXPERIENCEDATA || EXPERIENCEDATA.length === 0) && (
        <EmptyData
          image={<img src={EmptyExperiences} alt="No Work Experience" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          title="Work Experience"
          description="This user does not have any work experience records yet."
        />
      )}

      {EXPERIENCEDATA && EXPERIENCEDATA.length > 0 && (
        <motion.div
          className='grid grid-cols-2 gap-[143px] mb-[140px]'
          variants={containerVariants}
        >
          {
            EXPERIENCEDATA.map((e, index) => {
              // Format the date range for experience
              const startDate = new Date(e.start_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
              });

              const endDate = e.is_present_work
                ? 'Present'
                : new Date(e.end_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short'
                });

              const experienceDateRange = `${startDate} - ${endDate}`;

              return (
                <motion.div key={index} variants={itemVariants}>
                  <WorkExperienceCard
                    id={e.id}
                    title={e.title}
                    companyName={e.organization}
                    experience={experienceDateRange}
                    description={e.description}
                    isEdit={isWorkExperienceEdit}
                  />
                </motion.div>
              )
            })
          }
        </motion.div>
      )}
    </div>
  )
}

export default WorkExperienceSection;
