/* eslint-disable @typescript-eslint/ban-ts-comment */
import { motion } from "framer-motion"
import { Title } from "../Title"
import { CertificationCard } from "../components/CertificationCard";
import DefaultCertifi from '@/assets/Login/Login/Certificate Photo.png';
import EmptyCerttifications from '@/assets/Login/EmptyCerttifications.png';
import { useNavigate } from 'react-router-dom';
import { useGetCertificationsQuery } from "@/services/slices/jobSeekerSlice";
import { EmptyData } from '@/components/common/EmptyData';
import { format } from "date-fns";

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

    const { data: CERTIIFICATIONS } = useGetCertificationsQuery();
    const navigate = useNavigate();

    // Helper function to format dates
    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        try {
            return format(new Date(dateString), "MMM yyyy");
        } catch {
            return dateString;
        }
    };

    // 🔽 Prepare & sort certifications (latest issued_date first)
    const sortedCerts = CERTIIFICATIONS?.data ? [...CERTIIFICATIONS.data] : [];

    sortedCerts.sort((a, b) => {
        const dateA = a.issued_date ? new Date(a.issued_date) : new Date(0);
        const dateB = b.issued_date ? new Date(b.issued_date) : new Date(0);
        return dateB.getTime() - dateA.getTime(); // latest first
    });

    return (
        <>
            <Title
                title={"Certifications"}
                isEdit={isCertificationEdit}
                onpressAdd={() => navigate(`/user/edit/certifications`)}
                onEditToggle={sortedCerts.length > 0 ? () => setIsCertificationEdit((prev) => !prev) : undefined}
            />

            {(sortedCerts.length === 0) && (
                <EmptyData
                    image={<img src={EmptyCerttifications} alt="No Certifications" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    title="Certifications"
                    description="This user does not have any certifications yet."
                />
            )}

            {sortedCerts.length > 0 && (
                <motion.div
                    className='grid grid-cols-2 gap-[74px] mb-[143px]'
                    variants={containerVariants}
                >
                    {sortedCerts.map((e, index) => (
                        //@ts-ignore
                        <motion.div variants={itemVariants} key={e.id ?? index}>
                            <CertificationCard
                                url={e.url}
                                img={DefaultCertifi}
                                id={e.id}
                                name={e.title}
                                org={e.organization}
                                expire={
                                    e.has_expiration_date 
                                      ? `Expiration Date: ${formatDate(e.expiration_date)}`
                                      : `Issued ${formatDate(e.issued_date)}  ·  ${e.has_expiration_date ? formatDate(e.expiration_date) : "No Expiration Date"}`
                                }
                                isEdit={isCertificationEdit}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </>
    )
}

export default CertificationSection;
