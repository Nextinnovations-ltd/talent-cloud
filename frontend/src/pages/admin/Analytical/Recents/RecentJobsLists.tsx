import RecentJobCard from "@/components/superAdmin/RecentJobCard"
import { RecenTitles } from "./RecenTitles"

 const RecentJobsLists = () => {
  return (
    <div className="w-1/2 flex flex-col gap-5">
        <RecenTitles/>
        <RecentJobCard/>
        <RecentJobCard/>
        <RecentJobCard/>
        <RecentJobCard/>
    </div>
  )
}

export default RecentJobsLists
