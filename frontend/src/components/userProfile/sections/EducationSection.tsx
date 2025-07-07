import { motion, Variants } from "framer-motion";
import { Title } from "../Title";
import { EducationCard } from "../components/EducationCard";
import { useNavigate } from 'react-router-dom';
import { useGetEducationsQuery } from "@/services/slices/jobSeekerSlice";



interface EducationSectionProps {
    isEducationEdit: boolean;
    setIsEducationEdit: React.Dispatch<React.SetStateAction<boolean>>;
    containerVariants: Variants;
    itemVariants: Variants;
}

const EducationSection: React.FC<EducationSectionProps> = ({ isEducationEdit, setIsEducationEdit, containerVariants, itemVariants }) => {

    const { data} = useGetEducationsQuery();
    const navigate = useNavigate();


    return (
        <>
            <Title
                title={"Education"}
                onpressAdd={() => navigate('/user/edit/education')}
                isEdit={isEducationEdit}
                onEditToggle={() => setIsEducationEdit((prev) => !prev)}
            />

            <motion.div
                className='grid grid-cols-2 gap-[143px] mb-[143px]'
                variants={containerVariants}
            >
                {
                    data?.data?.map((e, index) => <motion.div key={index} variants={itemVariants}>
                        <EducationCard id={e.id} degree={e.degree} institution={e.institution} start_date={e.start_date} end_date={e.end_date} isEdit={isEducationEdit} description={e.description} is_currently_attending={false} />
                    </motion.div>)
                }
            </motion.div>
        </>
    )
}

export default EducationSection;