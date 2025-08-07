import React, { useState } from "react";
import AllJobsAction from "@/pages/admin/AllJobs/AllJobsActions";
import BackButton from "../BackButton";
import { Users } from "lucide-react";
import SvgPencil from "@/assets/svgs/SvgPencil";
import SvgTrash from "@/assets/svgs/SvgTrash";
import { useNavigate } from "react-router-dom";
import SvgEye from "@/assets/svgs/SvgEye";
import { useDeleteJobMutation } from "@/services/slices/adminSlice";
import useToast from "@/hooks/use-toast";
import ConfirmationDialog from "@/components/superAdmin/ShortListDialog";

interface JobCandidatesInfoHeaderProps {
    side: 'preview' | 'applicants';
    id: string;
}

const JobCandidatesInfoHeader: React.FC<JobCandidatesInfoHeaderProps> = ({ side, id }) => {

    const navigation = useNavigate();
    const [deleteJob, { isLoading }] = useDeleteJobMutation();
    const { showNotification } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const handleDelete = async () => {
        if (id) {
            const response = await deleteJob(id);
            showNotification({ message: response?.data?.message, type: 'success' });
            setIsDialogOpen(false);

            navigation('/admin/dashboard/allJobs')
        }
    }

    const handleBack = () => {
        navigation('/admin/dashboard/allJobs')
    };

    return (
        <>
            <div className="w-full mb-[65px] flex gap-[50px] justify-start items-center">
                <BackButton className="w-[48px] h-[48px]" handleBack={handleBack} />
                <nav className="flex items-center gap-[48px]">
                    {side === 'preview' && (
                        <AllJobsAction onClick={() => {
                            navigation(`/admin/dashboard/allJobs/details/applicants/${id}`)
                        }} icon={<Users />} label="Applicants" />
                    )}
                    {side === 'applicants' && (
                        <AllJobsAction onClick={() => {
                            navigation(`/admin/dashboard/allJobs/${id}`)
                        }} icon={<SvgEye />} label="Jobs Overviews" />
                    )}
                    <AllJobsAction onClick={() => {
                        navigation(`/admin/dashboard/allJobs/editJobs/${id}`)
                    }} icon={<SvgPencil />} label="Edit Job Post" />
                    <AllJobsAction onClick={() => setIsDialogOpen(true)} icon={<SvgTrash />} label="Delete Post" />
                </nav>
            </div>
            <ConfirmationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleDelete}
                isLoading={isLoading}
                title="Confirm Action"
                description="Are you sure you want to perform this action?"
            />
        </>
    );
};

export default JobCandidatesInfoHeader;
