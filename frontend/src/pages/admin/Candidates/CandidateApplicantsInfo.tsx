import { useParams } from "react-router-dom";
import AllJobsTabs from "../AllJobs/AllJobsTabs";
import SortsButtons from "../AllJobs/SortsButtons";
import React from "react";

interface CandidateApplicantsInfoProps {
    totalApplicants:number;
    totalShortApplicants:number;
    sortBy:string;
    setSortBy:React.Dispatch<React.SetStateAction<string>>,
    tabValues:string;
    setTabValues:React.Dispatch<React.SetStateAction<string>>
}

const CandidateApplicantsInfo = ({ totalApplicants,sortBy,setSortBy,tabValues,setTabValues,totalShortApplicants }: CandidateApplicantsInfoProps) => {

    const { id } = useParams();

    if (!id) {
        return <div>Invalid job ID</div>;
    }   


    return (
        <div>
            <div className="flex items-center mb-[20px] justify-between">
                <AllJobsTabs 
                tabValues={tabValues} 
                setTabValues={setTabValues} 
                myJobTotal={totalApplicants} 
                totalShortApplicants={totalShortApplicants}
                title="All Applicants" />
                <div className="flex items-center justify-center pr-[24px] gap-4">
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
