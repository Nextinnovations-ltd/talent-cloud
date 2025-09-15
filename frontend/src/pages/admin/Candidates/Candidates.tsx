import { AllJobsMainTabs } from "../AllJobs/AllJobsMainTabs";

 const Candidates = () => {
  return (
    <div className=" py-[44px] w-[calc(100svw-300px)]">
    <h3 className="text-[24px] font-semibold">Welcome Back!</h3>
    <p className="text-[#575757] mb-[77px]">Here What Happening With Your Jobs.</p>
    
    <div className="flex items-center mb-[80px] justify-between">
        <AllJobsMainTabs 
          title="All Candidates" 
          myJobTotal={0} 
        /></div>
    </div>
  )
}

export default Candidates;
