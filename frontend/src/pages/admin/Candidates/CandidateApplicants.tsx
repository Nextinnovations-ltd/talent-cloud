import CandidateApplicantsInfo from "./CandidateApplicantsInfo";
import { useGetAllJobsApplicantsQuery, useGetAllShortListApplicantsQuery } from "@/services/slices/adminSlice";
import { useParams } from 'react-router-dom';
import JobCandidatesInfoHeader from "@/components/common/Admin/JobCandidatesInfoHeader";
import AllApplicantsView from "./AllApplicantsView";
import ShortlistApplicantsView from "./ShortlistApplicantsView";
import { Applicant } from "@/types/admin-auth-slice";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you're using shadcn/ui or similar


const CandidateApplicants = () => {
  const { id } = useParams<{ id: string }>() as { id: string };
  const [applicantPage, setApplicantPage] = useState(1);
  const [shortListPage, setShortListPage] = useState(1);

  const [sortBy, setSortBy] = useState("-created_at");
  const { data, isLoading: isLoadingAllApplicants, isFetching: isFetchingAllApplicants } = useGetAllJobsApplicantsQuery(
    { id, ordering: sortBy, page: applicantPage },
    { skip: !id, refetchOnMountOrArgChange: true },
  );

  const { data: SHORTLISTDATA, isLoading: isLoadingShortlist, isFetching: isFetchingShortlist } = useGetAllShortListApplicantsQuery({ id, ordering: sortBy, page: 1 },
    { skip: !id, refetchOnMountOrArgChange: true },);

  const [tabValues, setTabValues] = useState('account');

  const applicants: Applicant[] = data?.data?.results ?? [];
  const shortApplicants: Applicant[] = SHORTLISTDATA?.data?.results ?? [];



  // Determine if we're currently loading based on the active tab
  const isLoading = tabValues === "account"
    ? (isLoadingAllApplicants || isFetchingAllApplicants)
    : (isLoadingShortlist || isFetchingShortlist);

  return (
    <div className="mt-3">
      <JobCandidatesInfoHeader side="applicants" id={id} />

      <CandidateApplicantsInfo
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalApplicants={applicants?.length}
        totalShortApplicants={shortApplicants?.length}
        tabValues={tabValues}
        setTabValues={setTabValues}
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[132px] bg-slate-100/50 w-full" />
          <Skeleton className="h-[132px] bg-slate-100/50 w-full" />
          <Skeleton className="h-[132px] bg-slate-100/50 w-full" />
          <Skeleton className="h-[132px] bg-slate-100/50 w-full" />
        </div>
      ) : (
        <>
          {tabValues === "account" && (
            <AllApplicantsView
              applicantPage={applicantPage}
              setApplicantPage={setApplicantPage}
              applicants={data?.data}
              isFetching={isLoadingAllApplicants} />
          )}

          {tabValues === "shortlists" && (
            <ShortlistApplicantsView
              shortListPage={shortListPage}
              setShortListPage={setShortListPage}
              applicants={SHORTLISTDATA?.data}
              isFetching={isLoadingShortlist}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CandidateApplicants;