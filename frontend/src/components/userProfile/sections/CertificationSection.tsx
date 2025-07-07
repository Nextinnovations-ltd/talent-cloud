import { motion } from "framer-motion"
import { Title } from "../Title"
import { CertificationCard } from "../components/CertificationCard";
import DefaultCertifi from '@/assets/Login/Login/Certificate Photo.png';
import { useNavigate } from 'react-router-dom';
import { useGetCertificationsQuery } from "@/services/slices/jobSeekerSlice";


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            when: "beforeChildren"
        }
    }
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

const CertificationSection = ({
    isCertificationEdit,
    setIsCertificationEdit,
}: {
    isCertificationEdit: boolean;
    setIsCertificationEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

    const {data:CERTIIFICATIONS} = useGetCertificationsQuery();


    const navigate = useNavigate();
    
    return (
        <>
            <Title
                title={"Certifications"}
                isEdit={isCertificationEdit}
                onpressAdd={() => navigate(`/user/edit/certifications`)}
                onEditToggle={() => setIsCertificationEdit((prev) => !prev)}
            />

            <motion.div
                className='grid grid-cols-2 gap-[74px] mb-[143px]'
                variants={containerVariants}
            >
                {
                    CERTIIFICATIONS?.data?.map((e,index)=> {

                        console.log(e.expiration_date,e.issued_date)

                        return ( <motion.div variants={itemVariants}>
                            <CertificationCard
                                key={index}
                                url={e.url}
                                img={ DefaultCertifi}
                                id={e.id}
                                name={e.title}
                                org={e.organization}
                                expire={`Issued ${e.issued_date}  .  ${e.has_expiration_date ? e.expiration_date  : "No Expiration Date"} `}
                                isEdit={isCertificationEdit}
                            />
                        </motion.div>)
                    })
                }
            </motion.div>
        </>
    )
}

export default CertificationSection
