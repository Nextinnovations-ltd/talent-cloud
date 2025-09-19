import { useEffect, useState } from "react";
import AllCandidateActionHeader from "./AllCandidateActionHeader";
import * as yup from "yup";
import { useGetJobSeekerCandidatesQuery } from "@/services/slices/adminSlice";
import CommonError from "@/components/CommonError/CommonError";
import EMPTY from '@/assets/SuperAdmin/noApplicants.png'
import ApplicantsJobItems from "@/components/superAdmin/TableRow";
import Pagination from "@/components/common/Pagination";
import { Applicant } from "@/types/admin-auth-slice";
import { useDebounce } from "@/hooks/use-debounce";


export const StepTwoFormYupSchema = yup.object({
    description: yup.string().required("description is required"),
});

type AllCandidatesProps = {
    setTotalApplicants: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const AllCandidates: React.FC<AllCandidatesProps> = ({ setTotalApplicants }) => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState("-created_at");

    // ✅ Debounced search value
    const debouncedSearch = useDebounce(search, 1000);

    const { data, isFetching } = useGetJobSeekerCandidatesQuery(
        { page, ordering: sortBy, search: debouncedSearch },
        { refetchOnMountOrArgChange: true }
    );

    // Reset to page 1 when sorting or search changes
    useEffect(() => {
        setPage(1);
    }, [sortBy, debouncedSearch]);

    const CANDIDATES = data?.data;

    const handleNextPage = () => {
        if (CANDIDATES?.next) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (CANDIDATES?.previous && page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    useEffect(() => {
        setTotalApplicants(CANDIDATES?.count || 0)
    }, [CANDIDATES, setTotalApplicants]);

    return (
        <div>
            <AllCandidateActionHeader
                setSearch={setSearch}
                search={search}
                setSortBy={setSortBy}
                sortBy={sortBy}
            />

            {!CANDIDATES?.results?.length && (
                <div className="py-8 mt-[50px] text-center text-gray-500">
                    <CommonError image={EMPTY} title="No one has applied yet" description="" />
                </div>
            )}

            <table className="w-full table-fixed mt-[50px] text-left border-collapse">
                <tbody>
                    {CANDIDATES?.results?.map((applicant: Applicant, index: number) => (
                        <ApplicantsJobItems
                            isShortList={true}
                            key={index}
                            data={applicant}
                            isDownLoadCover={false}
                            favourite={true}
                        />
                    ))}
                </tbody>
            </table>

            <Pagination
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                page={page}
                totalPages={Math.ceil((CANDIDATES?.count ?? 0) / 15)}
                isPreviousDisabled={!CANDIDATES?.previous}
                isNextDisabled={!CANDIDATES?.next}
                isFetching={isFetching}
            />
        </div>
    );
};

export default AllCandidates;
