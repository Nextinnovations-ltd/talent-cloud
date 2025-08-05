import ApplicantsJobItems from "@/components/superAdmin/TableRow";
import { Applicant } from "@/types/admin-auth-slice";

interface AllApplicantsViewProps {
    applicants: Applicant[]
}

const AllApplicantsView: React.FC<AllApplicantsViewProps> = ({ applicants }) => {
    return (
        <table className="w-full table-fixed text-left border-collapse">
            <tbody>
                {
                    applicants.map((applicant) => (
                        <ApplicantsJobItems key={applicant.applicant_id} data={applicant} />
                    ))
                }
            </tbody>
        </table>
    )
}

export default AllApplicantsView;
