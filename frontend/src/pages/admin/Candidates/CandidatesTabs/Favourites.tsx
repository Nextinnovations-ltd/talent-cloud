/* eslint-disable @typescript-eslint/no-explicit-any */
import { Applicant } from "@/types/admin-auth-slice";
import { useEffect } from "react";
import AllCandidateActionHeader from "./AllCandidateActionHeader";
import CommonError from "@/components/CommonError/CommonError";
import EMPTY from '@/assets/SuperAdmin/noApplicants.png'
import ApplicantsJobItems from "@/components/superAdmin/TableRow";
import Pagination from "@/components/common/Pagination";
import { useDebounce } from "@/hooks/use-debounce";


type FavouritesProps = {
  setFavouritesTotal: React.Dispatch<React.SetStateAction<number | undefined>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  page: number;
  sortBy: string;
  isFetching: boolean;
  data: any;
};

const Favourites: React.FC<FavouritesProps> = ({ 
  setFavouritesTotal,
  setSearch,
  setPage,
  setSortBy,
  search,
  page,
  sortBy,
  isFetching,
  data
}) => {
  const debouncedSearch = useDebounce(search, 1000);


  useEffect(() => {
    setPage(1);
  }, [sortBy, debouncedSearch, setPage]);

  const CANDIDATES = data?.data;

  const handleNextPage = () => {
    if (CANDIDATES?.next) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (CANDIDATES?.previous && page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    setFavouritesTotal(CANDIDATES?.count || 0);
  }, [CANDIDATES, setFavouritesTotal]);

  return (
    <div>
      <AllCandidateActionHeader
        setSearch={setSearch}
        search={search}
        setSortBy={setSortBy}
        sortBy={sortBy}
      />

      {!CANDIDATES?.results?.length && (
        <div className="py-8 mt-[50px] text-center text-gray-500">
          <CommonError image={EMPTY} title="No favourite yet" description="" />
        </div>
      )}

      <table className="w-full table-fixed mt-[50px] text-left border-collapse">
        <tbody>
          {CANDIDATES?.results?.map((applicant: Applicant, index: number) => (
            <ApplicantsJobItems
              isShortList={true}
              key={index}
              data={applicant}
              isDownLoadCover={false}
              favourite={false}
              removeFavourite={true}
            />
          ))}
        </tbody>
      </table>

      <Pagination
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        page={page}
        totalPages={Math.ceil((CANDIDATES?.count ?? 0) / 15)}
        isPreviousDisabled={!CANDIDATES?.previous}
        isNextDisabled={!CANDIDATES?.next}
        isFetching={isFetching}
      />
    </div>
  );
};

export default Favourites;
