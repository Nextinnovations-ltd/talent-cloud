import { useState } from "react";
import CandidateTabs from "./CandidatesTabs/CandidateTabs";
import AllCandidates from "./CandidatesTabs/AllCandidates";
import Favourites from "./CandidatesTabs/Favourites";


const Candidates = () => {

  const [tabValues, setTabValues] = useState('all');


  return (
    <div className=" py-[44px] w-[calc(100svw-300px)]">
      <h3 className="text-[24px] font-semibold">Welcome Back!</h3>
      <p className="text-[#575757] mb-[43px]">Here What Happening With Your Jobs.</p>


      <div className="flex items-center mb-[49px] justify-between">
        <CandidateTabs
          tabValues={tabValues}
          setTabValues={setTabValues}
          favourite={0}
          totalApplicants={0}
        />
      </div>
      {
        tabValues === 'all' ? <AllCandidates/>: <Favourites/>
      }
    </div>
  )
}

export default Candidates;
