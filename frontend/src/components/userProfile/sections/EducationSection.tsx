import { motion, Variants } from "framer-motion";
import { Title } from "../Title";
import { EducationCard } from "../components/EducationCard";
import { useNavigate } from 'react-router-dom';
import { useGetEducationsQuery } from "@/services/slices/jobSeekerSlice";
import EmptyEducations from '@/assets/Login/EmptyEducation.png';
import { EmptyData } from '@/components/common/EmptyData';


interface EducationSectionProps {
    isEducationEdit: boolean;
    setIsEducationEdit: React.Dispatch<React.SetStateAction<boolean>>;
    containerVariants: Variants;
    itemVariants: Variants;
}

const EducationSection: React.FC<EducationSectionProps> = ({ isEducationEdit, setIsEducationEdit, containerVariants, itemVariants }) => {

    const { data } = useGetEducationsQuery();
    const navigate = useNavigate();

    const EDUCATIONDATA = data?.data;


    return (
        <>
            <Title
                title={"Education"}
                onpressAdd={() => navigate('/user/edit/education')}
                isEdit={isEducationEdit}
                onEditToggle={EDUCATIONDATA && EDUCATIONDATA?.length > 0 ? () => setIsEducationEdit((prev) => !prev) : undefined}
            />

            {(!data?.data || data.data.length === 0) && (
                <EmptyData
                    image={<img src={EmptyEducations} alt="No Education" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    title="Education"
                    description="This user does not have any education records yet."
                />
            )}

            {data?.data && data.data.length > 0 && (
                <motion.div
                    className='grid grid-cols-2 gap-[143px] mb-[143px]'
                    variants={containerVariants}
                >
                    {data.data
                        .slice() // avoid mutating original array
                        .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
                        .map((e, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <EducationCard
                                    id={e.id}
                                    degree={e.degree}
                                    institution={e.institution}
                                    start_date={e.start_date}
                                    end_date={e.end_date}
                                    isEdit={isEducationEdit}
                                    description={e.description}
                                    is_currently_attending={false}
                                />
                            </motion.div>
                        ))}
                </motion.div>
            )}
        </>
    )
}

export default EducationSection;