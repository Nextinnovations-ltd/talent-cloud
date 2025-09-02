import Pagination from "@/components/common/Pagination";
import CommonError from "@/components/CommonError/CommonError";
import ApplicantsJobItems from "@/components/superAdmin/TableRow";
import { Applicant, PaginatedData } from "@/types/admin-auth-slice";
import { Dispatch, SetStateAction } from "react";
import EMPTY from '@/assets/SuperAdmin/noApplicants.png'
interface AllApplicantsViewProps {
    applicants: PaginatedData<Applicant> | undefined;
    applicantPage: number;
    setApplicantPage: Dispatch<SetStateAction<number>>;
    isFetching: boolean;
}

const AllApplicantsView: React.FC<AllApplicantsViewProps> = ({
    applicants,
    applicantPage,
    setApplicantPage,
    isFetching,
}) => {
    const handleNextPage = () => {
        if (applicants?.next) {
            setApplicantPage(applicantPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (applicants?.previous) {
            setApplicantPage(applicantPage - 1);
        }
    };

    console.log("kdkdkd")
    console.log(applicants)
    console.log("kdkdkd")



    if (!applicants?.results.length) {
        return <div className="py-8 text-center text-gray-500">
            <CommonError image={EMPTY} title="No one has applied yet" description="" />
        </div>;
    }

    return (
        <>
            <table className="w-full table-fixed text-left border-collapse">
                <tbody>
                    {applicants.results.map((applicant) => (
                        <ApplicantsJobItems
                            isShortList={false}
                            key={applicant.applicant_id}
                            data={applicant}
                        />
                    ))}
                </tbody>
            </table>

            <Pagination
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                page={applicantPage}
                totalPages={Math.ceil((applicants.count ?? 0) / 15)}
                isPreviousDisabled={!applicants.previous}
                isNextDisabled={!applicants.next}
                isFetching={isFetching}
            />
        </>
    );
};

export default AllApplicantsView;