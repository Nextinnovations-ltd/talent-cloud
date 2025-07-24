import RecentApplicant from "@/components/superAdmin/RecentApplicant"
import { RecenTitles } from "./RecenTitles"

const RecentApplications = () => {
  return (
    <div className="w-1/2 flex flex-col gap-5">
        <RecenTitles/>
        <RecentApplicant/>
        <RecentApplicant/>
        <RecentApplicant/>
        <RecentApplicant/>

    </div>
  )
}

export default RecentApplications
