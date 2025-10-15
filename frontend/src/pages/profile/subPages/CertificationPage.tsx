import SvgAdd from "@/assets/svgs/SvgAdd";
import { ProfileTitle } from "@/components/common/ProfileTitle"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CertificationModal from "./CertificationModal";
import { useDeleteCertificationByIdMutation, useGetCertificationsQuery } from "@/services/slices/jobSeekerSlice";
import useToast from "@/hooks/use-toast";
import CertificateCard from "./CertificateCard";

const CertificationPage = () => {
    const [isHover, setIsHover] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [certificationId, setCertificationId] = useState<number | null>(null);
    const { data } = useGetCertificationsQuery();
    const [deleteEducationByIdMutation] = useDeleteCertificationByIdMutation();
    const { showNotification } = useToast();

    const handleAddProject = () => {
        setCertificationId(null); // no id means new project
        setOpenModal(true);
    };

    const handleEdit = (id: number) => {
        setCertificationId(id);
        setOpenModal(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteEducationByIdMutation(id);
            showNotification({ message: "Work experience deleted successfully", type: "success" });
            setOpenModal(false);
        } catch {
            showNotification({ message: "Failed to delete experience", type: "danger" });
        }
    }

    const CERTIFICATIONS = data?.data;

    return (
        <>
            <div className="mb-[120px]">
                <ProfileTitle title="Certifications" />
                <h3 className="mt-[10px] text-[#6B6B6B] mb-[24px]">
                    Show  employer to about your achievement
                </h3>
                <Button
                    className="w-[212px] h-[46px] border border-[#0481EF] text-[#0481EF] bg-white shadow-none rounded-[16px] gap-2 
                   hover:bg-[#0481EF] hover:text-white transition-[500] duration-300"
                    onMouseEnter={() => setIsHover(true)}
                    onMouseLeave={() => setIsHover(false)}
                    onClick={handleAddProject}
                >
                    <SvgAdd color={isHover ? "#ffffff" : "#0481EF"} />
                    Add Certificate
                </Button>

                {
                    CERTIFICATIONS?.map((certificate) => (
                        <CertificateCard
                            id={certificate?.id}
                            title={certificate?.title}
                            organization={certificate?.organization}
                            expirationDate={certificate?.expiration_date}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete} />
                    ))
                }
            </div>
            <CertificationModal
                openModal={openModal}
                setShowDialog={setOpenModal}
                certificationId={certificationId}
            />

        </>
    )
}

export default CertificationPage