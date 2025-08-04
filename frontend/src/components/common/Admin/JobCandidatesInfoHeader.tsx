import React from "react";
import AllJobsAction from "@/pages/admin/AllJobs/AllJobsActions";
import BackButton from "../BackButton";
import { Users } from "lucide-react";
import SvgPencil from "@/assets/svgs/SvgPencil";
import SvgTrash from "@/assets/svgs/SvgTrash";
import { useNavigate } from "react-router-dom";

interface JobCandidatesInfoHeaderProps {
    side: 'preview' | 'applicants';
    id: string;
}

const JobCandidatesInfoHeader: React.FC<JobCandidatesInfoHeaderProps> = ({ side, id }) => {

    const navigation = useNavigate();

    const handleBack = () => {
        navigation('/admin/dashboard/allJobs')
    };

    return (
        <div className="w-full mb-[65px] flex gap-[40px] justify-start items-center">
            <BackButton className="w-[48px] h-[48px]" handleBack={handleBack} />
            <nav className="flex items-center gap-[48px]">
                <h3>1 Hour ago</h3>
                {side === 'preview' && (
                    <AllJobsAction onClick={() => {
                        navigation(`/admin/dashboard/allJobs/details/applicants/${id}`)
                    }} icon={<Users />} label="View Applicants" />
                )}
                {side === 'applicants' && (
                    <AllJobsAction onClick={() => {

                        navigation(`/admin/dashboard/allJobs/${id}`)
                    }} icon={<Users />} label="View Preview" />
                )}
                <AllJobsAction onClick={() => { }} icon={<SvgPencil />} label="Edit Job Post" />
                <AllJobsAction onClick={() => { }} icon={<SvgTrash />} label="Delete Post" />
            </nav>
        </div>
    );
};

export default JobCandidatesInfoHeader;
