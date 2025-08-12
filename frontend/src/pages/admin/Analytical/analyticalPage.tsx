import AnalyticalCharts from "./analyticalCharts";
import RecentApplications from "./Recents/RecentApplications";
import RecentJobsLists from "./Recents/RecentJobsLists";


const AnalyticalPage = () => {


  
  return (
    <div className=" py-[44px] w-[calc(100svw-300px)]">
      <h3 className="text-[24px] font-semibold">Welcome Back!</h3>
      <p className="text-[#575757]">Here What happening with yours jobs</p>
      <AnalyticalCharts />
      <div className="flex gap-5 mt-[38px] ">
        <RecentJobsLists/>
        <RecentApplications/>
      </div>
    </div>
  )
}

export default AnalyticalPage;
