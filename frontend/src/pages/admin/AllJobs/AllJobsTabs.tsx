
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AllJobTabsProps {
  myJobTotal:number
}

 const AllJobsTabs = ({myJobTotal}:AllJobTabsProps) => {
  return (
    <Tabs defaultValue="account" className="w-[400px] ">
    <TabsList className="h-[50px]">
      <TabsTrigger className="w-[160px] px-[24px] py-[10px] " value="account">My Jobs

     <span className="w-[32px] ml-[8px] h-[32px] rounded-full bg-[#CAE6FF] flex items-center justify-center text-[#0389FF]">{myJobTotal}</span>

      </TabsTrigger>
    </TabsList>
  </Tabs>)
}

export default AllJobsTabs;