import ApplicantsJobItems from "@/components/superAdmin/TableRow";
import CandidateApplicantsInfo from "./CandidateApplicantsInfo";
import { useParams } from "react-router-dom";
import { useGetAllJobsApplicantsQuery } from "@/services/slices/adminSlice";
import { useState } from "react";

interface Applicant {
  applicant_id: number;
  name: string | null;
  phone_number: string | null;
  email: string;
  role: string | null;
  is_open_to_work: boolean;
  address: string | null;
  profile_image_url: string | null;
}

const CandidateApplicants = () => {
  const { id } = useParams<{ id: string }>() as { id: string };

  const [sortBy, setSortBy] = useState("-created_at");
  const { data, isLoading } = useGetAllJobsApplicantsQuery(
    { id, ordering: sortBy },
    { skip: !id, refetchOnMountOrArgChange: true }, // Prevents calling API with undefined id,
  );


  const applicants: Applicant[] = data?.data?.results ?? [];



  return (
    <div className="py-[44px]">
      <CandidateApplicantsInfo sortBy={sortBy} setSortBy={setSortBy} totalApplicants={applicants?.length} />

      {isLoading ? (
        <p className="text-center mt-10">Loading applicants...</p>
      ) : applicants.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">No applicants found.</p>
      ) : (
        <table className="w-full table-fixed text-left border-collapse">
          <tbody>
            {
              applicants.map((applicant) => (
                <ApplicantsJobItems key={applicant.applicant_id} data={applicant} />
              ))
            }
          </tbody>
        </table>


      )}
    </div>
  );
};

export default CandidateApplicants;
