import { useEffect, useState } from "react";
import CandidateTabs from "./CandidatesTabs/CandidateTabs";
import AllCandidates from "./CandidatesTabs/AllCandidates";
import Favourites from "./CandidatesTabs/Favourites";
import { useGetJobSeekerCandidatesFavouriteQuery } from "@/services/slices/adminSlice";



const Candidates = () => {

  const [tabValues, setTabValues] = useState('all');
  const [totalApplicant, setTotalApplicants] = useState<number | undefined>(0);
  const [favouriteTotal, setFavouritesTotal] = useState<number | undefined>(0);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("-created_at");


  const { data,isFetching } = useGetJobSeekerCandidatesFavouriteQuery(
    { page, ordering: sortBy, search },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(()=> {
    setFavouritesTotal(data?.data?.count)
  },[data]);
  

  return (
    <div className=" py-[44px] w-[calc(100svw-300px)]">
      <h3 className="text-[24px] font-semibold">Welcome Back!</h3>
      <p className="text-[#575757] mb-[43px]">Here What Happening With Your Jobs.</p>


      <div className="flex items-center mb-[49px] justify-between">
        <CandidateTabs
          tabValues={tabValues}
          setTabValues={setTabValues}
          favourite={favouriteTotal || 0}
          totalApplicants={totalApplicant || 0}
        />
      </div>
      {
        tabValues === 'all' ? 
        <AllCandidates setTotalApplicants={setTotalApplicants} /> :
        <Favourites 
        setFavouritesTotal={setFavouritesTotal}
        setSearch={setSearch}
        setPage={setPage}
        setSortBy={setSortBy}
        search={search}
        page={page}
        sortBy={sortBy}
        isFetching={isFetching}
        data={data}
        />
      }
    </div>
  )
}

export default Candidates;
