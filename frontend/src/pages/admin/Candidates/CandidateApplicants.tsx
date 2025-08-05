
import CandidateApplicantsInfo from "./CandidateApplicantsInfo";
import { useGetAllJobsApplicantsQuery, useGetAllShortListApplicantsQuery } from "@/services/slices/adminSlice";
import { useParams } from 'react-router-dom';
import JobCandidatesInfoHeader from "@/components/common/Admin/JobCandidatesInfoHeader";
import AllApplicantsView from "./AllApplicantsView";
import ShortlistApplicantsView from "./ShortlistApplicantsView";
import { Applicant } from "@/types/admin-auth-slice";
import { useState } from "react";


const CandidateApplicants = () => {
  const { id } = useParams<{ id: string }>() as { id: string };

  const [sortBy, setSortBy] = useState("-created_at");
  const { data } = useGetAllJobsApplicantsQuery(
    { id, ordering: sortBy },
    { skip: !id, refetchOnMountOrArgChange: true }, // Prevents calling API with undefined id,
  );

  const {data:SHORTLISTDATA} = useGetAllShortListApplicantsQuery(id);




  const [tabValues, setTabValues] = useState('account');

  const applicants: Applicant[] = data?.data?.results ?? [];

  const shortApplicants: Applicant[] = SHORTLISTDATA?.data?.results ?? [];



  return (
    <div className="mt-3">
      <JobCandidatesInfoHeader side="applicants" id={id} />

      <CandidateApplicantsInfo 
       sortBy={sortBy} 
       setSortBy={setSortBy} 
       totalApplicants={applicants?.length} 
       totalShortApplicants={shortApplicants?.length}
       tabValues={tabValues} 
       setTabValues={setTabValues} />

      {tabValues === "account" && (
        <AllApplicantsView applicants={applicants} />
      )}

      {tabValues === "shortlists" && (
        <ShortlistApplicantsView applicants={shortApplicants} />
      )}
    </div>
  );
};

export default CandidateApplicants;
