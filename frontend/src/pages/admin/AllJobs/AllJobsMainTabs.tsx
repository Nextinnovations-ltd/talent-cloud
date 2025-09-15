import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AllJobTabsProps {
    myJobTotal: number;
    title:string
  }

export const AllJobsMainTabs:React.FC<AllJobTabsProps> = ({title,myJobTotal}) => {
  return (
    <Tabs className="w-[400px]">
      <TabsList className="h-[50px]">
        <TabsTrigger className="px-[24px] py-[10px]" value="account">
          {title}
          <span className="w-[48px] ml-[8px] h-[48px] rounded-full bg-[#CAE6FF] flex items-center justify-center text-[#0389FF]">
            {myJobTotal}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
