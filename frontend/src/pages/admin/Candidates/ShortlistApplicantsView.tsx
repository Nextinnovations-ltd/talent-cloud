import ApplicantsJobItems from "@/components/superAdmin/TableRow";
import { Applicant } from "@/types/admin-auth-slice";

interface ShortlistApplicantsViewProps {
    applicants: Applicant[]
}

const ShortlistApplicantsView: React.FC<ShortlistApplicantsViewProps> = ({ applicants }) => {


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

export default ShortlistApplicantsView;