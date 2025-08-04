import { useParams } from "react-router-dom";
import AllJobsTabs from "../AllJobs/AllJobsTabs";
import SortsButtons from "../AllJobs/SortsButtons";

const CandidateApplicantsInfo = ({ totalApplicants,sortBy,setSortBy }: { totalApplicants: number,sortBy:string,setSortBy: React.Dispatch<React.SetStateAction<string>>; }) => {

    const { id } = useParams();

   

    if (!id) {
        return <div>Invalid job ID</div>;
    }   



    return (
        <div>
            <div className="flex items-center mb-[20px] justify-between">
                <AllJobsTabs myJobTotal={totalApplicants} title="All Applicants" />
                <div className="flex items-center justify-center pr-[24px] gap-4">

                    <SortsButtons
                        title="Applicants"
                        field="applicant_count"
                        currentSort={sortBy}
                        onToggle={setSortBy}
                    />
                    <SortsButtons
                        title="View"
                        field="view_count"
                        currentSort={sortBy}
                        onToggle={setSortBy}
                    />
                    <SortsButtons
                        title="Date"
                        field="created_at"
                        currentSort={sortBy}
                        onToggle={setSortBy}
                    />
                </div>
            </div>
        </div>
    )
}

export default CandidateApplicantsInfo;
