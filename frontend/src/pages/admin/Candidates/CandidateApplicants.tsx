import ApplicantsJobItems from "@/components/superAdmin/TableRow";
import CandidateApplicantsInfo from "./CandidateApplicantsInfo";
import { useParams } from "react-router-dom";
import { useGetAllApplicantsQuery } from "@/services/slices/adminSlice";

const CandidateApplicants = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetAllApplicantsQuery(id);

  const applicants = data?.data ?? [];

  return (
    <div className="py-[44px]">
      <CandidateApplicantsInfo />

      {isLoading ? (
        <p className="text-center mt-10">Loading applicants...</p>
      ) : applicants.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">No applicants found.</p>
      ) : (
        applicants.map((applicant: any, index: number) => (
          <ApplicantsJobItems key={applicant.id ?? index} data={applicant} />
        ))
      )}
    </div>
  );
};

export default CandidateApplicants;
