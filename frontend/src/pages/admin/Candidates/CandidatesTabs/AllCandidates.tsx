/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AllCandidateActionHeader from "./AllCandidateActionHeader";
import * as yup from "yup";
import { useGetJobSeekerCandidatesQuery } from "@/services/slices/adminSlice";
import CommonError from "@/components/CommonError/CommonError";
import EMPTY from '@/assets/SuperAdmin/noApplicants.png'
import ApplicantsJobItems from "@/components/superAdmin/TableRow";
import Pagination from "@/components/common/Pagination";
import { Applicant } from "@/types/admin-auth-slice";


export const StepTwoFormYupSchema = yup.object({
    description: yup.string().required("description is required"),
});

const AllCandidates = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("-created_at");
    const [applicantPage, setApplicantPage] = useState(1);

    const { data, isFetching } = useGetJobSeekerCandidatesQuery({
        page, ordering: sortBy, search: search
    }, { refetchOnMountOrArgChange: true });


    // Reset to page 1 when sorting changes
    useEffect(() => {
        setPage(1);
    }, [sortBy]);




    const CANDIDATES = data?.data;

    const handleNextPage = () => {
        if (CANDIDATES?.next) {
            setApplicantPage(applicantPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (CANDIDATES?.previous) {
            setApplicantPage(applicantPage - 1);
        }
    };



    return (
        <div>
            <AllCandidateActionHeader
                setSearch={setSearch}
                search={search}
                setSortBy={setSortBy}
                sortBy={sortBy} />

            {
                !CANDIDATES?.results.length && <div className="py-8 mt-[50px] text-center text-gray-500">
                    <CommonError image={EMPTY} title="No one has applied yet" description="" />
                </div>
            }

            <table className="w-full table-fixed mt-[50px] text-left border-collapse">
                <tbody>

                    {CANDIDATES?.results.map((applicant:Applicant,index) => (
                        <ApplicantsJobItems
                            isShortList={false}
                            key={index}
                            data={applicant}
                        />
                    ))}
                </tbody>
            </table>
            <Pagination
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                page={applicantPage}
                totalPages={Math.ceil((CANDIDATES?.count ?? 0) / 15)}
                isPreviousDisabled={!CANDIDATES?.previous}
                isNextDisabled={!CANDIDATES?.next}
                isFetching={isFetching}
            />
        </div>
    )
}

export default AllCandidates;