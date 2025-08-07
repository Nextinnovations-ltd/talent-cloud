import Pagination from "@/components/common/Pagination";
import ApplicantsJobItems from "@/components/superAdmin/TableRow";
import { Applicant, PaginatedData } from "@/types/admin-auth-slice";
import { Dispatch, SetStateAction } from "react";

interface ShortlistApplicantsViewProps {
    applicants: PaginatedData<Applicant> | undefined;
    shortListPage: number;
    setShortListPage: Dispatch<SetStateAction<number>>;
    isFetching: boolean;
}

const ShortlistApplicantsView: React.FC<ShortlistApplicantsViewProps> = ({
    applicants,
    shortListPage,
    setShortListPage,
    isFetching,
}) => {


    const handleNextPage = () => {
        if (applicants?.next) {
            setShortListPage(shortListPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (applicants?.previous) {
            setShortListPage(shortListPage - 1);
        }
    };

    if (!applicants?.results.length) {
        return <div className="py-8 text-center text-gray-500">No applicants found</div>;
    }

    return (
        <>
            <table className="w-full table-fixed text-left border-collapse">
                <tbody>
                    {
                        applicants.results.map((applicant) => (
                            <ApplicantsJobItems 
                            isShortList
                            key={applicant.applicant_id} 
                            data={applicant} />
                        ))
                    }
                </tbody>
            </table>
            <Pagination
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                page={shortListPage}
                totalPages={Math.ceil((applicants.count ?? 0) / 15)}
                isPreviousDisabled={!applicants.previous}
                isNextDisabled={!applicants.next}
                isFetching={isFetching}
            />
        </>
    )
}

export default ShortlistApplicantsView;