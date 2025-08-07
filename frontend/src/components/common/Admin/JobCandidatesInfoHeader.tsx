import React from "react";
import AllJobsAction from "@/pages/admin/AllJobs/AllJobsActions";
import BackButton from "../BackButton";
import { Users } from "lucide-react";
import SvgPencil from "@/assets/svgs/SvgPencil";
import SvgTrash from "@/assets/svgs/SvgTrash";
import { useNavigate } from "react-router-dom";
import SvgEye from "@/assets/svgs/SvgEye";
import { useDeleteJobMutation } from "@/services/slices/adminSlice";

interface JobCandidatesInfoHeaderProps {
    side: 'preview' | 'applicants';
    id: string;
}

const JobCandidatesInfoHeader: React.FC<JobCandidatesInfoHeaderProps> = ({ side, id }) => {

    const navigation = useNavigate();
    const [deleteJob] = useDeleteJobMutation();


    const handleDelete = async () => {
        console.log(id)
        if (id) {
            deleteJob(id);
        }
    }

    const handleBack = () => {
        navigation('/admin/dashboard/allJobs')
    };

    return (
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
                <AllJobsAction onClick={handleDelete} icon={<SvgTrash />} label="Delete Post" />
            </nav>
        </div>
    );
};

export default JobCandidatesInfoHeader;
