import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AllJobTabsProps {
  myJobTotal: number;
  title?: string;
  tabValues: string;
  setTabValues: React.Dispatch<React.SetStateAction<string>>;
  totalShortApplicants:number
}

const AllJobsTabs = ({ myJobTotal, title = "Jobs", tabValues, setTabValues,totalShortApplicants }: AllJobTabsProps) => {
  return (
    <Tabs value={tabValues} onValueChange={setTabValues} className="w-[400px]">
      <TabsList className="h-[50px]">
        <TabsTrigger className="px-[24px] py-[10px]" value="account">
          {title}
          <span className="w-[32px] ml-[8px] h-[32px] rounded-full bg-[#CAE6FF] flex items-center justify-center text-[#0389FF]">
            {myJobTotal}
          </span>
        </TabsTrigger>

        {/* ✅ New tab */}
        <TabsTrigger className="px-[24px] py-[10px]" value="shortlists">
          Shortlist
          <span className="w-[32px] ml-[8px] h-[32px] rounded-full bg-[#CAE6FF] flex items-center justify-center text-[#0389FF]">
            {totalShortApplicants}
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default AllJobsTabs;
